import cv2
import numpy as np

neon = cv2.imread('C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749453864_12bff3aa.png')
# Green channel
g_ch = neon[:, :, 1]
# Blue channel for alpha
b_ch = neon[:, :, 0]

# Sub-pixel smooth alpha matte:
# Where b_ch < 150 -> alpha = 1.0 (255)
# Where b_ch > 245 -> alpha = 0.0 (0)
# In between -> smooth cosine/linear transition
alpha = np.clip((245.0 - b_ch) / (245.0 - 150.0), 0.0, 1.0)
alpha_uint8 = np.uint8(alpha * 255)

# Save green channel with alpha as transparent PNG
g_rgba = cv2.merge([g_ch, g_ch, g_ch, alpha_uint8])
cv2.imwrite('scripts/screenshots/neon_green_shading.png', g_rgba)
print('Saved neon_green_shading.png')
