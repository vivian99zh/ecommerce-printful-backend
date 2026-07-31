# WBS Node.js TypeScript Backend Scaffold

# Ecommerce Printful Store – Backend

Backend API for a fitness clothing eCommerce store, built with Express, TypeScript, and Zod. Features a WooCommerce proxy (Phase 1) with planned MongoDB + Printful API integration (Phase 2).

## Tech Stack

- **Express.js** – Web framework
- **TypeScript** – Type safety
- **Zod** – Schema validation
- **CORS** – Cross-origin resource sharing
- **pnpm** – Package manager
- **MongoDB** – Database (Phase 2)
- **Printful API** – Order fulfillment (Phase 2)

## Setup & Installation

### Prerequisites

- Node.js (v22)
- pnpm (v11)
- MongoDB (for Phase 2)

## Scripts Overview

| Script           | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `pnpm install`   | Install all project dependencies                          |
| `pnpm run dev`   | Start development server at `http://localhost:3000`       |
| `pnpm run build` | Compile TypeScript to JavaScript to `/dist`               |
| `pnpm run start` | Start the production server from the built `/dist` folder |
