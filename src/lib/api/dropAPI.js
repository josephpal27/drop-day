import { mockServer } from "./mockServer";
import { withNetwork } from "./utils";

export const dropAPI = {
    getProducts: () => withNetwork(() => mockServer.getProducts()),
    placeHold: (productId) => withNetwork(() => mockServer.placeHold(productId)),
    releaseHold: (holdId) => withNetwork(() => mockServer.releaseHold(holdId)),
    getHolds: () => withNetwork(() => mockServer.getHolds()),
    confirmCheckout: (holdIds) => withNetwork(() => mockServer.confirmCheckout(holdIds)),
};