# Mini Products - Product Catalog

A modern product catalog built with Next.js 16, React 19, Prisma, and Tailwind CSS v4.

## Features

- ✅ Full CRUD for products (Create, Read, Update, Delete)
- 🔍 Real-time search by product name
- 🎯 Sorting (Newest, Oldest, A–Z, Z–A)
- 📄 Pagination with configurable page size
- 🖼️ Image proxy for external URLs (CORS bypass)
 - 📱 Responsive design with modern UI (shadcn/ui components)
 - ⚡ Fast, polished loading states (Skeleton)
 - 🎨 Beautiful animations and transitions
- 🔔 Toast notifications for user feedback

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
├── app/                    # Next.js App Router
│   ├── @modal/             # Parallel route for modal overlay
│   ├── api/                # API routes (products, image proxy)
│   ├── products/           # Products listing page
│   ├── layout.tsx          # Root layout with header and toast
│   ├── page.tsx            # Home page (product catalog)
│   └── globals.css         # Global styles and animations
├── components/             # React components
│   ├── product-card.tsx    # Product card with menu and delete
│   ├── product-form.tsx    # Create/edit form with validation
│   ├── search-bar.tsx      # Real-time search input
│   ├── sort-controls.tsx   # Sort dropdown (Newest, A–Z, etc.)
│   ├── paginator.tsx       # Pagination controls
│   └── ui/                 # UI primitives (button, input, etc.)
├── lib/                    # Small helpers and constants
│   ├── constants.ts        # Timeouts, z-index, pagination sizes
│   └── utils.ts            # Misc utilities
├── libs/                   # Utility functions
│   ├── prisma.ts           # Prisma client singleton
│   ├── url.ts              # URL normalization and proxy logic
│   ├── placeholder.ts      # SVG placeholder generator
│   └── validations.ts      # Zod schemas
├── prisma/                 # Prisma schema and migrations
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed script
│   └── migrations/         # Migration history
└── types/                  # TypeScript types
    └── product.ts          # Product type definitions
```

## How to Use

### Add a Product

1. Click the **"+ Add product"** button in the header.
2. Fill in the product name and image URL.
3. Click **"Upload image"** to pick a file (or paste an image URL).
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

## Environment Variables (Optional)

Create a `.env` file in the root if you want to customize:

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

## License

MIT

## Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js 16, React 19, shadcn/ui, Prisma, and Tailwind CSS v4.

