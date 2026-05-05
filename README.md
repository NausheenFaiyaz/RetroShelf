# Retro Shelf

Retro Shelf is an aesthetic product listing interface built with React + Vite using the FreeAPI random products endpoint.

The app fetches product data, presents it in a custom retro card layout, and includes search, sorting, and pagination for smooth browsing.

## Live Demo

https://retro-shelf-jet.vercel.app/

## Live Features

- Product listing from FreeAPI
- Responsive retro-inspired UI
- Search by:
  - Product title
  - Brand
  - Category
- Sorting options:
  - Featured
  - Price: Low to High
  - Price: High to Low
  - Rating: High to Low
- Pagination controls:
  - Previous / Next buttons
  - Current page indicator
- Loading, empty state, and error state handling

## Tech Stack

- React 19
- Vite 8
- Plain CSS (custom styling in `src/App.css` and `src/index.css`)
- Native Fetch API + AbortController

## API

Base endpoint:

```txt
https://api.freeapi.app/api/v1/public/randomproducts
```

Request used in app:

```txt
https://api.freeapi.app/api/v1/public/randomproducts?page=<page>&limit=<limit>
```

Default pagination values in app:
- `page = 1`
- `limit = 12`

## Project Structure

```txt
product-listing-interface/
├─ src/
│  ├─ App.jsx       # Main logic: fetching, filtering, sorting, pagination, rendering
│  ├─ App.css       # Component styling + retro card theme
│  ├─ index.css     # Global styles + base typography/background
│  └─ main.jsx      # React entry point
├─ index.html
├─ package.json
└─ README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build locally

```bash
npm run preview
```

## Available Scripts

- `npm run dev`: Starts Vite development server
- `npm run build`: Creates optimized production build in `dist/`
- `npm run preview`: Serves the built app locally
- `npm run lint`: Runs ESLint checks

## Data Handling Notes

- The app normalizes different possible API response shapes by checking:
  - `data.data`
  - `data.products`
  - `data.items`
  - `data.docs`
- It safely falls back to an empty array if product data is missing.
- Pagination metadata is resolved from:
  - `data.totalPages`
  - `data.pagination.totalPages`
  - fallback calculation using total items and page size

## UI/Design Notes

- Inspired by a retro/pastel card style
- Bold display heading with soft pink/lilac palette
- Inline top section with:
  - App title
  - Compact search bar
  - Sort dropdown
- Product cards display:
  - Image
  - Name
  - Brand + category
  - Description
  - Stock
  - Rating
  - Price and discount badge

## Deployment (Render)

This app can be deployed as a **Static Site**.

Recommended settings:
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

## Future Improvements

- Add page size selector (`limit` options like 12/24/36)
- Add skeleton loaders for cards
- Add category chips/filters
- Add product detail modal
- Persist search/sort/page in local storage

## License

This project is built for learning and portfolio purposes.
