"use client";
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { dropAPI } from "@/lib/api/dropAPI";

const DropContext = createContext(null);

const initialState = {
    products: [],
    holds: [],
    status: "idle", // idle | loading | error | ready
    checkout: { state: "idle", error: null, orderId: null }, // idle|reviewing|confirming|success|failed
};

function reducer(state, action) {
    switch (action.type) {
        case "LOAD_START":
            return { ...state, status: "loading" };
        case "LOAD_SUCCESS":
            return { ...state, status: "ready", products: action.products, holds: action.holds };
        case "LOAD_ERROR":
            return { ...state, status: "error" };
        case "HOLD_PLACED":
            return { ...state, holds: [...state.holds, action.hold] };
        case "HOLD_REMOVED":
            return { ...state, holds: state.holds.filter((h) => h.id !== action.holdId) };
        case "SET_CHECKOUT":
            return { ...state, checkout: { ...state.checkout, ...action.payload } };
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

    const placeHold = useCallback(async (productId) => {
        const hold = await dropAPI.placeHold(productId); // let it throw; component shows the error
        dispatch({ type: "HOLD_PLACED", hold });
        return hold;
    }, []);

    const releaseHold = useCallback(async (holdId) => {
        await dropAPI.releaseHold(holdId);
        dispatch({ type: "HOLD_REMOVED", holdId });
    }, []);

    const confirmCheckout = useCallback(async (holdIds) => {
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
    }, [state.products]);

    return (
        <DropContext.Provider value={{ ...state, refresh, placeHold, releaseHold, confirmCheckout }}>
            {children}
        </DropContext.Provider>
    );
}

export const useDropStore = () => useContext(DropContext);