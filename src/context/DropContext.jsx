"use client";

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { dropAPI } from "@/lib/api/dropAPI";
import { uid } from "@/lib/api/utils";

const DropContext = createContext(null);
const HOLD_DURATION_MS = 60_000;

const initialState = {
    products: [],
    holds: [],
    status: "idle", // idle | loading | error | ready
    checkout: { state: "idle", error: null, orderId: null }, // idle|reviewing|confirming|success|failed
    notice: null, // transient banner e.g. { type: 'error', text }
};

// Immutable helper: adjust a product's stock by delta and flip status
// live <-> sold_out accordingly. Used by optimistic hold add/remove/rollback.
function adjustStock(products, productId, delta) {
    return products.map((p) => {
        if (p.id !== productId) return p;
        const stock = Math.max(0, p.stock + delta);
        let status = p.status;
        if (status === "live" && stock === 0) status = "sold_out";
        if (status === "sold_out" && stock > 0) status = "live";
        return { ...p, stock, status };
    });
}

function reducer(state, action) {
    switch (action.type) {
        case "LOAD_START":
            return { ...state, status: "loading" };
        case "LOAD_SUCCESS":
            return { ...state, status: "ready", products: action.products, holds: action.holds };
        case "LOAD_ERROR":
            return { ...state, status: "error" };

        // --- optimistic add-to-cart ---
        case "HOLD_ADD_OPTIMISTIC":
            return {
                ...state,
                holds: [...state.holds, action.hold],
                products: adjustStock(state.products, action.productId, -1),
                checkout: { state: "idle", error: null, orderId: null }, // fresh cart activity
            };
        case "HOLD_CONFIRM":
            // swap the temp optimistic hold for the server's authoritative one
            return {
                ...state,
                holds: state.holds.map((h) => (h.id === action.tempId ? { ...action.hold } : h)),
            };
        case "HOLD_ROLLBACK":
            // server rejected the hold (e.g. someone else took the last unit)
            return {
                ...state,
                holds: state.holds.filter((h) => h.id !== action.tempId),
                products: adjustStock(state.products, action.productId, 1),
            };

        // --- optimistic release ---
        case "HOLD_REMOVE_OPTIMISTIC":
            return {
                ...state,
                holds: state.holds.filter((h) => h.id !== action.holdId),
                products: adjustStock(state.products, action.productId, 1),
            };
        case "HOLD_RESTORE":
            // release call failed server-side — put the hold back
            return {
                ...state,
                holds: [...state.holds, action.hold],
                products: adjustStock(state.products, action.productId, -1),
            };

        case "SET_CHECKOUT":
            return { ...state, checkout: { ...state.checkout, ...action.payload } };
        case "RESET_CHECKOUT":
            return { ...state, checkout: { state: "idle", error: null, orderId: null } };

        case "SET_NOTICE":
            return { ...state, notice: action.notice };
        case "CLEAR_NOTICE":
            return { ...state, notice: null };

        default:
            return state;
    }
}

export function DropProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const refresh = useCallback(async () => {
        try {
            dispatch({ type: "LOAD_START" });
            const [products, holds] = await Promise.all([dropAPI.getProducts(), dropAPI.getHolds()]);
            dispatch({ type: "LOAD_SUCCESS", products, holds });
        } catch (e) {
            dispatch({ type: "LOAD_ERROR" });
        }
    }, []);

    useEffect(() => {
        refresh();
        const poll = setInterval(refresh, 5000); // keeps stock/watchers/expiry in sync
        return () => clearInterval(poll);
    }, [refresh]);

    // Optimistic: UI updates instantly on click. Server call runs in the
    // background; on success we swap in the real hold (real id/expiresAt),
    // on failure we roll back the local hold + stock change and let the
    // caller (ProductCard) show its own error message.
    const placeHold = useCallback(
        async (productId) => {
            const product = state.products.find((p) => p.id === productId);
            if (!product || product.status !== "live" || product.stock < 1) {
                throw new Error("OUT_OF_STOCK");
            }

            const tempId = `temp-${uid()}`;
            const optimisticHold = {
                id: tempId,
                productId,
                productName: product.name,
                price: product.price,
                expiresAt: Date.now() + HOLD_DURATION_MS,
                status: "active",
            };

            dispatch({ type: "HOLD_ADD_OPTIMISTIC", hold: optimisticHold, productId });

            try {
                const realHold = await dropAPI.placeHold(productId);
                dispatch({ type: "HOLD_CONFIRM", tempId, hold: realHold });
                return realHold;
            } catch (e) {
                dispatch({ type: "HOLD_ROLLBACK", tempId, productId });
                throw e; // ProductCard still shows its own inline message
            }
        },
        [state.products]
    );

    // Optimistic: hold disappears from the panel instantly. On failure we
    // restore it and surface a transient notice, but don't rethrow — this
    // is a background reconciliation, not something the button needs to
    // block on.
    const releaseHold = useCallback(async (hold) => {
        dispatch({ type: "HOLD_REMOVE_OPTIMISTIC", holdId: hold.id, productId: hold.productId });
        try {
            await dropAPI.releaseHold(hold.id);
        } catch (e) {
            dispatch({ type: "HOLD_RESTORE", hold, productId: hold.productId });
            dispatch({
                type: "SET_NOTICE",
                notice: { type: "error", text: `Couldn't release ${hold.productName} — try again` },
            });
        }
    }, []);

    const confirmCheckout = useCallback(
        async (holdIds) => {
            dispatch({ type: "SET_CHECKOUT", payload: { state: "confirming", error: null } });
            try {
                const result = await dropAPI.confirmCheckout(holdIds);
                dispatch({ type: "SET_CHECKOUT", payload: { state: "success", orderId: result.orderId } });
                dispatch({ type: "LOAD_SUCCESS", products: state.products, holds: [] });
            } catch (e) {
                dispatch({
                    type: "SET_CHECKOUT",
                    payload: { state: "failed", error: e.message },
                });
            }
        },
        [state.products]
    );

    const resetCheckout = useCallback(() => {
        dispatch({ type: "RESET_CHECKOUT" });
    }, []);

    const clearNotice = useCallback(() => {
        dispatch({ type: "CLEAR_NOTICE" });
    }, []);

    return (
        <DropContext.Provider
            value={{
                ...state,
                refresh,
                placeHold,
                releaseHold,
                confirmCheckout,
                resetCheckout,
                clearNotice,
            }}
        >
            {children}
        </DropContext.Provider>
    );
}

export const useDropStore = () => useContext(DropContext);