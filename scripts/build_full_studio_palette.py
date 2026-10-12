import cv2
import numpy as np
import os

print("Building Master Studio Palette for Long Sleeve Tee...")

# 1. Load source images
neon_path = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749453864_12bff3aa.png'
white_path = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749270517_12f90213.png'

neon = cv2.imread(neon_path)
white = cv2.imread(white_path)

h_w, w_w = white.shape[:2] # 953 x 1024
h_n, w_n = neon.shape[:2]  # 825 x 1024

# 2. Extract mathematically pristine sub-pixel alpha mask from neon
# In neon, garment has low blue channel (B < 150), background has B > 248.
b_ch = neon[:, :, 0].astype(np.float32)
alpha_n = np.clip((247.0 - b_ch) / (247.0 - 165.0), 0.0, 1.0)

# Clear any image boundary artifacts in neon
alpha_n[:, :20] = 0.0
alpha_n[:, 980:] = 0.0
alpha_n[:50, :] = 0.0
alpha_n[780:, :] = 0.0

# Real garment bounds in neon
ys, xs = np.where(alpha_n > 0.05)
min_x, max_x = xs.min(), xs.max()
min_y, max_y = ys.min(), ys.max()
w_garment = max_x - min_x
center_x_n = (min_x + max_x) / 2.0

# Align to 1024x953 master canvas
# Matching the exact white shirt bounds: width=929, center_x=512.0, minY=116.0
scale = 929.0 / w_garment
scaled_w = int(round(w_n * scale))
scaled_h = int(round(h_n * scale))
alpha_scaled = cv2.resize(alpha_n, (scaled_w, scaled_h), interpolation=cv2.INTER_LANCZOS4)

master_alpha = np.zeros((h_w, w_w), dtype=np.float32)
scaled_center_x = center_x_n * scale
offset_x = int(round(512.0 - scaled_center_x))
offset_y = int(round(116.0 - min_y * scale))

src_x1 = max(0, -offset_x)
src_x2 = min(scaled_w, w_w - offset_x)
dst_x1 = max(0, offset_x)
dst_x2 = dst_x1 + (src_x2 - src_x1)

src_y1 = max(0, -offset_y)
src_y2 = min(scaled_h, h_w - offset_y)
dst_y1 = max(0, offset_y)
dst_y2 = dst_y1 + (src_y2 - src_y1)

master_alpha[dst_y1:dst_y2, dst_x1:dst_x2] = alpha_scaled[src_y1:src_y2, src_x1:src_x2]

# Clean borders: zero stray pixels
master_alpha[master_alpha < 0.015] = 0.0
master_alpha[:, :35] = 0.0
master_alpha[:, 985:] = 0.0
master_alpha[:105, :] = 0.0
master_alpha[800:, :] = 0.0

# Subtle anti-aliasing feather on outer 1-pixel rim
master_alpha = cv2.GaussianBlur(master_alpha, (3, 3), 0.4)

