import cv2
import numpy as np

neon = cv2.imread('C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749453864_12bff3aa.png')
h_n, w_n = neon.shape[:2]

# Extract green channel and smooth alpha
g_ch = neon[:, :, 1]
b_ch = neon[:, :, 0]

# Sub-pixel smooth alpha matte:
# Where b_ch < 150 -> alpha = 1.0 (255)
# Where b_ch > 245 -> alpha = 0.0 (0)
# In between -> smooth cosine/linear transition
alpha = np.clip((245.0 - b_ch) / (245.0 - 150.0), 0.0, 1.0)
alpha_uint8 = np.uint8(alpha * 255)

# Place inside 1024x953 canvas matching the coordinate space of the app
# Let's find vertical shift so collar matches y ~ 116
# In neon, collar is at y = 68. In app, collar was at y = 116.
# If we scale by 1.045:
# width becomes: round(1024 * 1.045) = 1070.
# Wait, let's see: what if we just shift y by 48 pixels?
# 68 + 48 = 116!
# Hem was at 727. 727 + 48 = 775.
# Let's check with scale=1.05 and shift:
scaled_w = int(w_n * 1.045)
scaled_h = int(h_n * 1.045)
g_scaled = cv2.resize(g_ch, (scaled_w, scaled_h), interpolation=cv2.INTER_LANCZOS4)
a_scaled = cv2.resize(alpha_uint8, (scaled_w, scaled_h), interpolation=cv2.INTER_LANCZOS4)

# Create 1024x953 canvas
target_canvas = np.zeros((953, 1024), dtype=np.uint8)
target_alpha = np.zeros((953, 1024), dtype=np.uint8)

# Center horizontally:
offset_x = (1024 - scaled_w) // 2
offset_y = 52 # collar will be at 68 * 1.045 + 52 = 123, hem at 727 * 1.045 + 52 = 811

# Crop/paste within bounds
src_x1 = max(0, -offset_x)
src_x2 = min(scaled_w, 1024 - offset_x)
dst_x1 = max(0, offset_x)
dst_x2 = dst_x1 + (src_x2 - src_x1)

src_y1 = max(0, -offset_y)
src_y2 = min(scaled_h, 953 - offset_y)
dst_y1 = max(0, offset_y)
dst_y2 = dst_y1 + (src_y2 - src_y1)

target_canvas[dst_y1:dst_y2, dst_x1:dst_x2] = g_scaled[src_y1:src_y2, src_x1:src_x2]
target_alpha[dst_y1:dst_y2, dst_x1:dst_x2] = a_scaled[src_y1:src_y2, src_x1:src_x2]

# Save aligned pristine white blank
rgba = cv2.merge([target_canvas, target_canvas, target_canvas, target_alpha])
cv2.imwrite('scripts/screenshots/aligned_pristine_white.png', rgba)

ys, xs = np.where(target_alpha > 20)
print(f"Aligned bounds: x: {xs.min()}..{xs.max()}, y: {ys.min()}..{ys.max()}")
