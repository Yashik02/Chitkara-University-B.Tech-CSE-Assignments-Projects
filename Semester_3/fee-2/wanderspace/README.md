# 🏡 WanderSpace — Travel Stay & Review Platform

> **Academic Project Submission**  
> **Course / Level:** 3rd Semester Bachelor of Technology / Computer Science & Engineering / Information Technology  
> **Domain:** Full-Stack Web Development & Relational Database Management Systems (RDBMS)  
> **Architecture:** Decoupled Client-Server (React SPA + Node/Express REST API + Relational SQL)

---

## 📌 Project Overview

**WanderSpace** is a full-stack web application inspired by modern vacation rental platforms (such as Airbnb). It allows travelers to discover unique accommodations, filter stays by category and price, read authentic guest reviews, and save favorite homes to a personal wishlist. Hosts can publish, update, and manage stay listings with a live image preview and controlled form validations.

This academic project emphasizes core computer science fundamentals: **pure relational database schemas**, **referential integrity with cascade constraints**, **real arithmetic rating aggregations**, **clean RESTful API design**, and **React component lifecycles without redundant third-party state libraries**.

---

## 🛠️ Tech Stack & Technologies Used

### Frontend (Client-Side)

- **Library:** React 19 (Functional Components with TypeScript)
- **Build Tool:** Vite 6 (Ultra-fast HMR and bundling)
- **Routing:** React Router v7 (`BrowserRouter`, `Routes`, `Route`, `useParams`, `useNavigate`, `Link`)
- **State & Hooks:**
    - `useState` — Controlled inputs, dynamic filtering, active tabs, modal states.
    - `useEffect` — Asynchronous data fetching, cleanup, query parameter synchronization.
    - `useRef` — Direct DOM manipulation for auto-focusing inputs and smooth-scrolling to reviews.
    - `useWishlist` — Custom Hook encapsulating browser `localStorage` persistence.
- **Styling:** Handcrafted CSS with modern CSS variables, responsive Grid & Flexbox, and Tailwind utility classes.
- **Icons:** Lucide React (`Heart`, `Star`, `MapPin`, `Sparkles`, `Trash2`, `Edit3`, `Plus`, `RotateCcw`, etc.).

### Backend (Server-Side)

- **Runtime:** Node.js (v20+) with TypeScript execution via `tsx`
- **Web Framework:** Express.js 4 (REST API endpoints, JSON body parsing, URL encoding)
- **Middleware:** Vite middleware integration in development, static distribution in production.

### Database (RDBMS)

- **Engine:** MySQL accessed through a `mysql2/promise` connection pool.
- **Integrity:** Foreign Key constraints (`FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE`).
- **Data Initialization:** Dedicated `schema.sql` and `seeds.sql` files for database creation and sample data seeding.

---

## 🚀 How to Run the Project Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18.x or 20.x or higher)
- `npm` (comes bundled with Node.js)
- MySQL Server

### Step 1: Clone or Open the Project Directory

```bash
cd /path/to/wanderspace
```

### Step 2: Install Dependencies

```bash
npm install
```

Create the MySQL database and configure the connection. Copy `.env.example` to `.env`, set your credentials, and run:

```sql
CREATE DATABASE wanderspace;
```

### Step 3: Run the Development Server

```bash
npm run dev
```

The server will start on **`http://localhost:3000`** with unified Express API routes and Vite frontend serving.

### Step 4: Build for Production & Launch

To verify production bundling:

```bash
# Builds the Vite client to /dist and bundles the Express server to dist/server.cjs
npm run build

# Starts the production server
npm run start
```

### Step 5: Resetting the Sample Database

You can reset the database back to clean, realistic sample listings and reviews at any time:

- **Via the UI:** Click the **"Reset DB"** button in the top navigation bar.
- **Via cURL / Terminal:**
    ```bash
    curl -X POST http://localhost:3000/api/seed/reset
    ```

---

## 🗄️ Relational Database Schema & Tables

