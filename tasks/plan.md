# Implementation Plan: Long Sleeve Garment & Mockup Suite Overhaul

## Overview
Overhaul the Long Sleeve T-Shirt in both Editor (Design Mode) and Preview (Mockup View) to match Printify apparel standards based on 5 user-provided reference images:
- Editor Mode: Exact vector silhouette from Image 1, heather grain texture from Image 2, and Printify variant management sidebar from Image 2.
- Preview Mode: High-resolution photographic blanks from Images 3, 4, 5, with optical dyeing, and 6 mockup scenes (Front, Back, Collar Closeup, Person Left, Person Right, Size Chart).
- Multi-technique artwork projection: seamless blending of DTG, chenille moss-stitch, satin embroidery, screen print, and vinyl.

## Architecture Decisions
- **Vector Silhouette (`ProductMockups.tsx`)**: SVG geometry matching Image 1 technical apparel sketch with distinct sleeve curves, elbow fold lines, ribbed wrist cuffs, inner neck crescent, and dashed print bounds.
- **Procedural Heather Texture (`ProductMockups.tsx`)**: SVG `feTurbulence` / `feColorMatrix` filter for Sport Grey, Ash, and Dark Heather editor garments.
- **Variant Selector (`page.tsx`)**: Printify-style variant panel with Color/Size tabs, variant limit guidance, master selection, textured circular swatches, and size expansion.
- **Photographic Flat Lays (`RealisticFlatLay.tsx` + `public/mockups/`)**: Isolate user images (Images 3, 4, 5) into transparent PNGs, dyed into 12+ standard garment colors.
- **Collar Closeup & Model Scenes**: Macro 2.2x zoom focused on collar and chest, plus contextual on-model views.

## Task List

### Phase 1: Editor Long-Sleeve Silhouette & Texture (Images 1 & 2)
- [x] Task 1.1: Build authentic SVG geometry for LongSleeveMockup matching Image 1
- [x] Task 1.2: Add heather / melange procedural texture shader for Sport Grey and Ash
- [x] Task 1.3: Align dashed print area guide (12" x 16") and print zones

### Phase 2: Editor Color Variant & Multi-Select Sidebar UI (Image 2)
- [x] Task 2.1: Add expanded color palette (15+ colors) with heather flags
- [x] Task 2.2: Implement Printify-style Color/Size variant panel in Editor mode
- [x] Task 2.3: Add Front/Back toggle pills and sync active side

### Phase 3: Photographic Blanks & Optical Textile Dyeing (Images 3, 4, 5)
- [x] Task 3.1: Isolate user uploaded long sleeve images into transparent PNGs
- [x] Task 3.2: Run dyeing engine to generate full photographic blank palette
- [x] Task 3.3: Upgrade `RealisticLongSleeveFlatLay` to project on photographic blanks

### Phase 4: Mockup Scenes Suite (Front, Back, Collar Closeup, Person Left, Person Right)
- [x] Task 4.1: Register long sleeve scenes: Front, Back, Collar Closeup, Person Left, Person Right, Size Chart
- [x] Task 4.2: Implement macro zoom projection for Collar Closeup
- [x] Task 4.3: Implement on-model views for Person Left and Person Right

### Phase 5: Verification & Testing
- [x] Task 5.1: Typecheck with `npx tsc --noEmit`
- [x] Task 5.2: Capture and inspect automated Puppeteer test screenshots
