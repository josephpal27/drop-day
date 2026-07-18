import { uid, sleep } from "./utils";

const HOLD_DURATION_MS = 60_000;

// in-memory "database"
let products = [
    { id: "p1", name: "Ember Runner Sneaker", price: 7499, stock: 6, status: "live", watchers: 0, image: "1" },
    { id: "p2", name: "Aurora Tote Bag", price: 2999, stock: 3, status: "live", watchers: 0, image: "3" },
    { id: "p3", name: "Nova Cap", price: 1499, stock: 0, status: "sold_out", watchers: 0, image: "2" },
    { id: "p4", name: "Drift Hoodie", price: 4999, stock: 8, status: "live", watchers: 0, image: "4" },
    { id: "p5", name: "Glass Watch", price: 12999, stock: 2, status: "live", watchers: 0, image: "5" },
    {
        id: "p6",
        name: "Kite Jacket",
        price: 8999,
        stock: 5,
        status: "dropping_soon",
        dropTime: Date.now() + 90_000,
        watchers: 0,
        image: "6",
    },
    {
        id: "p7",
        name: "Headphones",
        price: 6499,
        stock: 4,
        status: "dropping_soon",
        dropTime: Date.now() + 180_000,
        watchers: 0,
        image: "7",
    },
    { id: "p8", name: "Solstice Scarf", price: 2199, stock: 7, status: "live", watchers: 0, image: "9" },
    { id: "p9", name: "Earbuds", price: 10999, stock: 0, status: "sold_out", watchers: 0, image: "8" },
    { id: "p10", name: "Halo Sunglasses", price: 3999, stock: 5, status: "live", watchers: 0, image: "10" },
];

// holds: { id, productId, expiresAt, status: 'active' | 'expired' | 'released' | 'consumed' }
let holds = [];

function releaseExpiredHolds() {
    const now = Date.now();
    holds.forEach((h) => {
        if (h.status === "active" && h.expiresAt <= now) {
            h.status = "expired";
            const product = products.find((p) => p.id === h.productId);
            if (product) {
                product.stock += 1;
                if (product.status === "sold_out") product.status = "live";
            }
        }
    });
}

function promoteDroppingSoon() {
    const now = Date.now();
    products.forEach((p) => {
        if (p.status === "dropping_soon" && p.dropTime <= now) {
            p.status = p.stock > 0 ? "live" : "sold_out";
        }
    });
}

// Simulated other shoppers — randomly eat stock from live products
setInterval(() => {
    releaseExpiredHolds();
    promoteDroppingSoon();
    const live = products.filter((p) => p.status === "live" && p.stock > 0);
    if (live.length && Math.random() < 0.35) {
        const target = live[Math.floor(Math.random() * live.length)];
        target.stock = Math.max(0, target.stock - 1);
        if (target.stock === 0) target.status = "sold_out";
    }
    products.forEach((p) => {
        if (p.status === "live") {
            p.watchers = Math.max(0, p.watchers + Math.floor(Math.random() * 5) - 2);
        }
    });
}, 4000);

export const mockServer = {
    async getProducts() {
        releaseExpiredHolds();
        promoteDroppingSoon();
        return products.map((p) => ({ ...p }));
    },

    async placeHold(productId) {
        releaseExpiredHolds();
        const product = products.find((p) => p.id === productId);
        if (!product || product.status !== "live" || product.stock < 1) {
            throw new Error("OUT_OF_STOCK");
        }
        product.stock -= 1;
        if (product.stock === 0) product.status = "sold_out";
        const hold = {
            id: uid(),
            productId,
            productName: product.name,
            price: product.price,
            expiresAt: Date.now() + HOLD_DURATION_MS,
            status: "active",
        };
        holds.push(hold);
        return { ...hold };
    },

    async releaseHold(holdId) {
        releaseExpiredHolds();
        const hold = holds.find((h) => h.id === holdId);
        if (!hold || hold.status !== "active") throw new Error("HOLD_NOT_FOUND");
        hold.status = "released";
        const product = products.find((p) => p.id === hold.productId);
        if (product) {
            product.stock += 1;
            if (product.status === "sold_out") product.status = "live";
        }
        return { ...hold };
    },

    async getHolds() {
        releaseExpiredHolds();
        return holds.filter((h) => h.status === "active").map((h) => ({ ...h }));
    },

    async confirmCheckout(holdIds) {
        releaseExpiredHolds();
        const relevant = holds.filter((h) => holdIds.includes(h.id));
        const expired = relevant.filter((h) => h.status !== "active");
        if (expired.length > 0) {
            throw new Error("HOLD_EXPIRED_MID_CHECKOUT");
        }
        relevant.forEach((h) => (h.status = "consumed"));
        return { orderId: uid(), items: relevant.map((h) => ({ ...h })) };
    },
};