export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const uid = () => Math.random().toString(36).slice(2, 10);

export async function withNetwork(fn, { failRate = 0.12, minMs = 300, maxMs = 900 } = {}) {
    await sleep(minMs + Math.random() * (maxMs - minMs));
    if (Math.random() < failRate) {
        throw new Error("NETWORK_ERROR");
    }
    return fn();
}