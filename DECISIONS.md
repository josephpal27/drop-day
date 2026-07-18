# Decisions

## 1. What exactly happens on screen the moment a hold expires?

When a hold expires, the reservation is removed from the cart and the reserved stock is immediately returned to the available inventory. Instead of disappearing silently, the user sees a clear expiry message so they understand why the item is no longer available. This provides better feedback and avoids confusion.

---

## 2. Whose clock is the truth — client or the API layer? How do you handle drift?

The API layer is treated as the source of truth.

The UI only displays the countdown using the expiration timestamp returned by the API. Product data and holds are refreshed regularly, allowing the client to synchronize with the latest server state and minimizing timer drift.

---

## 3. Optimistic UI or wait-for-server when placing a hold? Why?

I chose optimistic UI.

As soon as the user clicks "Add to Cart", the hold appears immediately and stock is updated in the interface without waiting for the network response. If the API later rejects the request because another shopper already reserved the last item or a simulated network failure occurs, the optimistic update is rolled back and an appropriate error message is displayed.

This provides a faster and smoother user experience.

---

## 4. Context API vs Zustand — why your pick?

I chose Context API.

I already had experience using Context API, so I decided to build the assignment with a solution I was comfortable maintaining within the given time limit. For this application's size, Context API keeps the shared state centralized and easy to manage without introducing another dependency.

---

## 5. What does a user with two open tabs experience?

Both tabs communicate with the same simulated backend.

As products, holds, and stock are refreshed periodically, both tabs eventually synchronize with the latest data. If a reservation expires or inventory changes in one tab, the other tab reflects those updates after the next refresh cycle.

---

## 6. Wildcard Feature

I implemented Panic Mode.

During the final 10 seconds of an active reservation, the hold card enters a more noticeable visual state using colour changes and animation. This increases urgency while keeping the interface readable and usable.