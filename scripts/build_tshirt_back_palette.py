import cv2
import numpy as np
import os

print("Building Master Studio Palette for Short Sleeve T-Shirt Back...")

# 1. Source files
user_back_path = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791837704681_77bdf4c2.png'
front_white_path = 'public/mockups/tshirt-flatlay-white.png'

ub = cv2.imread(user_back_path)
fw = cv2.imread(front_white_path, cv2.IMREAD_UNCHANGED)
fw_a = fw[:, :, 3].astype(np.float32) / 255.0

# 2. Geometric alignment matching shoulder peaks
# Front Left Peak:  x=368, y=70; Right Peak: x=576, y=71 (Span = 208)
# Back Left Peak:   x=373, y=66; Right Peak: x=579, y=66 (Span = 206)
scale = 208.0 / 206.0 # 1.0097
scaled_w = int(round(ub.shape[1] * scale))
scaled_h = int(round(ub.shape[0] * scale))
ub_scaled = cv2.resize(ub, (scaled_w, scaled_h), interpolation=cv2.INTER_LANCZOS4)

tx = int(round(368.0 - 373.0 * scale)) # -9
ty = int(round(70.0 - 66.0 * scale))   # 3

h_canvas, w_canvas = fw.shape[:2] # 1024, 985
ub_canvas = np.full((h_canvas, w_canvas, 3), 255, dtype=np.uint8)

src_x1 = max(0, -tx)
src_x2 = min(scaled_w, w_canvas - tx)
dst_x1 = max(0, tx)
dst_x2 = dst_x1 + (src_x2 - src_x1)

src_y1 = max(0, -ty)
src_y2 = min(scaled_h, h_canvas - ty)
dst_y1 = max(0, ty)
dst_y2 = dst_y1 + (src_y2 - src_y1)

ub_canvas[dst_y1:dst_y2, dst_x1:dst_x2] = ub_scaled[src_y1:src_y2, src_x1:src_x2]

# 3. Master Back Alpha: Inherits front silhouette (cuffs, hem curve, sleeves, side seams)
# and seamlessly fills the neck cavity with the authentic rear collar ribbing arch!
master_back_alpha = fw_a.copy()
gray_ub = cv2.cvtColor(ub_canvas, cv2.COLOR_BGR2GRAY).astype(np.float32)
diff_ub_collar = np.clip((252.0 - gray_ub) / 8.0, 0.0, 1.0)

for y in range(65, 210):
    for x in range(360, 590):
        master_back_alpha[y, x] = max(master_back_alpha[y, x], diff_ub_collar[y, x])

collar_roi = master_back_alpha[65:110, 360:590]
master_back_alpha[65:110, 360:590] = cv2.GaussianBlur(collar_roi, (3, 3), 0.4)
master_back_alpha[master_back_alpha < 0.02] = 0.0

# 4. Master Back RGB: Authentic fabric folds, texture & collar ribbing
master_back_rgb = fw[:, :, :3].copy()
valid_ub_fabric = (gray_ub < 252.0)
for c in range(3):
    master_back_rgb[:, :, c] = np.where(valid_ub_fabric, ub_canvas[:, :, c], fw[:, :, c])