The database schema is defined in `/schema.sql`. It strictly follows 3rd Normal Form (3NF) principles.

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│            listings             │           │             reviews             │
├─────────────────────────────────┤           ├─────────────────────────────────┤
│ id (PK, UUID CHAR(36))          │◄────┐     │ id (PK, UUID CHAR(36))          │
│ title (VARCHAR 255)             │     │     │ listing_id (FK -> listings.id)  │───┐ (ON DELETE
│ description (TEXT)              │     └─────│ author (VARCHAR 100)            │   │  CASCADE)
│ image (TEXT)                    │           │ rating (INTEGER, 1 to 5)        │   │
│ price (INTEGER)                 │           │ comment (TEXT)                  │   │
│ location (VARCHAR 255)          │           │ created_at (TIMESTAMP)          │   │
│ country (VARCHAR 255)           │           └─────────────────────────────────┘   │
│ category (VARCHAR 100)          │                                                 │
│ created_at (TIMESTAMP)          │◄────────────────────────────────────────────────┘
└─────────────────────────────────┘
```

### 1. `listings` Table

Stores all accommodation properties hosted on WanderSpace.

| Column        | Type           | Constraints                 | Description                                         |
| :------------ | :------------- | :-------------------------- | :-------------------------------------------------- |
| `id`          | `CHAR(36)`     | Primary Key, UUID           | Unique listing identifier                           |
| `title`       | `VARCHAR(255)` | `NOT NULL`                  | Name / headline of the stay                         |
| `description` | `TEXT`         | `NULLABLE`                  | Full prose description of amenities & vibe          |
| `image`       | `TEXT`         | `NOT NULL`                  | Direct URL to high-resolution property photo        |
| `price`       | `INTEGER`      | `NOT NULL`, Default 0       | Nightly rental rate in USD                          |
| `location`    | `VARCHAR(255)` | `NOT NULL`                  | City and State/Province (e.g. "Malibu, California") |
| `country`     | `VARCHAR(255)` | `NOT NULL`                  | Country (e.g. "United States", "Japan", "Greece")   |
| `category`    | `VARCHAR(100)` | Default `'Trending'`        | Category (Beachfront, Cabins, Mansions, etc.)       |
| `created_at`  | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP` | Timestamp of listing creation                       |

### 2. `reviews` Table

Stores guest reviews and star ratings linked to listings.

| Column       | Type           | Constraints                            | Description                      |
| :----------- | :------------- | :------------------------------------- | :------------------------------- |
| `id`         | `CHAR(36)`     | Primary Key, UUID                      | Unique review identifier         |
| `listing_id` | `CHAR(36)`     | `NOT NULL`, Foreign Key                | References `listings(id)`        |
| `author`     | `VARCHAR(100)` | Default `'Anonymous Guest'`            | Name of the reviewer             |
| `rating`     | `INTEGER`      | `NOT NULL`, `CHECK (1 <= rating <= 5)` | 1 to 5 integer rating            |
| `comment`    | `TEXT`         | `NOT NULL`                             | Text body of the review feedback |
| `created_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`            | Timestamp when review was posted |

### 3. Referential Integrity & Cascade Constraint

```sql
FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
```

- When a stay is deleted via `DELETE /api/listings/:id`, the relational database engine automatically deletes all reviews linked to that `listing_id`. This prevents orphan records and ensures database consistency.

### 4. Dynamic Rating SQL Query

```sql
SELECT
    l.*,
    ROUND(AVG(r.rating), 1) AS avg_rating,
    COUNT(r.id) AS review_count
FROM listings l
LEFT JOIN reviews r ON l.id = r.listing_id
GROUP BY l.id;
```

- **No Hardcoding:** Listings with reviews dynamically calculate the exact arithmetic average (e.g., `4.7` from ratings `[5, 4, 5]`). Stays with 0 reviews display `★ New`.

---

## 📡 API Routes Specification (Backend REST API)

All server API endpoints return JSON payloads and standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

---

### 1. Get All Listings

- **Endpoint:** `GET /api/listings`
- **Query Parameters (Optional):**
    - `search`: string (filters title, location, country, category with `LIKE %search%`)
    - `category`: string (e.g., `'Beachfront'`, `'Cabins'`, `'Mansions'`)
    - `sort`: `'price_asc'` | `'price_desc'` | `'rating'` | `'newest'`
- **Sample Request:**
  `GET /api/listings?category=Beachfront&sort=price_asc`
- **Sample Output (200 OK):**
    ```json
    {
        "listings": [
            {
                "id": 1,
                "title": "Malibu Oceanfront Sunset Villa",
                "description": "Wake up to panoramic Pacific ocean views...",
                "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
                "price": 6500,
                "location": "Malibu, California",
                "country": "United States",
                "category": "Beachfront",
                "created_at": "2026-09-11 19:55:07",
                "avg_rating": 4.8,
                "review_count": 4
            }
        ]
    }
    ```

---

### 2. Get Single Listing Details & Associated Reviews

- **Endpoint:** `GET /api/listings/:id`
- **Sample Request:**
  `GET /api/listings/6670137d-7288-4822-8383-d121b4e00001`
