import cv2
import numpy as np

# Load neon shirt for pristine mask
neon = cv2.imread('C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749453864_12bff3aa.png')
# Load white shirt for original combed-cotton textile texture
white = cv2.imread('C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749270517_12f90213.png')

h_w, w_w = white.shape[:2] # 953 x 1024
h_n, w_n = neon.shape[:2]  # 825 x 1024

# Extract pristine mask from neon:
# Background is pure white (R > 250, G > 250, B > 250)
# Garment is saturated neon yellow (B < 150)
b_ch = neon[:, :, 0].astype(np.float32)
# Smooth anti-aliased alpha
alpha_n = np.clip((248.0 - b_ch) / (248.0 - 160.0), 0.0, 1.0)

# Real garment bounds in neon
ys, xs = np.where(alpha_n > 0.05)
min_x, max_x = xs.min(), xs.max()
min_y, max_y = ys.min(), ys.max()
w_garment = max_x - min_x # 891
h_garment = max_y - min_y # 657
center_x_n = (min_x + max_x) / 2.0

# In white shirt, garment bounds:
# minX: 49, maxX: 978 (w: 929), minY: 116, maxY: 805 (h: 689), center_x: 513.5
scale = 929.0 / w_garment # ~ 1.0426

# Scale alpha mask
scaled_w = int(round(w_n * scale))
scaled_h = int(round(h_n * scale))
alpha_scaled = cv2.resize(alpha_n, (scaled_w, scaled_h), interpolation=cv2.INTER_LANCZOS4)

# Create 1024x953 master alpha
master_alpha = np.zeros((h_w, w_w), dtype=np.float32)

# Shift to align center_x to 513.5 and collar top to y = 116
scaled_center_x = center_x_n * scale
offset_x = int(round(513.5 - scaled_center_x))
offset_y = int(round(116.0 - min_y * scale))

# Blit into master_alpha
src_x1 = max(0, -offset_x)
src_x2 = min(scaled_w, w_w - offset_x)
dst_x1 = max(0, offset_x)
dst_x2 = dst_x1 + (src_x2 - src_x1)

src_y1 = max(0, -offset_y)
src_y2 = min(scaled_h, h_w - offset_y)
dst_y1 = max(0, offset_y)
dst_y2 = dst_y1 + (src_y2 - src_y1)

master_alpha[dst_y1:dst_y2, dst_x1:dst_x2] = alpha_scaled[src_y1:src_y2, src_x1:src_x2]

# Ensure zero stray pixels outside garment
# Anything with alpha < 0.02 is 0
master_alpha[master_alpha < 0.02] = 0.0
# Apply a subtle 3x3 gaussian blur only to the sub-pixel boundary for smooth anti-aliased edge
master_alpha = cv2.GaussianBlur(master_alpha, (3, 3), 0.5)

print(f"Master Alpha created: shape {master_alpha.shape}, max={master_alpha.max()}")

# Now create photorealistic textile shading:
# Use white shirt texture:
white_gray = cv2.cvtColor(white, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0

# Calibrate reference white point
L_ref = 0.94
# Normalized shading factor with high contrast preservation
S = white_gray / L_ref

# Test Maroon (#5C1D24)
rDye, gDye, bDye = int('5C', 16) / 255.0, int('1D', 16) / 255.0, int('24', 16) / 255.0

# Physically accurate dye reflectance:
# Folds stay deeply saturated and rich
# Highlights catch soft diffuse cloth sheen
contrast_gamma = 1.35
S_contrast = np.power(np.clip(S, 0.05, 1.15), contrast_gamma)

rOut = rDye * S_contrast
gOut = gDye * S_contrast
bOut = bDye * S_contrast

# Cotton highlight sheen
sheen = np.power(np.clip((white_gray - 0.85) / 0.15, 0.0, 1.0), 2.0) * 0.08
rOut += sheen
gOut += sheen
bOut += sheen

rFinal = np.uint8(np.clip(rOut * 255.0, 0, 255))
gFinal = np.uint8(np.clip(gOut * 255.0, 0, 255))
bFinal = np.uint8(np.clip(bOut * 255.0, 0, 255))
aFinal = np.uint8(np.clip(master_alpha * 255.0, 0, 255))

maroon_rgba = cv2.merge([bFinal, gFinal, rFinal, aFinal]) # BGR + A in OpenCV
cv2.imwrite('scripts/screenshots/test_perfect_maroon.png', maroon_rgba)
print("Saved scripts/screenshots/test_perfect_maroon.png")
