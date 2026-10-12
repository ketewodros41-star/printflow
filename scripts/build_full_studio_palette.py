import cv2
import numpy as np
import os

print("Building Master Studio Palette for Long Sleeve Tee (Front & Back)...")

# 1. Source image paths
neon_path = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749453864_12bff3aa.png'
white_path = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749270517_12f90213.png'
back_path = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791821587066_48ab0d93.png'

neon = cv2.imread(neon_path)
white = cv2.imread(white_path)
im_back = cv2.imread(back_path)

h_w, w_w = white.shape[:2] # 953 x 1024
h_n, w_n = neon.shape[:2]  # 825 x 1024
h_b, w_b = im_back.shape[:2] # 804 x 1024

out_dir = 'public/mockups'
os.makedirs(out_dir, exist_ok=True)

# ═══════════════════════════════════════════════════════════════════════════
# 2. Extract mathematically pristine sub-pixel alpha mask for FRONT
# ═══════════════════════════════════════════════════════════════════════════
b_ch = neon[:, :, 0].astype(np.float32)
alpha_n = np.clip((247.0 - b_ch) / (247.0 - 165.0), 0.0, 1.0)

alpha_n[:, :20] = 0.0
alpha_n[:, 980:] = 0.0
alpha_n[:50, :] = 0.0

ys, xs = np.where(alpha_n > 0.05)
min_x, max_x = xs.min(), xs.max()
min_y, max_y = ys.min(), ys.max()
w_garment = max_x - min_x
center_x_n = (min_x + max_x) / 2.0

scale_front = 929.0 / w_garment
scaled_w_f = int(round(w_n * scale_front))
scaled_h_f = int(round(h_n * scale_front))
alpha_scaled_f = cv2.resize(alpha_n, (scaled_w_f, scaled_h_f), interpolation=cv2.INTER_LANCZOS4)

master_alpha_front = np.zeros((h_w, w_w), dtype=np.float32)
scaled_center_x = center_x_n * scale_front
offset_x_f = int(round(512.0 - scaled_center_x))
offset_y_f = int(round(116.0 - min_y * scale_front))

src_x1 = max(0, -offset_x_f)
src_x2 = min(scaled_w_f, w_w - offset_x_f)
dst_x1 = max(0, offset_x_f)
dst_x2 = dst_x1 + (src_x2 - src_x1)

src_y1 = max(0, -offset_y_f)
src_y2 = min(scaled_h_f, h_w - offset_y_f)
dst_y1 = max(0, offset_y_f)
dst_y2 = dst_y1 + (src_y2 - src_y1)

master_alpha_front[dst_y1:dst_y2, dst_x1:dst_x2] = alpha_scaled_f[src_y1:src_y2, src_x1:src_x2]

master_alpha_front[master_alpha_front < 0.015] = 0.0
master_alpha_front[:, :35] = 0.0
master_alpha_front[:, 985:] = 0.0
master_alpha_front[:105, :] = 0.0
master_alpha_front[804:, :] = 0.0
master_alpha_front = cv2.GaussianBlur(master_alpha_front, (3, 3), 0.4)
master_alpha_front[master_alpha_front < 0.02] = 0.0

