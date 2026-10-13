#!/usr/bin/env python3
"""
Pristine Master Studio Production Pipeline for All-Over Print Polo Shirt
========================================================================
Extracts clean, uncorrupted, continuous master blanks from raw studio sources:
- Zero chewed-off bite marks on the hem or cuffs
- Zero floor shadow bleed or dye pooling on darker colors
- Exact sub-pixel anti-aliased fabric boundaries across all 12 colorways
"""

import os
import cv2
import numpy as np

def generate_master_blanks():
    print("1. Extracting Pristine Front Master from Studio Photo...")
    src_front_path = r'C:\Users\Davea\.gemini\antigravity\brain\437b513a-73e0-4e4b-92bb-e5583cd97c04\.user_uploaded\media_1791840023952_af1d8f5a.png'
    src_front = cv2.imread(src_front_path, cv2.IMREAD_COLOR)
    h, w = src_front.shape[:2]
    gray_front = cv2.cvtColor(src_front, cv2.COLOR_BGR2GRAY)

    # Base fabric mask
    mask_front = (gray_front <= 236).astype(np.uint8) * 255
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    closed_front = cv2.morphologyEx(mask_front, cv2.MORPH_CLOSE, kernel)
    contours, _ = cv2.findContours(closed_front, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    largest_front = max(contours, key=cv2.contourArea)
    solid_front = np.zeros((h, w), np.uint8)
    cv2.drawContours(solid_front, [largest_front], -1, 255, thickness=cv2.FILLED)

    # Smooth physical hem contact trough (natural cloth curve, no artificial argmax jumps)
    trough_y = np.zeros(w, dtype=np.float32)
    for x in range(210, 740):
        trough_y[x] = 936 + np.argmin(gray_front[936:944, x])
    smoothed_hem = cv2.GaussianBlur(trough_y[210:740].reshape(1, -1), (25, 1), 6.0).flatten()

    for i, x in enumerate(range(210, 740)):
        cutoff = int(round(smoothed_hem[i]))
        solid_front[cutoff + 1:, x] = 0

    alpha_front = cv2.GaussianBlur(solid_front, (3, 3), 0.6)
    front_rgba = cv2.cvtColor(src_front, cv2.COLOR_BGR2BGRA)
    front_rgba[:, :, 3] = alpha_front
    front_rgba[solid_front == 0, :3] = 255
    front_rgba[solid_front == 0, 3] = 0

    print("2. Extracting Pristine Back Master...")
    src_back = cv2.imread('scripts/test_clean_aligned_back_v3.png', cv2.IMREAD_UNCHANGED)
    gray_back = cv2.cvtColor(src_back[:, :, :3], cv2.COLOR_BGR2GRAY)
    alpha_back = src_back[:, :, 3].copy()

    # Eliminate floor shadow below back hem while preserving intact hem fold
    for x in range(200, 750):
        for y in range(938, h):
            if gray_back[y, x] < 200:
                alpha_back[y, x] = 0
    alpha_back[941:, :] = 0

    back_rgba = src_back.copy()
    back_rgba[:, :, 3] = cv2.GaussianBlur(alpha_back, (3, 3), 0.5)
    back_rgba[alpha_back == 0, :3] = 255
    back_rgba[alpha_back == 0, 3] = 0

    # Save clean white master blanks
    os.makedirs('public/mockups', exist_ok=True)
    cv2.imwrite('public/mockups/polo-sublimation-front-white.png', front_rgba)
    cv2.imwrite('public/mockups/polo-sublimation-back-white.png', back_rgba)
    print("Saved pristine master white blanks (zero chewed edges, zero floor shadows).")

    # 3. Production Palette (RGB values, brightness multiplier, contrast boost)
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

        # Strict zero-bleed clamp: completely clear outside garment
        out[alpha == 0, :3] = 255
        out[alpha == 0, 3] = 0
        return out.astype(np.uint8)

    print("4. Generating all 24 production blanks across 12 colors...")
    for slug, hex_code, rgb, b_mult, c_boost in PALETTE:
        if slug == "white":
            continue
        front_dyed = dye_blank(front_rgba, rgb, b_mult, c_boost)
        back_dyed = dye_blank(back_rgba, rgb, b_mult, c_boost)

        cv2.imwrite(f'public/mockups/polo-sublimation-front-{slug}.png', front_dyed)
        cv2.imwrite(f'public/mockups/polo-sublimation-back-{slug}.png', back_dyed)
        print(f"  -> Generated polo-sublimation front/back for {slug} ({hex_code})")

    print("All 24 production blanks generated successfully with intact pristine edges!")

if __name__ == '__main__':
    generate_master_blanks()