# Gray luminance map for textile dyeing
white_gray_b = cv2.cvtColor(master_back_rgb, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
S_back = np.clip(white_gray_b / 0.94, 0.04, 1.20)

# Procedural Heather Marl Texture
np.random.seed(42)
heather_noise = np.random.normal(0, 0.055, (h_canvas, w_canvas)).astype(np.float32)
heather_noise = cv2.GaussianBlur(heather_noise, (3, 3), 0.6)

# 5. Palette Definitions for T-Shirt
TSHIRT_PALETTE = [
    { 'name': 'tshirt-flatlay-back-white.png', 'hex': '#FFFFFF', 'isHeather': False, 'gamma': 1.0, 'sheen': 0.0 },
    { 'name': 'tshirt-flatlay-back-black.png', 'hex': '#1A1A12', 'isHeather': False, 'gamma': 1.25, 'sheen': 0.045 },
    { 'name': 'tshirt-flatlay-back-navy.png', 'hex': '#1B2A4A', 'isHeather': False, 'gamma': 1.28, 'sheen': 0.05 },
    { 'name': 'tshirt-flatlay-back-heather-grey.png', 'hex': '#C8C5C0', 'isHeather': True, 'marl': 0.05, 'gamma': 1.18, 'sheen': 0.03 },
    { 'name': 'tshirt-flatlay-back-red.png', 'hex': '#C62828', 'isHeather': False, 'gamma': 1.22, 'sheen': 0.06 },
    { 'name': 'tshirt-flatlay-back-forest-green.png', 'hex': '#2E4A2E', 'isHeather': False, 'gamma': 1.28, 'sheen': 0.05 },
    { 'name': 'tshirt-flatlay-back-olive.png', 'hex': '#4A5E35', 'isHeather': False, 'gamma': 1.25, 'sheen': 0.05 },
    { 'name': 'tshirt-flatlay-back-sage.png', 'hex': '#8FAF7A', 'isHeather': False, 'gamma': 1.18, 'sheen': 0.04 },
    { 'name': 'tshirt-flatlay-back-pepper.png', 'hex': '#373435', 'isHeather': False, 'gamma': 1.24, 'sheen': 0.045 },
    { 'name': 'tshirt-flatlay-back-chambray.png', 'hex': '#7799B5', 'isHeather': False, 'gamma': 1.18, 'sheen': 0.04 },
    { 'name': 'tshirt-flatlay-back-seafoam.png', 'hex': '#8DB8A7', 'isHeather': False, 'gamma': 1.17, 'sheen': 0.04 },
    { 'name': 'tshirt-flatlay-back-terracotta.png', 'hex': '#B86851', 'isHeather': False, 'gamma': 1.20, 'sheen': 0.05 },
]

out_dir = 'public/mockups'
os.makedirs(out_dir, exist_ok=True)

def render_tshirt_back(item):
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
        sheen = np.power(np.clip((white_gray_b - 0.85) / 0.15, 0.0, 1.0), 2.0) * sheen_strength
        r_out += sheen
        g_out += sheen
        b_out += sheen

    if item['hex'] == '#FFFFFF':
        r_final = np.uint8(np.clip(master_back_rgb[:, :, 2], 0, 255))
        g_final = np.uint8(np.clip(master_back_rgb[:, :, 1], 0, 255))
        b_final = np.uint8(np.clip(master_back_rgb[:, :, 0], 0, 255))
    else:
        r_final = np.uint8(np.clip(r_out * 255.0, 0, 255))
        g_final = np.uint8(np.clip(g_out * 255.0, 0, 255))
        b_final = np.uint8(np.clip(b_out * 255.0, 0, 255))

    a_final = np.uint8(np.clip(master_back_alpha * 255.0, 0, 255))

    # Senior Engineering Clamp:
    # 1. Zero alpha background is strictly clamped to pure transparent white (255, 255, 255, 0)
    mask_zero = (a_final == 0)
    r_final[mask_zero] = 255
    g_final[mask_zero] = 255
    b_final[mask_zero] = 255

    # 2. Sub-pixel anti-aliased edge pixels retain their true dyed fabric color without artificial pre-blend
    rgba = cv2.merge([b_final, g_final, r_final, a_final])
    return rgba

# Render All Back Palette Blanks
for item in TSHIRT_PALETTE:
    rgba = render_tshirt_back(item)
    out_path = os.path.join(out_dir, item['name'])
    cv2.imwrite(out_path, rgba)
    print(f"Rendered: {item['name']}")

# Overwrite fallback legacy tshirt-flatlay-studio-back.png with the new authentic white back blank
cv2.imwrite(os.path.join(out_dir, 'tshirt-flatlay-studio-back.png'), render_tshirt_back(TSHIRT_PALETTE[0]))
print("Saved public/mockups/tshirt-flatlay-studio-back.png (legacy fallback updated!)")
print("T-Shirt Back Palette build complete!")
