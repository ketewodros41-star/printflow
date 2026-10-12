# PrintFlow — Modern Print-on-Demand (POD) Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.17-2D3748?logo=prisma)](https://www.prisma.io/)

**PrintFlow** is an enterprise-grade Print-on-Demand (POD) e-commerce and visual design platform. It empowers creators and businesses to design custom apparel and lifestyle merchandise with physical manufacturing accuracy, real-time 3D textile finishes, multi-angle studio mockups, and end-to-end order fulfillment.

---

## 🌟 Key Features

### 1. Interactive Visual Design Studio
- **Vector & Raster Canvas**: Drag-and-drop layer manipulation, dynamic text styling (fonts, sizing, curve/arc, alignment, letter spacing), and image uploads.
- **Physical Print Finishes**:
  - **Direct-to-Garment (DTG)**: Pigment dispersion embedded into combed-cotton microfibers.
  - **Sewed / Embroidery**: 3D satin-stitch thread relief with directional lighting and tactile contact shadow.
  - **Chenille / Fuzzy Moss Stitch**: 3D textured loop yarn with radiating loop whiskers.
  - **Screen Printing**: Opaque plastisol ink layer with crisp stencil boundaries.
  - **Direct-to-Film (DTF)**: High-vibrancy heat-press polymer finish.
  - **Vintage Discharge**: Soft-hand bleached garment fiber texture.
- **Dual Color Modes**: Real-time toggling between **Bright/Colourful (sRGB)** and **Print Production (CMYK Simulation)**.

### 2. Studio-Grade Realistic Product Mockups
- **Photorealistic Flat-Lays**: 15+ garment colorways (White, Ash, Sport Grey, Dark Heather, Black, Red, Safety Green, Navy, Forest Green, Maroon, Royal, Sand, Military Green, Orange, Carolina Blue) rendered with authentic drapery, fold depth, and combed-cotton specular sheen.
- **Full Sleeve & Cuff Modeling**: Zero jagged silhouettes, zero color leakage, sub-pixel anti-aliasing, and intact ribbed cuffs.
- **Multi-Angle Views**:
  - Front Studio Flat-Lay
  - Back Panel with Rear Neckline Ribbing
  - Collar Closeup (2.2× macro zoom on neckline and chest)
  - On-Person Views (Male & Female models in authentic garments)
  - Interactive Size Chart Overlay

### 3. Comprehensive Product Catalog
- **Apparel**: Unisex Classic Tees, Ultra Cotton Long Sleeve Shirts, Heavyweight Pullover Hoodies, Full-Zip Hoodies, Crewneck Sweatshirts, Sleeveless Muscle Tanks, Varsity Jackets.
- **Accessories & Home**: Snapback Caps, Ceramic Coffee Mugs (Front, Handle-Left, Wrap), Canvas Tote Bags, Spun Polyester Throw Pillows, Velveteen Plush Fleece Blankets, Archival Matte Art Posters.

### 4. Localized Payment Integrations
- **Chapa API**: Card & local wallet checkout.
- **Telebirr**: QR code & direct mobile money payments.
- **Safaricom M-Pesa (Daraja API)**: STK Push and B2C settlements.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **Frontend**: [React 18](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Image Processing & Automation**: OpenCV / NumPy Python pipelines, Puppeteer E2E validation

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database
- Python 3.9+ (optional, for asset pipeline tooling)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ketewodros41-star/printflow.git
   cd printflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```
   Fill in your PostgreSQL `DATABASE_URL`, `NEXTAUTH_SECRET`, and payment gateway credentials.

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```
printflow/
├── prisma/               # Database schema & migrations
│   └── schema.prisma
├── public/               # Static assets & studio mockup blanks
│   ├── mockups/          # High-resolution photographic garment templates
│   └── icons/
├── scripts/              # Photometric color generation & E2E verification
│   ├── build_full_studio_palette.py
│   └── verify-all-colors-and-cuts.mjs
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Authentication pages (login, signup)
│   │   ├── (public)/     # Public landing, catalog, pricing
│   │   ├── api/          # Payment webhooks & REST endpoints
│   │   ├── create/       # Interactive Design Studio (`/create/[productId]`)
│   │   └── dashboard/    # Merchant & customer dashboards
│   ├── components/       # UI & Mockup Components
│   │   ├── mockups/      # RealisticFlatLay, SVG shader filters, 3D finishes
│   │   └── ui/           # Radix & Tailwind design system primitives
│   ├── lib/              # Database clients, auth configuration, utils
│   └── types/            # TypeScript type contracts
└── middleware.ts         # Route protection & session validation
```

---

## 🧪 Testing & Verification

Run TypeScript compilation check:
```bash
npx tsc --noEmit
```

Run E2E mockup rendering verification:
```bash
node scripts/verify-all-colors-and-cuts.mjs
```

---

## 📄 License

This project is licensed under the MIT License.