- **Sample Output (200 OK):**
    ```json
    {
        "listing": {
            "id": "6670137d-7288-4822-8383-d121b4e00001",
            "title": "Malibu Oceanfront Sunset Villa",
            "description": "Wake up to panoramic Pacific ocean views...",
            "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
            "price": 6500,
            "location": "Malibu, California",
            "country": "United States",
            "category": "Beachfront",
            "created_at": "2026-09-11 19:55:07",
            "avg_rating": 4.8,
            "review_count": 4
        },
        "reviews": [
            {
                "id": "7770137d-7288-4822-8383-d121b4e00003",
                "listing_id": "6670137d-7288-4822-8383-d121b4e00001",
                "author": "Elena Rostova",
                "rating": 4,
                "comment": "Wonderful place. A little windy on the patio, but the heated pool made up for it!",
                "created_at": "2026-09-11 19:55:07"
            }
        ]
    }
    ```

---

### 3. Create a New Listing (Host a Stay)

- **Endpoint:** `POST /api/listings`
- **Headers:** `Content-Type: application/json`
- **Sample Input Payload:**
    ```json
    {
        "title": "Modern Nordic Glass Pod",
        "description": "Secluded panoramic cabin in the quiet fjords.",
        "image": "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
        "price": 1850,
        "location": "Tromso",
        "country": "Norway",
        "category": "Cabins"
    }
    ```
- **Sample Output (201 Created):**
    ```json
    {
        "listing": {
            "id": 11,
            "title": "Modern Nordic Glass Pod",
            "description": "Secluded panoramic cabin in the quiet fjords.",
            "image": "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
            "price": 1850,
            "location": "Tromso",
            "country": "Norway",
            "category": "Cabins",
            "created_at": "2026-09-11 20:10:00"
        },
        "message": "Listing created successfully!"
    }
    ```

---

### 4. Update an Existing Listing

- **Endpoint:** `PUT /api/listings/:id`
- **Headers:** `Content-Type: application/json`
- **Sample Input Payload:**
    ```json
    {
        "title": "Modern Nordic Glass Pod (Renovated)",
        "description": "Updated sauna and outdoor hot tub included.",
        "image": "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
        "price": 2100,
        "location": "Tromso",
        "country": "Norway",
        "category": "Cabins"
    }
    ```
- **Sample Output (200 OK):**
    ```json
    {
        "listing": {
            "id": 11,
            "title": "Modern Nordic Glass Pod (Renovated)",
            "price": 2100
        },
        "message": "Listing updated successfully!"
    }
    ```

---

### 5. Delete a Listing (With Cascade Deletion)

- **Endpoint:** `DELETE /api/listings/:id`
- **Sample Output (200 OK):**
    ```json
    {
        "success": true,
        "message": "Listing and related reviews deleted successfully."
    }
    ```

---

### 6. Create a Review for a Listing

- **Endpoint:** `POST /api/listings/:id/reviews`
- **Headers:** `Content-Type: application/json`
- **Sample Input Payload:**
    ```json
    {
        "author": "Dr. Ramesh Sharma",
        "rating": 5,
        "comment": "Excellent project architecture and real database query calculation!"
    }
    ```
- **Sample Output (201 Created):**
    ```json
    {
        "review": {
            "id": "7770137d-7288-4822-8383-d121b4e00013",
            "listing_id": "6670137d-7288-4822-8383-d121b4e00001",
            "author": "Dr. Ramesh Sharma",
            "rating": 5,
            "comment": "Excellent project architecture and real database query calculation!",
            "created_at": "2026-09-11 20:12:00"
        },
        "message": "Review added successfully!"
    }
    ```

---

### 7. Delete a Review

- **Endpoint:** `DELETE /api/reviews/:id`
- **Sample Output (200 OK):**
    ```json
    {
        "success": true,
        "message": "Review deleted successfully."
    }
    ```

---

### 8. System Endpoints

- `GET /api/health` — Returns server health status and version.
- `POST /api/seed/reset` — Resets tables back to clean initial seed data from `seeds.sql`.

---

## 🧭 Frontend Application Routes (React Router)

| Route Path           | Component               | Description                                                                                                                                              |
| :------------------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                  | `HomePage.tsx`          | Main browse view with category pills, live search, sorting dropdown, and stay card grid.                                                                 |
| `/listings/new`      | `NewListingPage.tsx`    | Controlled form for hosts to create a new stay with image preset selectors and live thumbnail preview.                                                   |
| `/listings/:id`      | `ListingDetailPage.tsx` | Comprehensive view of stay details, dynamic average rating, reviews list, interactive 5-star review form, edit/delete options, and booking summary card. |
| `/listings/:id/edit` | `EditListingPage.tsx`   | Controlled form to modify existing stay information.                                                                                                     |
| `/wishlist`          | `WishlistPage.tsx`      | Dedicated view displaying stays saved to browser storage via custom hook.                                                                                |
| `*`                  | `NotFoundPage.tsx`      | Fallback 404 screen with navigation back to Home.                                                                                                        |

---

## 📂 Project Directory Structure

