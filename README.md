# Mini Products - Product Catalog

A modern product catalog built with Next.js 16, React 19, Prisma, and Tailwind CSS v4.

## Features

- ✅ Full CRUD for products (Create, Read, Update, Delete)
- 🔍 Real-time search by product name
- 🎯 Sorting (Newest, Oldest, A–Z, Z–A)
- 📄 Pagination with configurable page size
- 🖼️ Image proxy for external URLs (CORS bypass)
- 📤 Drag & drop image upload with visual feedback
- 📱 Responsive design with modern UI (shadcn/ui components)
- ⚡ Fast, polished loading states (Skeleton)
- 🎨 Beautiful animations and transitions
- 🔔 Toast notifications for user feedback
- 🔌 Complete REST API with GET, POST, PATCH, DELETE endpoints
- 🎣 Custom React hooks for reusable logic (image loading, drag & drop, scroll lock)
- 📁 Professional project structure with `src/` organization
- 🏗️ Route groups for clean URL structure
- 🧩 Feature-based component organization (products/, shared/, ui/)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui (Button, Input, Label, Card, Dialog, DropdownMenu, Select, Toast, Badge, Skeleton, Alert)
- **Icons:** Lucide React
- **Database:** SQLite with Prisma 6
- **Validation:** Zod 4 + React Hook Form
- **Runtime:** Node.js 20+

### UI Components (shadcn/ui) in use

- Button: actions across forms, modals, lists, and navigation (with asChild for Links)
- Input: search bar, form fields, page size input
- Label: form field labels with proper a11y
- Card: product card wrapper (preserving custom gradient/hover)
- Dialog: delete confirmation modal
- DropdownMenu: kebab menu (⋮) in product card
- Select: sort control (Newest, Oldest, A–Z, Z–A)
- Toast: notification system for user feedback (create, update, delete operations)
- Badge: date labels on product cards
- Skeleton: loading states for forms and async content
- Alert: empty states and informational messages

## Prerequisites

Before you begin, make sure you have installed:

- **Node.js** 20 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **pnpm** / **yarn**
- **Git** (optional, for cloning the repo)

## Installation & Setup

### 1. Clone or download the project

```bash
git clone <your-repo-url>
cd mini-productos
```

Or download the ZIP and extract it.

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Apply migrations (this also generates Prisma Client):

```bash
npx prisma migrate dev
```

### 4. Seed the database with sample products

```bash
npx prisma db seed
```

This will create 6 sample products with English names and relevant images.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command                     | Description                                      |
|-----------------------------|--------------------------------------------------|
| `npm run dev`               | Start development server on port 3000            |
| `npm run build`             | Build for production                             |
| `npm start`                 | Run production build                             |
| `npm run lint`              | Run ESLint                                       |
| `npx prisma studio`         | Open Prisma Studio (database GUI)                |
| `npx prisma db seed`        | Seed the database                                |
| `npx prisma migrate reset`  | Drop database, reapply migrations, and seed      |
| `npx tsc --noEmit`          | Run TypeScript type check                        |

## Project Structure

```
mini-productos/
├── src/                    # Source code
│   ├── app/                # Next.js App Router
│   │   ├── (main)/         # Route group for main pages
│   │   │   ├── page.tsx    # Home page (product catalog)
│   │   │   └── products/
│   │   │       └── page.tsx # Product form page
│   │   ├── api/            # API routes (products, image proxy)
│   │   │   ├── image/
│   │   │   └── products/
│   │   ├── layout.tsx      # Root layout with header and toast
│   │   ├── loading.tsx     # Loading UI
│   │   └── globals.css     # Global styles and animations
│   ├── components/         # React components
│   │   ├── products/       # Product-specific components
│   │   │   ├── product-card.tsx    # Product card with menu and delete
│   │   │   ├── product-form.tsx    # Create/edit form with validation
│   │   │   └── product-dialog.tsx  # Product modal/dialog wrapper
│   │   ├── shared/         # Shared components across features
│   │   │   ├── search-bar.tsx      # Real-time search input
│   │   │   ├── sort-controls.tsx   # Sort dropdown
│   │   │   ├── paginator.tsx       # Pagination controls
│   │   │   └── page-size-input.tsx # Page size selector
│   │   └── ui/             # shadcn/ui primitives (button, input, etc.)
│   ├── hooks/              # Custom React hooks
│   │   ├── use-image-loader.ts      # Image loading with timeout & fallback
│   │   ├── use-drag-and-drop.ts     # Drag & drop file handling
│   │   ├── use-body-scroll-lock.ts  # Body scroll lock for modals
│   │   └── index.ts                 # Hook exports
│   ├── lib/                # Unified utilities
│   │   ├── db.ts           # Prisma client singleton
│   │   ├── constants.ts    # Timeouts, z-index, pagination sizes
│   │   ├── utils.ts        # cn() helper and misc utilities
│   │   ├── url.ts          # URL normalization and proxy logic
│   │   ├── placeholder.ts  # SVG placeholder generator
│   │   └── validations.ts  # Zod schemas
│   └── types/              # TypeScript types
│       ├── product.ts      # Product type definitions
│       ├── api.ts          # API response types
│       └── index.ts        # Type exports
├── prisma/                 # Prisma schema and migrations
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed script
│   └── migrations/         # Migration history
├── public/                 # Static assets
├── .env                    # Environment variables
├── .env.example            # Environment variables template
└── ...config files         # Next.js, TypeScript, Tailwind, etc.
```

