#!/usr/bin/env python3
"""
Pristine Master Studio Production Pipeline for All-Over Print Polo Shirt
========================================================================
Extracts clean, uncorrupted, continuous master blanks from raw studio sources:
- Sub-pixel anti-aliased edge matting via 4x Supersampling Anti-Aliasing (SSAA)
- Intact, straight, unbroken bottom hem at y=941.5 across all colors
- Clean cuff and sleeve boundaries with zero stair-stepping
- Identically aligned front and back garment silhouettes
- Fully calibrated 12-colorway production blanks with specular peak preservation
"""

import os
import cv2
import numpy as np

def generate_master_blanks():
    print("1. Extracting Pristine Front Master from Studio Photo with 4x SSAA...")
    src_front_path = r'C:\Users\Davea\.gemini\antigravity\brain\437b513a-73e0-4e4b-92bb-e5583cd97c04\.user_uploaded\media_1791840023952_af1d8f5a.png'
    src_front = cv2.imread(src_front_path, cv2.IMREAD_COLOR)
    h, w = src_front.shape[:2]
    gray_front = cv2.cvtColor(src_front, cv2.COLOR_BGR2GRAY)

    _, thresh_front = cv2.threshold(gray_front, 246, 255, cv2.THRESH_BINARY_INV)
    # Floor shadow elimination strictly below physical hem
    thresh_front[942:, :] = 0

    contours_front, _ = cv2.findContours(thresh_front, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    largest_front = max(contours_front, key=cv2.contourArea)

    # 1D Periodic Gaussian trajectory smoothing along closed contour curve
    from scipy.ndimage import gaussian_filter1d
    pts_front = largest_front.reshape(-1, 2).astype(np.float32)
    smooth_fx = gaussian_filter1d(pts_front[:, 0], sigma=2.0, mode='wrap')
    smooth_fy = gaussian_filter1d(pts_front[:, 1], sigma=2.0, mode='wrap')
    smooth_pts_front = np.stack([smooth_fx, smooth_fy], axis=1)

    # 4x Supersampling Anti-Aliasing (SSAA)
    scale = 4
    large_h, large_w = h * scale, w * scale
    large_mask_front = np.zeros((large_h, large_w), np.uint8)
    scaled_contour_front = (smooth_pts_front * scale).astype(np.int32)
    cv2.drawContours(large_mask_front, [scaled_contour_front], -1, 255, -1)

    # Clean horizontal hem cutoff in 4x space
    large_mask_front[int(941.5 * scale):, :] = 0

    # Sub-pixel anti-aliasing Gaussian smoothing in 4x space
    large_smooth_front = cv2.GaussianBlur(large_mask_front.astype(np.float32), (7, 7), 1.5)
    alpha_front = cv2.resize(large_smooth_front, (w, h), interpolation=cv2.INTER_AREA)
    alpha_front = np.clip(alpha_front, 0, 255).astype(np.uint8)

    front_rgba = cv2.cvtColor(src_front, cv2.COLOR_BGR2BGRA)
    front_rgba[:, :, 3] = alpha_front
    front_rgba[alpha_front == 0, :3] = 255

    print("2. Extracting Pristine Back Master with 4x SSAA & Contour Smoothing...")
    src_back = cv2.imread('scripts/test_clean_aligned_back_v3.png', cv2.IMREAD_UNCHANGED)
    back_bgr = src_back[:, :, :3]
    gray_back = cv2.cvtColor(back_bgr, cv2.COLOR_BGR2GRAY)

    _, thresh_back = cv2.threshold(gray_back, 246, 255, cv2.THRESH_BINARY_INV)
    thresh_back[942:, :] = 0

    contours_back, _ = cv2.findContours(thresh_back, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    largest_back = max(contours_back, key=cv2.contourArea)

    pts_back = largest_back.reshape(-1, 2).astype(np.float32)
    smooth_bx = gaussian_filter1d(pts_back[:, 0], sigma=2.0, mode='wrap')
    smooth_by = gaussian_filter1d(pts_back[:, 1], sigma=2.0, mode='wrap')
    smooth_pts_back = np.stack([smooth_bx, smooth_by], axis=1)

    large_mask_back = np.zeros((large_h, large_w), np.uint8)
    scaled_contour_back = (smooth_pts_back * scale).astype(np.int32)
    cv2.drawContours(large_mask_back, [scaled_contour_back], -1, 255, -1)
    large_mask_back[int(941.5 * scale):, :] = 0

    large_smooth_back = cv2.GaussianBlur(large_mask_back.astype(np.float32), (7, 7), 1.5)
    alpha_back = cv2.resize(large_smooth_back, (w, h), interpolation=cv2.INTER_AREA)
    alpha_back = np.clip(alpha_back, 0, 255).astype(np.uint8)

    back_rgba = cv2.cvtColor(back_bgr, cv2.COLOR_BGR2BGRA)
    back_rgba[:, :, 3] = alpha_back
    back_rgba[alpha_back == 0, :3] = 255

    # Save clean white master blanks
    os.makedirs('public/mockups', exist_ok=True)
    cv2.imwrite('public/mockups/polo-sublimation-front-white.png', front_rgba)
    cv2.imwrite('public/mockups/polo-sublimation-back-white.png', back_rgba)
    print("Saved pristine white master blanks with smooth anti-aliased contours.")

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

        # Pure transparent outside garment
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
