# Design Guidelines: Prelovin - Platform E-Commerce Preloved

## Design Approach
**Reference-Based: Shopee-Inspired E-Commerce**

Taking inspiration from Shopee's successful marketplace interface with adaptations for the preloved market segment. Focus on dense information presentation, trust-building elements, and seamless shopping experience.

## Typography System

**Font Families:**
- Primary: Inter or Source Sans Pro (Google Fonts)
- Numerical: Tabular numbers for prices

**Hierarchy:**
- Hero Headlines: font-bold text-4xl md:text-5xl
- Section Headers: font-semibold text-2xl md:text-3xl
- Product Names: font-medium text-base
- Prices: font-bold text-xl md:text-2xl
- Body Text: font-normal text-sm
- Captions/Labels: font-normal text-xs

## Layout System

**Spacing Units:** Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4
- Section spacing: py-8 md:py-12
- Card gaps: gap-4
- Grid gaps: gap-4 md:gap-6

**Container Widths:**
- Max container: max-w-7xl mx-auto px-4
- Content sections: w-full
- Product grids: Full width with responsive columns

## Core Components

### Navigation Header
- Sticky top bar with search bar as centerpiece
- Logo left, cart/profile icons right
- Secondary nav with category dropdowns
- Search: Large, prominent with autocomplete
- Mobile: Hamburger menu, bottom navigation bar

### Product Cards (Shopee-style)
- Compact rectangular cards in grid
- Product image with aspect ratio 1:1
- Overlay badge for "Seperti Baru", "Kondisi Baik"
- Product name (truncate at 2 lines)
- Price prominent and bold
- Location and rating row below price
- Thin border, subtle shadow on hover
- Grid: grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6

### Category Navigation
- Horizontal scrollable pill buttons
- Icons + text for each category
- "Semua Kategori" dropdown option
- Sticky below main header on scroll

### Hero Section
**Large banner carousel:**
- Aspect ratio 16:5 on desktop, 3:2 on mobile
- Promotional messaging over lifestyle images showing preloved items
- Text: "Barang Berkualitas, Harga Bersahabat — Pilihan Cerdas untuk Bumi & Dompetmu!"
- CTA buttons with blurred backgrounds
- Dot indicators for multiple slides

### Cart & Checkout
- Sidebar cart on desktop, full page on mobile
- Checkbox for item selection (Shopee pattern)
- Quantity steppers (- qty +)
- Sticky bottom bar with total and checkout button
- Voucher/promo code input section

### Seller Profile Section
- Avatar, name, response rate, join date
- Rating stars with count
- "Chat Penjual" and "Lihat Toko" buttons
- Trust badges (Verified, Fast Response)

### Product Detail Page
- Image gallery (main large + thumbnail strip)
- Breadcrumb navigation
- Product info: Name, condition badge, price
- Quantity selector and Buy/Cart buttons
- Tabbed sections: Deskripsi, Spesifikasi, Ulasan
- Related products carousel at bottom

### Upload Product Form
- Multi-image uploader with drag-drop
- Form fields in card sections
- Category dropdown with icons
- Condition selector (radio buttons with images)
- Rich text editor for description
- Price input with "Rp" prefix
- Stock quantity field
- Prominent "Posting Produk" button

### Search & Filters
- Left sidebar filters on desktop (collapsible)
- Top bar on mobile with filter sheet
- Checkboxes for categories, conditions
- Price range sliders
- Sort dropdown: Terbaru, Termurah, Termahal, Terlaris

### Dashboard/Profile
- Tab navigation: Produk Saya, Pesanan, Wishlist, Pengaturan
- Stats cards: Total Produk, Terjual, Rating
- Product management table with edit/delete actions
- Order status tracking timeline

### Footer
- Multi-column layout: Tentang Kami, Kategori, Bantuan, Ikuti Kami
- Trust indicators: Secure payment, verified sellers
- Environmental message about preloved benefits
- Newsletter signup

## Images

**Hero Carousel Images (3-5 slides):**
- Lifestyle shots of people shopping/selling preloved items
- Product collages showcasing variety
- Environmental theme (sustainability, reuse)
- Place: Top of homepage, full-width banner

**Category Icons:**
- Simple line icons for Elektronik, Fashion, Furniture, Hobi, dll
- Place: Category navigation pills and filters

**Product Images:**
- User-uploaded photos of items
- Multiple angles per product
- Place: Product cards, detail pages

**Placeholder Images:**
- Empty states for no products, empty cart
- Profile avatars for users without photos

## Key UI Patterns

**Trust Signals:**
- Verified seller badges
- Rating stars everywhere
- Response time indicators
- "X terjual" counters on products
- Security badges on checkout

**Density:**
- Information-rich cards
- Compact spacing for product grids
- Maximize products visible above fold
- Minimal empty space

**Mobile-First:**
- Bottom navigation (Home, Kategori, Jual, Notifikasi, Akun)
- Swipeable product galleries
- Sticky "Beli Sekarang" button on detail pages
- Pull-to-refresh on listings

**Interactivity:**
- Wishlist heart icon on cards (toggle)
- Share product button
- Image zoom on hover/tap
- Lazy loading for infinite scroll
- Skeleton screens while loading

This design creates a familiar, trustworthy marketplace experience optimized for browsing, discovering, and purchasing preloved items with confidence.