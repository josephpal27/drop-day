# Drop Day

Drop Day is a frontend-only flash sale storefront built with Next.js and React. The application simulates a real-world limited inventory product drop where users compete for stock, reserve products with a temporary hold, and complete a mock checkout flow.

The goal of this project is to demonstrate frontend architecture, state management, optimistic updates, and handling of real-world edge cases such as inventory contention, hold expiration, and network failures.

---

## Tech Stack

- Next.js (App Router)
- React
- JavaScript (ES6)
- Context API
- Tailwind CSS

---

## Features

### Storefront

- Display 10 products
- Live products
- Dropping Soon products with live countdown
- Sold Out products
- Remaining stock indicator
- Low stock warning
- Responsive layout

### Cart / Hold System

- 60-second reservation for every held product
- Individual countdown timer
- Manual hold release
- Automatic hold expiration
- Stock restoration after expiry
- Panic Mode during the last 10 seconds

### Checkout

- Order summary
- Mock checkout
- Successful order confirmation
- Hold expiration handling during checkout
- Clear error messaging

### API Simulation

- Dedicated API service layer
- Mock backend
- Simulated network latency
- Random network failures
- Simulated competing shoppers
- Automatic inventory updates
- Live watcher count simulation

### User Experience

- Optimistic UI updates
- Loading state
- Error state
- Empty state
- Responsive design
- Micro interactions and animations

---

## Architecture

The application separates UI logic from data access.

```

React Components
↓
Context API
↓
API Service Layer
↓
Mock Server

```

The UI communicates only with the API layer. The mock server can later be replaced by a real backend without changing the UI components.

---

## Hold Flow

1. User adds a product to the cart.
2. A 60-second hold is created.
3. Stock is reserved immediately using optimistic updates.
4. The user can:
   - Complete checkout
   - Release the hold manually
   - Let the reservation expire
5. Expired holds automatically return inventory back to the available stock.

---

## Installation

Clone the repository

```bash
git clone https://github.com/josephpal27/drop-day.git
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## Folder Structure

```
drop-day/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   └── lib/
│
├── public/
│
├── package.json
├── README.md
└── DECISIONS.md
```

---

## Notes

- This project uses an in-memory mock server.
- Refreshing the application resets all products, holds, and inventory.
- Network latency and failures are intentionally simulated to mimic real-world behaviour.