white_gray_f = cv2.cvtColor(white, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
S_front = np.clip(white_gray_f / 0.94, 0.04, 1.20)

# ═══════════════════════════════════════════════════════════════════════════
# 3. Construct Unified Master Alpha & Texture Shading for BACK
#    - Silhouette Parity: Master torso, cuffs, hem curve, and sleeves are 100% identical to front
#    - Authentic Collar Arch: Rear collar ribbing arch extracted from media_1791821587066_48ab0d93.png
# ═══════════════════════════════════════════════════════════════════════════
# Collar scale and alignment matching shoulder seam peaks
scale_b = (583.0 - 435.0) / (587.0 - 427.0) # 0.9250
scaled_w_b = int(round(w_b * scale_b))
scaled_h_b = int(round(h_b * scale_b))
b_scaled = cv2.resize(im_back, (scaled_w_b, scaled_h_b), interpolation=cv2.INTER_LANCZOS4)

tx = int(round(435.0 - 427.0 * scale_b))
ty = int(round(122.0 - 40.0 * scale_b))

b_canvas = np.full((h_w, w_w, 3), 255, dtype=np.uint8)
src_bx1 = max(0, -tx)
src_bx2 = min(scaled_w_b, w_w - tx)
dst_bx1 = max(0, tx)
dst_bx2 = dst_bx1 + (src_bx2 - src_bx1)

src_by1 = max(0, -ty)
src_by2 = min(scaled_h_b, h_w - ty)
dst_by1 = max(0, ty)
dst_by2 = dst_by1 + (src_by2 - src_by1)
b_canvas[dst_by1:dst_by2, dst_bx1:dst_bx2] = b_scaled[src_by1:src_by2, src_bx1:src_bx2]

# Start with front silhouette (guarantees identical cuffs, curved hem, and side seams)
master_alpha_back = master_alpha_front.copy()

# Fuse authentic rear collar arch from photographic back reference
gray_b_canvas = cv2.cvtColor(b_canvas, cv2.COLOR_BGR2GRAY).astype(np.float32)
diff_b_collar = np.clip((252.0 - gray_b_canvas) / 8.0, 0.0, 1.0)

for y in range(110, 180):
    for x in range(425, 595):
        master_alpha_back[y, x] = max(master_alpha_back[y, x], diff_b_collar[y, x])

collar_roi = master_alpha_back[110:150, 420:600]
master_alpha_back[110:150, 420:600] = cv2.GaussianBlur(collar_roi, (3, 3), 0.4)
master_alpha_back[master_alpha_back < 0.02] = 0.0

# Master back rgb: Authentic back wrinkles & collar ribbing
master_back_rgb = white.copy()
valid_b_fabric = (gray_b_canvas < 250.0)
for c in range(3):
    master_back_rgb[:, :, c] = np.where(valid_b_fabric, b_canvas[:, :, c], white[:, :, c])

white_gray_b = cv2.cvtColor(master_back_rgb, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
S_back = np.clip(white_gray_b / 0.94, 0.04, 1.20)

# Procedural Heather Marl Texture
np.random.seed(42)
heather_noise = np.random.normal(0, 0.055, (h_w, w_w)).astype(np.float32)
heather_noise = cv2.GaussianBlur(heather_noise, (3, 3), 0.6)

# Palette definitions
PALETTE = [
    { 'name': 'longsleeve-flatlay-white.png', 'back': 'longsleeve-flatlay-back-white.png', 'hex': '#FFFFFF', 'isHeather': False, 'gamma': 1.0, 'sheen': 0.0 },
    { 'name': 'longsleeve-flatlay-black.png', 'back': 'longsleeve-flatlay-back-black.png', 'hex': '#1A1A12', 'isHeather': False, 'gamma': 1.25, 'sheen': 0.045 },
    { 'name': 'longsleeve-flatlay-navy.png', 'back': 'longsleeve-flatlay-back-navy.png', 'hex': '#1B2A4A', 'isHeather': False, 'gamma': 1.28, 'sheen': 0.05 },
    { 'name': 'longsleeve-flatlay-red.png', 'back': 'longsleeve-flatlay-back-red.png', 'hex': '#C62828', 'isHeather': False, 'gamma': 1.22, 'sheen': 0.06 },
    { 'name': 'longsleeve-flatlay-forest-green.png', 'back': 'longsleeve-flatlay-back-forest-green.png', 'hex': '#1B4332', 'isHeather': False, 'gamma': 1.28, 'sheen': 0.05 },
    { 'name': 'longsleeve-flatlay-maroon.png', 'back': 'longsleeve-flatlay-back-maroon.png', 'hex': '#5C1D24', 'isHeather': False, 'gamma': 1.28, 'sheen': 0.05 },
    { 'name': 'longsleeve-flatlay-royal.png', 'back': 'longsleeve-flatlay-back-royal.png', 'hex': '#1D4ED8', 'isHeather': False, 'gamma': 1.22, 'sheen': 0.06 },
    { 'name': 'longsleeve-flatlay-sand.png', 'back': 'longsleeve-flatlay-back-sand.png', 'hex': '#D4C5B3', 'isHeather': False, 'gamma': 1.15, 'sheen': 0.03 },
    { 'name': 'longsleeve-flatlay-military-green.png', 'back': 'longsleeve-flatlay-back-military-green.png', 'hex': '#4B5320', 'isHeather': False, 'gamma': 1.25, 'sheen': 0.05 },
    { 'name': 'longsleeve-flatlay-orange.png', 'back': 'longsleeve-flatlay-back-orange.png', 'hex': '#EA580C', 'isHeather': False, 'gamma': 1.20, 'sheen': 0.06 },
    { 'name': 'longsleeve-flatlay-carolina-blue.png', 'back': 'longsleeve-flatlay-back-carolina-blue.png', 'hex': '#7BAED1', 'isHeather': False, 'gamma': 1.16, 'sheen': 0.04 },
    { 'name': 'longsleeve-flatlay-neon.png', 'back': 'longsleeve-flatlay-back-neon.png', 'hex': '#D6ED17', 'isHeather': False, 'gamma': 1.15, 'sheen': 0.04 },
    { 'name': 'longsleeve-flatlay-grey.png', 'back': 'longsleeve-flatlay-back-grey.png', 'hex': '#C8C5C0', 'isHeather': True, 'marl': 0.05, 'gamma': 1.18, 'sheen': 0.03 },
    { 'name': 'longsleeve-flatlay-ash.png', 'back': 'longsleeve-flatlay-back-ash.png', 'hex': '#DEDEDB', 'isHeather': True, 'marl': 0.035, 'gamma': 1.12, 'sheen': 0.02 },
    { 'name': 'longsleeve-flatlay-dark-heather.png', 'back': 'longsleeve-flatlay-back-dark-heather.png', 'hex': '#4A4A48', 'isHeather': True, 'marl': 0.065, 'gamma': 1.25, 'sheen': 0.04 },
]

def render_garment_blank(item, is_back=False):
    S_map = S_back if is_back else S_front
    source_rgb = master_back_rgb if is_back else white
    alpha_map = master_alpha_back if is_back else master_alpha_front
    white_gray = white_gray_b if is_back else white_gray_f

    hex_clean = item['hex'].replace('#', '')
    r_val = int(hex_clean[0:2], 16) / 255.0
    g_val = int(hex_clean[2:4], 16) / 255.0
    b_val = int(hex_clean[4:6], 16) / 255.0

    gamma = item.get('gamma', 1.2)
    S_mod = np.power(S_map, gamma)

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
        r_final = np.uint8(np.clip(source_rgb[:, :, 2], 0, 255))
        g_final = np.uint8(np.clip(source_rgb[:, :, 1], 0, 255))
        b_final = np.uint8(np.clip(source_rgb[:, :, 0], 0, 255))
    else:
        r_final = np.uint8(np.clip(r_out * 255.0, 0, 255))
        g_final = np.uint8(np.clip(g_out * 255.0, 0, 255))
        b_final = np.uint8(np.clip(b_out * 255.0, 0, 255))

    a_final = np.uint8(np.clip(alpha_map * 255.0, 0, 255))

    # Senior Engineering Clamping:
    # 1. Zero alpha background pixels are strictly clamped to pure transparent white (255, 255, 255, 0)
    #    This guarantees 0px color spill or RGB dye bleeding into the background across all colorways!
    mask_zero = (a_final == 0)
    r_final[mask_zero] = 255
    g_final[mask_zero] = 255
    b_final[mask_zero] = 255

    # 2. Sub-pixel anti-aliased edge pixels (0 < alpha < 255) retain their true dyed fabric color
    #    without pre-multiplying with white, allowing the browser's GPU compositing pipeline to blend
    #    smoothly with zero white halo or edge fringing.

    rgba = cv2.merge([b_final, g_final, r_final, a_final])
    return rgba

# ═══════════════════════════════════════════════════════════════════════════
# 4. Render All Front & Back Palette Blanks
# ═══════════════════════════════════════════════════════════════════════════
for item in PALETTE:
    # Front
    rgba_front = render_garment_blank(item, is_back=False)
    front_out = os.path.join(out_dir, item['name'])
    cv2.imwrite(front_out, rgba_front)

    # Back
    rgba_back = render_garment_blank(item, is_back=True)
    back_out = os.path.join(out_dir, item['back'])
    cv2.imwrite(back_out, rgba_back)
    print(f"Rendered front: {item['name']}, back: {item['back']}")

# Fallback default back blank
cv2.imwrite(os.path.join(out_dir, 'longsleeve-flatlay-back.png'), render_garment_blank(PALETTE[0], is_back=True))
print("Saved default public/mockups/longsleeve-flatlay-back.png!")
print("Full Studio Palette (Front & Back) built successfully!")