```
wanderspace/
├── package.json               # Scripts (dev, build, start, lint) & dependencies
├── tsconfig.json              # TypeScript compiler configuration
├── vite.config.ts             # Vite build configuration with React plugin
├── schema.sql                 # Pure SQL DDL (Table definitions, constraints, queries)
├── seeds.sql                  # Sample listings and authentic guest reviews
├── server.ts                  # Express server entry point & Vite development bridge
│
├── server/                    # Backend Server Directory
│   ├── db.ts                  # SQL database engine wrapper, initialization & seeder
│   └── routes/
│       ├── listings.ts        # Express router: GET, POST, PUT, DELETE for listings
│       └── reviews.ts         # Express router: POST, DELETE for reviews
│
└── src/                       # Frontend React Directory
    ├── main.tsx               # Client entry point with React Router BrowserRouter
    ├── App.tsx                # Master component routing layout, navbar & footer
    ├── index.css              # Handcrafted CSS styling, brand theme variables & badges
    ├── types.ts               # Shared TypeScript models (Listing, Review, Category)
    │
    ├── hooks/
    │   └── useWishlist.ts     # Custom Hook: localStorage sync for saved properties
    │
    ├── components/
    │   ├── Navbar.tsx         # Brand logo, search input, Wishlist badge, Reset DB button
    │   ├── Footer.tsx         # Footer with brand details and project links
    │   ├── CategoryFilter.tsx # Category pills (Trending, Beachfront, Cabins, etc.)
    │   ├── ListingCard.tsx    # Property card with image, price, heart wishlist toggle
    │   └── StarRating.tsx     # Interactive 1-5 star selector with hover feedback
    │
    └── pages/
        ├── HomePage.tsx           # Primary explore screen with filters and stay grid
        ├── ListingDetailPage.tsx  # Detailed property page, reviews & review submission
        ├── NewListingPage.tsx     # Controlled form to publish a new stay
        ├── EditListingPage.tsx    # Controlled form to edit property info
        ├── WishlistPage.tsx       # Saved favorites screen
        └── NotFoundPage.tsx       # 404 error page
```

---

## 💡 Implementation Notes

| Concern                                                     | How WanderSpace Solves It                                                                                                                 |
| :---------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Hardcoded Ratings (e.g. static 4.9 on every stay)**       | Real-time calculation using SQL `ROUND(AVG(rating), 1)` on the database. Adding or deleting a review immediately updates the real rating. |
| **Orphan Data on Deletion**                                 | Enforced Foreign Key with `ON DELETE CASCADE` in SQL DDL.                                                                                 |
| **Overcomplicated State (Redux / Context API boilerplate)** | Clean, direct component props with custom hook `useWishlist` backed by `localStorage`.                                                    |
| **Slow Full-Page Browser Refreshes**                        | React Router v7 client-side SPA routing (`BrowserRouter`, `useNavigate`).                                                                 |
| **Restoring Sample Data**                                   | Built-in `/api/seed/reset` endpoint and "Reset DB" UI button.                                                                             |
| **Form Errors & Misaligned Inputs**                         | Controlled React inputs (`value` + `onChange`) with auto-focus (`useRef`) and live image preview.                                         |

---

---

## 🔮 Future Scope & Project Roadmap

### Phase 2: Booking Engine & User Authentication (Upcoming)

1. **User Authentication (JWT + Bcrypt):**
    - Separate roles for **Guests** and **Hosts**.
    - Secure password hashing and token-based session management.
2. **Reservation & Booking Engine:**
    - Interactive date-range picker (`Check-in` to `Check-out`).
    - Dynamic pricing calculation (`Nights × Price + Cleaning Fee + Service Fee`).
    - Prevention of overlapping bookings using SQL transaction locks.
3. **Host Dashboard:**
    - Visual analytics of total earnings, occupancy rates, and incoming guest reservations.

### Phase 3: Cloud Storage & Advanced Integrations (Production Scale)

1. **Cloud Image Uploads (AWS S3 / Cloudinary):**
    - Replace manual image URLs with multi-image file drag-and-drop via Multer.
2. **Interactive Map Integration (Mapbox / Google Maps):**
    - Geocoding coordinates (`latitude`, `longitude`) with interactive map pins and clustered view.
3. **Payment Gateway Simulation (Stripe / Razorpay):**
    - Test mode checkout flow for guest reservation deposits.
4. **Real-Time Host-Guest Chat:**
    - WebSockets integration for direct instant messaging regarding check-in logistics.

---

## 📄 License & Attribution

- Built as an academic project for learning purposes.
- Design inspired by the clean, traveler-first aesthetic of WanderSpace / Airbnb.
- Photographs provided courtesy of [Unsplash](https://unsplash.com).
