import cv2
import numpy as np
from PIL import Image

def build_polo_back():
    front = cv2.imread('scripts/polo_front_clean.png', cv2.IMREAD_UNCHANGED)
    h, w = front.shape[:2]
    
    # Work on RGB
    bgr = front[:, :, :3].copy()
    alpha = front[:, :, 3].copy()
    
    # 1. Seamlessly inpaint/remove front placket, buttons, and downward collar points
    # Region around center chest/neck: x in [380, 574], y in [130, 420]
    chest_mask = np.zeros((h, w), np.uint8)
    
    # Collar downward points and placket
    # Downward points: left point around (460, 245), right point around (530, 245)
    cv2.rectangle(chest_mask, (400, 160), (550, 420), 255, -1)
    # Downward collar flaps
    pts_collar_flaps = np.array([[380, 140], [470, 250], [540, 240], [580, 140], [477, 180]], np.int32)
    cv2.fillPoly(chest_mask, [pts_collar_flaps], 255)
    
    # Inpaint with generous radius using TELEA
    inpaited = cv2.inpaint(bgr, chest_mask, 15, cv2.INPAINT_TELEA)
    
    # 2. Back Collar Roll (the folded collar that wraps around the neck)
    # It forms a high, smooth curve at the top:
    # Outer top arch: already in front image at y in [53, 90]
    # Lower edge of back collar: a gentle concave curve from (370, 130) to (477, 155) to (580, 130)
    # Fill inside the collar band with authentic pique collar texture
    collar_mask = np.zeros((h, w), np.uint8)
    collar_contour = []
    # Top arch from front
    for x in range(370, 581):
        # find top alpha edge
        col = np.where(alpha[:, x] > 128)[0]
        if len(col) > 0:
            collar_contour.append((x, col[0]))
    # Bottom curve of the folded collar
    for x in range(580, 369, -1):
        y_bot = int(125 + 20 * np.cos((x - 477) / 110.0 * np.pi / 2.0))
        collar_contour.append((x, y_bot))
        
    pts = np.array(collar_contour, np.int32)
    cv2.fillPoly(collar_mask, [pts], 255)
    
    # Texture the collar band: soft vertical ribbing and natural lighting
    collar_tone = np.median(front[60:110, 370:420, :3], axis=(0, 1))
    collar_layer = inpaited.copy()
    for y in range(50, 160):
        for x in range(360, 590):
            if collar_mask[y, x] > 0:
                knit = 1.8 * np.cos(x * 1.5)
                grad = ((y - 53) / 90.0) * 8.0
                collar_layer[y, x] = np.clip(collar_tone + knit - grad + 4, 0, 255).astype(np.uint8)
    
    # Soft blend collar layer via blurred mask
    soft_collar_mask = cv2.GaussianBlur(collar_mask, (5, 5), 1.2).astype(np.float32) / 255.0
    for c in range(3):
        inpaited[:, :, c] = np.clip(
            inpaited[:, :, c] * (1.0 - soft_collar_mask) + collar_layer[:, :, c] * soft_collar_mask,
            0, 255
        ).astype(np.uint8)

    # 3. Add soft shadow under the back collar onto the back yoke
    for y in range(120, 165):
        for x in range(365, 585):
            y_seam = int(125 + 20 * np.cos((x - 477) / 110.0 * np.pi / 2.0))
            if y >= y_seam and y < y_seam + 14:
                dist = (y - y_seam) / 14.0
                shadow_factor = 1.0 - (1.0 - dist) * 0.12
                inpaited[y, x] = np.clip(inpaited[y, x].astype(np.float32) * shadow_factor, 0, 255).astype(np.uint8)

    # 4. Subtle back yoke horizontal seam
    yoke_pts = []
    for x in range(270, 685):
        y_yoke = int(220 + 10 * np.cos((x - 477) / 210.0 * np.pi / 2.0))
        yoke_pts.append((x, y_yoke))
    for i in range(len(yoke_pts) - 1):
        cv2.line(inpaited, yoke_pts[i], yoke_pts[i+1], (200, 200, 200), 1, cv2.LINE_AA)
        
    # Reassemble with identical alpha (zero silhouette jump!)
    out = np.zeros((h, w, 4), np.uint8)
    out[:, :, :3] = inpaited
    out[:, :, 3] = alpha
    
    # 0px bleed clamp
    out[alpha == 0, :3] = 255
    out[alpha == 0, 3] = 0
    
    cv2.imwrite('scripts/polo_back_clean.png', out)
    print('Enhanced polo back saved to scripts/polo_back_clean.png')

build_polo_back()
