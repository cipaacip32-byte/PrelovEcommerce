# Prelovin - E-Commerce Platform for Preloved Items

## Overview

Prelovin is a modern e-commerce web application for buying and selling preloved (second-hand) items in Indonesia. The platform is inspired by Shopee's marketplace interface, adapted for the sustainable shopping market segment. It emphasizes trust-building, environmental consciousness, and seamless shopping experiences with features like product listings, shopping cart, checkout, seller dashboards, and user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching
- React Hook Form with Zod for form validation

**UI Framework:**
- Shadcn/ui component library based on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system supporting light/dark modes
- Responsive design following mobile-first principles

**Design System:**
- Shopee-inspired dense information presentation
- Custom color palette with primary color (HSL 346, 77%, 50%)
- Typography using Inter font family from Google Fonts
- Consistent spacing using Tailwind's spacing scale (2, 4, 6, 8, 12, 16)
- Component-based architecture with reusable UI elements

**Key Pages:**
- Landing page for unauthenticated users
- Home page with product grid and filtering
- Product detail pages with image galleries
- Shopping cart and checkout flow
- Seller dashboard for managing products
- Order management and tracking
- Seller profile pages

**State Management:**
- TanStack Query for server state with custom query client configuration
- Local component state using React hooks
- Authentication state managed through custom useAuth hook
- 401 error handling with automatic redirect to login

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js as the web framework
- TypeScript for type safety across the stack
- ESBuild for production bundling with selective dependency bundling

**API Design:**
- RESTful API endpoints following resource-based patterns
- Session-based authentication using express-session
- CRUD operations for products, cart, orders, and categories
- Request/response logging middleware

**Authentication System:**
- Replit Auth integration via OpenID Connect
- Passport.js for authentication strategy
- Session storage in PostgreSQL via connect-pg-simple
- Cookie-based sessions with secure flags and 1-week TTL
- User profile management with firstName, lastName, email, and location

**Middleware Stack:**
- JSON body parsing with raw body capture for webhooks
- URL-encoded form data support
- Trust proxy configuration for secure cookies
- Custom logging middleware for request/response tracking

### Data Storage

**Database:**
- PostgreSQL via Neon serverless driver
- Drizzle ORM for type-safe database queries
- WebSocket connections for serverless compatibility

**Schema Design:**

*Users Table:*
- UUID primary keys
- Email, name, profile image, phone, address, city fields
- Timestamps for creation and updates

*Products Table:*
- Auto-incrementing integer IDs
- Foreign key to sellers (users)
- Category classification
- Pricing with original and sale price
- Stock tracking
- Condition status (Seperti Baru, Bagus, Layak Pakai)
- JSON array for multiple product images
- View count tracking
- Location information

*Categories Table:*
- Predefined categories with icons and descriptions
- Slug-based routing
- Support for 9 main categories (Elektronik, Fashion, Furniture, etc.)

*Cart Items Table:*
- Many-to-many relationship between users and products
- Quantity tracking
- Automatic cleanup on checkout

*Orders Table:*
- Order management with status tracking
- Shipping information (name, phone, address, city)
- Payment method selection (transfer, COD)
- Total amount calculation

*Order Items Table:*
- Individual items within orders
- Snapshot of product details at purchase time
- Price and quantity tracking

*Sessions Table:*
- Replit Auth session persistence
- Expiration tracking with index for cleanup

**Storage Layer:**
- Abstract storage interface (IStorage) for data operations
- Implements repository pattern for separation of concerns
- Support for complex queries with filters and relations
- Drizzle relations for join operations

### External Dependencies

**Third-Party Services:**
- Replit Auth (OpenID Connect) for user authentication
- Neon Database for PostgreSQL hosting
- Google Fonts for Inter typography

**Key NPM Packages:**

*UI Components:*
- @radix-ui/* - Accessible component primitives (20+ components)
- class-variance-authority - Component variant management
- cmdk - Command palette functionality
- lucide-react - Icon library

*Forms & Validation:*
- react-hook-form - Form state management
- zod - Schema validation
- @hookform/resolvers - Form validation integration
- drizzle-zod - Database schema to Zod conversion

*Data Fetching:*
- @tanstack/react-query - Server state management
- Custom fetch wrapper with credential inclusion

*Authentication:*
- openid-client - OpenID Connect implementation
- passport & passport-local - Authentication middleware
- express-session - Session management
- connect-pg-simple - PostgreSQL session store

*Development Tools:*
- tsx - TypeScript execution for development
- vite - Build tool and dev server
- drizzle-kit - Database migrations
- @replit/vite-plugin-* - Replit-specific development plugins

**Build Configuration:**
- Selective dependency bundling to reduce cold start times
- Allowlist of commonly used dependencies for bundling
- Separate client and server build processes
- Static file serving from dist/public

**Development Environment:**
- Hot module replacement via Vite
- Development-only Replit plugins (cartographer, dev-banner, runtime-error-modal)
- TypeScript strict mode enabled
- Path aliases for clean imports (@/, @shared/, @assets/)