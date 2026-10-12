#!/usr/bin/env python3
"""
Master Studio Production Pipeline for All-Over Print Polo Shirt
==============================================================
Generates pixel-perfect Front and Back studio blanks across 12 production colors
with strict ZERO-BLEED guarantees (no floor shadow pooling, no halo artifacts).
"""

import os
import cv2
import numpy as np

def build_master_polo():
    print("1. Loading Clean Front and Back Master Bases...")
    master_front_rgba = cv2.imread('scripts/test_smooth_hem.png', cv2.IMREAD_UNCHANGED)
    master_back_rgba = cv2.imread('scripts/test_clean_aligned_back_v3.png', cv2.IMREAD_UNCHANGED)

    # Save master white blanks
    os.makedirs('public/mockups', exist_ok=True)
    cv2.imwrite('public/mockups/polo-sublimation-front-white.png', master_front_rgba)
    cv2.imwrite('public/mockups/polo-sublimation-back-white.png', master_back_rgba)
    print("Saved clean master white blanks.")

    # 2. Production Palette (RGB values)
    PALETTE = [
        ("white", "#FFFFFF", (250, 250, 248), 1.0, 1.0),
        ("black", "#1A1A12", (26, 26, 18), 1.0, 1.25),
        ("navy", "#1B2A4A", (27, 42, 74), 1.05, 1.22),
        ("heather-grey", "#C8C5C0", (200, 197, 192), 1.0, 1.05),
        ("red", "#C62828", (198, 40, 40), 1.0, 1.15),
        ("forest-green", "#2E4A2E", (46, 74, 46), 1.05, 1.22),
        ("olive", "#4A5E35", (74, 94, 53), 1.0, 1.18),
        ("sage", "#8FAF7A", (143, 175, 122), 1.0, 1.10),
        ("pepper", "#373435", (55, 52, 53), 1.0, 1.25),
        ("chambray", "#7799B5", (119, 153, 181), 1.0, 1.12),
        ("seafoam", "#8DB8A7", (141, 184, 167), 1.0, 1.10),
        ("terracotta", "#B86851", (184, 104, 81), 1.0, 1.15),
    ]

    def dye_blank(base_rgba, color_rgb, b_mult, c_boost):
        arr = base_rgba.astype(np.float32)
        b_ch = arr[:, :, 0]
        g_ch = arr[:, :, 1]
        r_ch = arr[:, :, 2]
        alpha = arr[:, :, 3]

        if color_rgb == (250, 250, 248):
            return base_rgba

        lum = (0.114 * b_ch + 0.587 * g_ch + 0.299 * r_ch) / 255.0
        S = np.clip(lum / 0.92, 0.04, 1.25)
        S_curved = np.power(S, c_boost)

        target_r, target_g, target_b = color_rgb
        # Note: In OpenCV BGR format:
        dyed_b = S_curved * target_b * b_mult
        dyed_g = S_curved * target_g * b_mult
        dyed_r = S_curved * target_r * b_mult

        specular = np.power(np.clip((lum - 0.84) / 0.16, 0.0, 1.0), 2.0) * 16.0
        dyed_b += specular
        dyed_g += specular
        dyed_r += specular

        out = np.zeros_like(arr)
        out[:, :, 0] = np.clip(dyed_b, 0, 255)
        out[:, :, 1] = np.clip(dyed_g, 0, 255)
        out[:, :, 2] = np.clip(dyed_r, 0, 255)
        out[:, :, 3] = alpha

        # Strict zero-bleed clamp
        out[alpha == 0, :3] = 255
        out[alpha == 0, 3] = 0
        return out.astype(np.uint8)

    print("3. Generating 12 Production Colors for Front and Back...")
    for slug, hex_code, rgb, b_mult, c_boost in PALETTE:
        if slug == "white":
            continue
        front_dyed = dye_blank(master_front_rgba, rgb, b_mult, c_boost)
        back_dyed = dye_blank(master_back_rgba, rgb, b_mult, c_boost)

        cv2.imwrite(f'public/mockups/polo-sublimation-front-{slug}.png', front_dyed)
        cv2.imwrite(f'public/mockups/polo-sublimation-back-{slug}.png', back_dyed)
        print(f"  -> Generated polo-sublimation front/back for {slug} ({hex_code})")

    print("Master Studio Production Blanks successfully created with zero-bleed guarantee!")

if __name__ == "__main__":
    build_master_polo()