# 3. Authentic Textile Shading Map from Photographic White Shirt
white_gray = cv2.cvtColor(white, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
L_ref = 0.94
S = np.clip(white_gray / L_ref, 0.04, 1.20)

# Procedural Heather Marl Texture for Ash, Sport Grey, Dark Heather
# Generated via high-frequency noise scaled and filtered
np.random.seed(42)
heather_noise = np.random.normal(0, 0.055, (h_w, w_w)).astype(np.float32)
heather_noise = cv2.GaussianBlur(heather_noise, (3, 3), 0.6)

# Palette definitions with color-matched reflectance, gamma, and specular sheen
PALETTE = [
    { 'name': 'longsleeve-flatlay-white.png', 'hex': '#FFFFFF', 'isHeather': False, 'gamma': 1.0, 'sheen': 0.0 },
    { 'name': 'longsleeve-flatlay-black.png', 'hex': '#1A1A12', 'isHeather': False, 'gamma': 1.25, 'sheen': 0.045 },
    { 'name': 'longsleeve-flatlay-navy.png', 'hex': '#1B2A4A', 'isHeather': False, 'gamma': 1.28, 'sheen': 0.05 },
    { 'name': 'longsleeve-flatlay-red.png', 'hex': '#C62828', 'isHeather': False, 'gamma': 1.22, 'sheen': 0.06 },
    { 'name': 'longsleeve-flatlay-forest-green.png', 'hex': '#1B4332', 'isHeather': False, 'gamma': 1.28, 'sheen': 0.05 },
    { 'name': 'longsleeve-flatlay-maroon.png', 'hex': '#5C1D24', 'isHeather': False, 'gamma': 1.28, 'sheen': 0.05 },
    { 'name': 'longsleeve-flatlay-royal.png', 'hex': '#1D4ED8', 'isHeather': False, 'gamma': 1.22, 'sheen': 0.06 },
    { 'name': 'longsleeve-flatlay-sand.png', 'hex': '#D4C5B3', 'isHeather': False, 'gamma': 1.15, 'sheen': 0.03 },
    { 'name': 'longsleeve-flatlay-military-green.png', 'hex': '#4B5320', 'isHeather': False, 'gamma': 1.25, 'sheen': 0.05 },
    { 'name': 'longsleeve-flatlay-orange.png', 'hex': '#EA580C', 'isHeather': False, 'gamma': 1.20, 'sheen': 0.06 },
    { 'name': 'longsleeve-flatlay-carolina-blue.png', 'hex': '#7BAED1', 'isHeather': False, 'gamma': 1.16, 'sheen': 0.04 },
    { 'name': 'longsleeve-flatlay-neon.png', 'hex': '#D6ED17', 'isHeather': False, 'gamma': 1.15, 'sheen': 0.04 },
    { 'name': 'longsleeve-flatlay-grey.png', 'hex': '#C8C5C0', 'isHeather': True, 'marl': 0.05, 'gamma': 1.18, 'sheen': 0.03 },
    { 'name': 'longsleeve-flatlay-ash.png', 'hex': '#DEDEDB', 'isHeather': True, 'marl': 0.035, 'gamma': 1.12, 'sheen': 0.02 },
    { 'name': 'longsleeve-flatlay-dark-heather.png', 'hex': '#4A4A48', 'isHeather': True, 'marl': 0.065, 'gamma': 1.25, 'sheen': 0.04 },
]

out_dir = 'public/mockups'

for item in PALETTE:
    print(f"Rendering {item['name']} ({item['hex']})...")
    hex_clean = item['hex'].replace('#', '')
    r_val = int(hex_clean[0:2], 16) / 255.0
    g_val = int(hex_clean[2:4], 16) / 255.0
    b_val = int(hex_clean[4:6], 16) / 255.0

    gamma = item.get('gamma', 1.2)
    S_mod = np.power(S, gamma)

    if item.get('isHeather', False):
        marl_strength = item.get('marl', 0.05)
        S_mod = np.clip(S_mod + heather_noise * marl_strength, 0.05, 1.25)

    r_out = r_val * S_mod
    g_out = g_val * S_mod
    b_out = b_val * S_mod

    sheen_strength = item.get('sheen', 0.0)
    if sheen_strength > 0:
        sheen = np.power(np.clip((white_gray - 0.85) / 0.15, 0.0, 1.0), 2.0) * sheen_strength
        r_out += sheen
        g_out += sheen
        b_out += sheen

    if item['hex'] == '#FFFFFF':
        # Pure white shirt: preserve photographic original
        r_final = np.uint8(np.clip(white[:, :, 2], 0, 255))
        g_final = np.uint8(np.clip(white[:, :, 1], 0, 255))
        b_final = np.uint8(np.clip(white[:, :, 0], 0, 255))
    else:
        r_final = np.uint8(np.clip(r_out * 255.0, 0, 255))
        g_final = np.uint8(np.clip(g_out * 255.0, 0, 255))
        b_final = np.uint8(np.clip(b_out * 255.0, 0, 255))

    a_final = np.uint8(np.clip(master_alpha * 255.0, 0, 255))

    # Clamp zero-alpha background to pure transparent white (prevents bilinear / CSS blend color overflow)
    mask_zero = (a_final == 0)
    r_final[mask_zero] = 255
    g_final[mask_zero] = 255
    b_final[mask_zero] = 255

    rgba = cv2.merge([b_final, g_final, r_final, a_final]) # BGR + A
    out_path = os.path.join(out_dir, item['name'])
    cv2.imwrite(out_path, rgba)
    print(f"Saved {out_path}")

# 4. Generate Back Blanks from True Photographic Reference Image & Unified Silhouette
print("Generating back blanks with unified master silhouette and authentic collar...")
back_source_path = 'scripts/source-longsleeve-back.png'
if not os.path.exists(back_source_path):
    back_source_path = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791821587066_48ab0d93.png'

im_back = cv2.imread(back_source_path)
h_b, w_b = im_back.shape[:2]

# 4.1 Align photographic back image to master canvas stage
scale_b = 929.0 / 1014.0
scaled_w_b = int(round(w_b * scale_b))
scaled_h_b = int(round(h_b * scale_b))

im_b_scaled = cv2.resize(im_back, (scaled_w_b, scaled_h_b), interpolation=cv2.INTER_LANCZOS4)
offset_x_b = (w_w - scaled_w_b) // 2
collar_y_in_scaled = int(round(56.0 * scale_b))
offset_y_b = 118 - collar_y_in_scaled

aligned_back = np.full((h_w, w_w, 3), 255, dtype=np.uint8)
aligned_back[offset_y_b:offset_y_b+scaled_h_b, offset_x_b:offset_x_b+scaled_w_b] = im_b_scaled

# 4.2 Extract authentic rear collar ribbing from aligned back photograph
aligned_back_gray = cv2.cvtColor(aligned_back, cv2.COLOR_BGR2GRAY).astype(np.float32)
# Background in aligned_back is >= 253, collar ribbing fabric is <= 245
t_collar = np.clip((252.0 - aligned_back_gray) / 10.0, 0.0, 1.0)
collar_alpha = t_collar * t_collar * (3.0 - 2.0 * t_collar)

# Unified master back alpha: shares front garment's exact hem, cuffs, armpits, and silhouette,
# with the neck cavity filled by the authentic rear collar ribbing arch
master_back_alpha = np.copy(master_alpha)
for y in range(112, 145):
    for x in range(430, 595):
        if master_alpha[y, x] < 0.95:
            master_back_alpha[y, x] = np.maximum(master_alpha[y, x], collar_alpha[y, x])

master_back_alpha[master_back_alpha < 0.015] = 0.0
master_back_alpha[800:, :] = 0.0
master_back_alpha = cv2.GaussianBlur(master_back_alpha, (3, 3), 0.4)

# 4.3 Authentic Shading Map from Photographic Back View
white_back_gray = cv2.cvtColor(aligned_back, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
S_back = np.clip(white_back_gray / 0.94, 0.04, 1.20)

for item in PALETTE:
    back_name = item['name'].replace('longsleeve-flatlay-', 'longsleeve-flatlay-back-')
    print(f"Rendering BACK {item['name']} ({item['hex']}) -> {back_name}...")
    hex_clean = item['hex'].replace('#', '')
    r_val = int(hex_clean[0:2], 16) / 255.0
    g_val = int(hex_clean[2:4], 16) / 255.0
    b_val = int(hex_clean[4:6], 16) / 255.0

    gamma = item.get('gamma', 1.2)
    S_mod = np.power(S_back, gamma)
    if item.get('isHeather', False):
        marl_strength = item.get('marl', 0.05)
        S_mod = np.clip(S_mod + heather_noise * marl_strength, 0.05, 1.25)

    r_out = r_val * S_mod
    g_out = g_val * S_mod
    b_out = b_val * S_mod

    sheen_strength = item.get('sheen', 0.0)
    if sheen_strength > 0:
        sheen = np.power(np.clip((white_back_gray - 0.85) / 0.15, 0.0, 1.0), 2.0) * sheen_strength
        r_out += sheen
        g_out += sheen
        b_out += sheen

    if item['hex'] == '#FFFFFF':
        # Pure white shirt: preserve authentic photographic original
        r_final = np.uint8(np.clip(aligned_back[:, :, 2], 0, 255))
        g_final = np.uint8(np.clip(aligned_back[:, :, 1], 0, 255))
        b_final = np.uint8(np.clip(aligned_back[:, :, 0], 0, 255))
    else:
        r_final = np.uint8(np.clip(r_out * 255.0, 0, 255))
        g_final = np.uint8(np.clip(g_out * 255.0, 0, 255))
        b_final = np.uint8(np.clip(b_out * 255.0, 0, 255))

    a_final = np.uint8(np.clip(master_back_alpha * 255.0, 0, 255))

    # Clamp zero-alpha background to pure transparent white (prevents bilinear / CSS blend color overflow)
    mask_zero = (a_final == 0)
    r_final[mask_zero] = 255
    g_final[mask_zero] = 255
    b_final[mask_zero] = 255

    rgba = cv2.merge([b_final, g_final, r_final, a_final])
    out_path = os.path.join(out_dir, back_name)
    cv2.imwrite(out_path, rgba)

# Default fallback white back blank
default_back_r = np.uint8(np.clip(aligned_back[:, :, 2], 0, 255))
default_back_g = np.uint8(np.clip(aligned_back[:, :, 1], 0, 255))
default_back_b = np.uint8(np.clip(aligned_back[:, :, 0], 0, 255))
default_back_a = np.uint8(np.clip(master_back_alpha * 255.0, 0, 255))
mask_zero = (default_back_a == 0)
default_back_r[mask_zero] = 255
default_back_g[mask_zero] = 255
default_back_b[mask_zero] = 255

default_back = cv2.merge([default_back_b, default_back_g, default_back_r, default_back_a])
cv2.imwrite(os.path.join(out_dir, 'longsleeve-flatlay-back.png'), default_back)
print("Saved public/mockups/longsleeve-flatlay-back.png and all colorway back blanks!")
print("Full Studio Palette (Front & Back) rendered successfully!")