## How to Use

### Add a Product

1. Click the **"+ Add product"** button in the header.
2. Fill in the product name and image URL.
3. **Upload an image:**
   - **Drag & drop:** Drag an image file from your file explorer directly onto the preview area
   - **Click to upload:** Click **"Upload image"** button to select a file
   - **Paste URL:** Enter an image URL in the input field
4. Click **"Save"** to create the product.

### Edit a Product

1. Click the **⋮** (kebab menu) on any product card.
2. Select **"Edit product"**.
3. Modify the fields in the modal.
4. Click **"Save"** to update.

### Delete a Product

1. Click the **⋮** menu on a product card.
2. Select **"Delete product"**.
3. Confirm in the dialog.

### Search and Filter

- Use the **search bar** to filter products by name (real-time).
- Use the **sort dropdown** to order by date or alphabetically.
- Adjust **page size** (Show X / page) and navigate with pagination.

## Database Management

### View all data

```bash
npx prisma studio
```

Opens a web UI at `http://localhost:5555` to browse and edit your SQLite database.

### Reset database and reseed

```bash
npx prisma migrate reset --force
```

This will:
1. Drop the database
2. Reapply all migrations
3. Run the seed script automatically

### Manual seed only

```bash
npx prisma db seed
```

Deletes all products and inserts the 6 sample items.

## Troubleshooting

### Images not loading

- The app uses an image proxy (`/api/image`) to bypass CORS for external URLs.
- If an image fails to load after ~4 seconds, a placeholder SVG is shown.
- Try using direct Unsplash URLs: `https://images.unsplash.com/photo-ID?w=1200&h=600&fit=crop`

### Drag & drop not working

- Make sure you're dragging an image file (jpg, png, gif, webp, etc.)
- The drop zone is the entire preview area (with the dashed border when dragging)
- You'll see a visual overlay saying "📤 Drop to upload" when hovering over the zone

### Port 3000 already in use

```bash
# Run on a different port
npm run dev -- -p 3001
```

### TypeScript errors

```bash
npx tsc --noEmit
```

Run this to check for type errors without building.

### Database locked (SQLite)

If you see "database is locked", close any open Prisma Studio instances and restart the dev server.

### Search not working

- Search uses SQLite's `LIKE` operator which is case-sensitive by default
- For case-insensitive search on SQLite, the data needs to be indexed properly or use application-level normalization
- On PostgreSQL, you can use Prisma's `mode: "insensitive"` option for better search UX

## Custom Hooks

The project includes reusable React hooks in `src/hooks/`:

### `useImageLoader(imageUrl, fallbackLabel, timeout)`
Handles image loading with automatic timeout and fallback to SVG placeholder.

**Features:**
- Automatic proxy detection for CORS-restricted URLs
- Configurable timeout before showing placeholder
- Returns `{ src, loaded, failed, onLoad, onError }` for image element binding

**Usage:**
```tsx
const { src, loaded, onLoad, onError } = useImageLoader(
  product.imageUrl,
  product.name,
  IMAGE_LOAD_TIMEOUT_MS
);

<img src={src} onLoad={onLoad} onError={onError} />
```

### `useDragAndDrop(onFileDrop)`
Provides drag and drop functionality for file uploads.

**Features:**
- Drag counter to prevent flicker on nested elements
- Visual feedback with `isDragging` state
- Returns handlers object to spread on drop zone

**Usage:**
```tsx
const { isDragging, dragHandlers } = useDragAndDrop(handleFile);

<div {...dragHandlers} className={isDragging ? 'active' : ''}>
  Drop files here
</div>
```

### `useBodyScrollLock(enabled)`
Locks body scroll when modals/dialogs are open, preserving scroll position.

**Features:**
- Compensates for scrollbar width to prevent layout shift
- Restores original scroll position on cleanup
- Automatically handles cleanup on unmount

**Usage:**
```tsx
useBodyScrollLock(isModalOpen);
```

## Environment Variables (Optional)

Create a `.env` file in the root if you want to customize (see `.env.example` for template):

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## API Endpoints

The project includes a complete REST API for products:

### GET /api/products
Get all products with optional filters.

**Query params:**
- `search` - Filter by product name (case-sensitive on SQLite)
- `sortBy` - Sort order: `newest`, `oldest`, `name-asc`, `name-desc`
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)

**Example:**
```bash
GET /api/products?search=keyboard&sortBy=name-asc&page=1&pageSize=5
```

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "pageSize": 5,
    "total": 6,
    "totalPages": 2
  }
}
```

### GET /api/products?id={id}
Get a single product by ID.

**Example:**
```bash
GET /api/products?id=1
```

### POST /api/products
Create a new product.

**Body:**
```json
{
  "name": "Keyboard",
  "imageUrl": "https://..."
}
```

### PATCH /api/products?id={id}
Update an existing product.

**Body:**
```json
{
  "name": "Updated Name",
  "imageUrl": "https://..."
}
```

### DELETE /api/products?id={id}
Delete a product.

**Response:** 204 No Content

### GET /api/image
Image proxy to bypass CORS restrictions.

**Query params:**
- `u` - Image URL (required)
- `label` - Alt text label (optional)

**Example:**
```bash
GET /api/image?u=https://example.com/image.jpg&label=Product
```

## License

MIT

## Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js 16, React 19, shadcn/ui, Prisma, and Tailwind CSS v4.

