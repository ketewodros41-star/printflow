import cv2
import numpy as np
import os

print("Building Master Studio Palette for Long Sleeve Tee (Front & Back)...")

# 1. Source image paths
neon_path = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749453864_12bff3aa.png'
white_path = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749270517_12f90213.png'
back_path = 'C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791825485756_c7d015f2.png'

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
alpha_n[780:, :] = 0.0

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
master_alpha_front[800:, :] = 0.0
master_alpha_front = cv2.GaussianBlur(master_alpha_front, (3, 3), 0.4)
master_alpha_front[master_alpha_front < 0.02] = 0.0

white_gray_f = cv2.cvtColor(white, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
S_front = np.clip(white_gray_f / 0.94, 0.04, 1.20)

# ═══════════════════════════════════════════════════════════════════════════
# 3. Extract mathematically pristine sub-pixel alpha mask for BACK
#    Directly from authentic photographic back image media_1791825485756_c7d015f2.png
# ═══════════════════════════════════════════════════════════════════════════
diff_b = np.max(255 - im_back.astype(np.int32), axis=2).astype(np.float32)

# Floor shadow cutoff: cuffs end at y=660, hem ends at y=779
diff_clean_b = diff_b.copy()
diff_clean_b[661:, :220] = 0.0
diff_clean_b[661:, 800:] = 0.0
diff_clean_b[779:, :] = 0.0
diff_clean_b[:38, :] = 0.0
diff_clean_b[:, :12] = 0.0
diff_clean_b[:, 1012:] = 0.0

# Solid fabric binary map with threshold 4.0
fabric_bin_b = (diff_clean_b >= 4.0).astype(np.uint8)

# Connected background flood fill from outer borders (preserves open underarm cavities!)
flood_mask_b = np.zeros((h_b + 2, w_b + 2), np.uint8)
flood_img_b = fabric_bin_b.copy()
cv2.floodFill(flood_img_b, flood_mask_b, (0, 0), 2)
cv2.floodFill(flood_img_b, flood_mask_b, (w_b - 1, 0), 2)
cv2.floodFill(flood_img_b, flood_mask_b, (0, h_b - 1), 2)
cv2.floodFill(flood_img_b, flood_mask_b, (w_b - 1, h_b - 1), 2)

bg_connected_b = (flood_img_b == 2)
garment_mask_b = (~bg_connected_b).astype(np.uint8)

# Morphological clean
kernel9 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
garment_clean_b = cv2.morphologyEx(garment_mask_b, cv2.MORPH_CLOSE, kernel9)

# Extract largest garment contour & smooth with 1D Gaussian kernel (k_size=21, sigma=4.0)
contours_b, _ = cv2.findContours(garment_clean_b, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
c_max_b = max(contours_b, key=cv2.contourArea)

pts_b = c_max_b.reshape(-1, 2).astype(np.float32)
k_size = 21
pad = k_size // 2
pts_padded_b = np.vstack([pts_b[-pad:], pts_b, pts_b[:pad]])
kernel_1d = cv2.getGaussianKernel(k_size, 4.0).flatten()
smoothed_pts_b = np.zeros_like(pts_b)
for i in range(2):
    smoothed_pts_b[:, i] = np.convolve(pts_padded_b[:, i], kernel_1d, mode='valid')

smoothed_contour_b = smoothed_pts_b.reshape(-1, 1, 2).astype(np.int32)

smooth_mask_b = np.zeros((h_b, w_b), dtype=np.uint8)
cv2.drawContours(smooth_mask_b, [smoothed_contour_b], -1, 1, thickness=cv2.FILLED)

# Signed distance field for sub-pixel anti-aliased edge
dist_in_b = cv2.distanceTransform(smooth_mask_b, cv2.DIST_L2, 5)
dist_out_b = cv2.distanceTransform(1 - smooth_mask_b, cv2.DIST_L2, 5)
sdf_b = dist_in_b - dist_out_b

raw_alpha_b = np.clip(sdf_b / 1.0 + 0.5, 0.0, 1.0).astype(np.float32)

# Garment bounding box for scaling
x_min_b, y_min_b, w_box_b, h_box_b = cv2.boundingRect(smoothed_contour_b)

# Scale & Align to Master 1024 x 953 Canvas
scale_b = 929.0 / float(w_box_b)
scaled_w_b = int(round(w_b * scale_b))
scaled_h_b = int(round(h_b * scale_b))

im_b_scaled = cv2.resize(im_back, (scaled_w_b, scaled_h_b), interpolation=cv2.INTER_LANCZOS4)
alpha_b_scaled = cv2.resize(raw_alpha_b, (scaled_w_b, scaled_h_b), interpolation=cv2.INTER_LANCZOS4)

center_x_b_scaled = (x_min_b + w_box_b / 2.0) * scale_b
offset_x_b = int(round(512.0 - center_x_b_scaled))
offset_y_b = int(round(114.0 - y_min_b * scale_b))

master_back_rgb = np.full((h_w, w_w, 3), 255, dtype=np.uint8)
master_back_alpha = np.zeros((h_w, w_w), dtype=np.float32)

src_bx1 = max(0, -offset_x_b)
src_bx2 = min(scaled_w_b, w_w - offset_x_b)
dst_bx1 = max(0, offset_x_b)
dst_bx2 = dst_bx1 + (src_bx2 - src_bx1)

src_by1 = max(0, -offset_y_b)
src_by2 = min(scaled_h_b, h_w - offset_y_b)
dst_by1 = max(0, offset_y_b)
dst_by2 = dst_by1 + (src_by2 - src_by1)

master_back_rgb[dst_by1:dst_by2, dst_bx1:dst_bx2] = im_b_scaled[src_by1:src_by2, src_bx1:src_bx2]
master_back_alpha[dst_by1:dst_by2, dst_bx1:dst_bx2] = alpha_b_scaled[src_by1:src_by2, src_bx1:src_bx2]

# Clean borders
master_back_alpha[master_back_alpha < 0.03] = 0.0
master_back_alpha[:100, :] = 0.0
master_back_alpha[802:, :] = 0.0
master_back_alpha[:, :40] = 0.0
master_back_alpha[:, 984:] = 0.0

master_back_alpha = cv2.GaussianBlur(master_back_alpha, (3, 3), 0.4)
master_back_alpha[master_back_alpha < 0.02] = 0.0

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
    alpha_map = master_back_alpha if is_back else master_alpha_front
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

    # Senior Engineering Clamp:
    # 1. Zero alpha -> pure transparent white (255, 255, 255, 0)
    mask_zero = (a_final == 0)
    r_final[mask_zero] = 255
    g_final[mask_zero] = 255
    b_final[mask_zero] = 255

    # 2. Semi-transparent boundary blend with pure white:
    # Eliminates any edge fringe or color overflow when anti-aliasing against white canvas
    mask_semi = (a_final > 0) & (a_final < 255)
    w_frac = 1.0 - (a_final[mask_semi].astype(np.float32) / 255.0)
    r_final[mask_semi] = np.uint8(np.clip(r_final[mask_semi].astype(np.float32) + w_frac * (255.0 - r_final[mask_semi].astype(np.float32)), 0, 255))
    g_final[mask_semi] = np.uint8(np.clip(g_final[mask_semi].astype(np.float32) + w_frac * (255.0 - g_final[mask_semi].astype(np.float32)), 0, 255))
    b_final[mask_semi] = np.uint8(np.clip(b_final[mask_semi].astype(np.float32) + w_frac * (255.0 - b_final[mask_semi].astype(np.float32)), 0, 255))

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
