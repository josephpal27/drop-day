export function formatINR(amount) {
    return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}