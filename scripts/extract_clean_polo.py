import cv2
import numpy as np

def extract_clean_garment():
    src_path = r'C:\Users\Davea\.gemini\antigravity\brain\437b513a-73e0-4e4b-92bb-e5583cd97c04\.user_uploaded\media_1791840023952_af1d8f5a.png'
    img = cv2.imread(src_path, cv2.IMREAD_COLOR)
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Threshold where garment fabric is present.
    # Fabric pixels are <= 236 in this white polo, while floor shadow is 238..254 and background is 255.
    fabric_bin = (gray <= 236).astype(np.uint8) * 255
    
    # Clean up small noise with morphological close
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    closed = cv2.morphologyEx(fabric_bin, cv2.MORPH_CLOSE, kernel)
    
    # Find largest contour
    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    largest = max(contours, key=cv2.contourArea)
    
    garment_mask = np.zeros((h, w), np.uint8)
    cv2.drawContours(garment_mask, [largest], -1, 255, thickness=cv2.FILLED)
    
    # Smooth edges with slight Gaussian blur (sigma=0.6)
    alpha = cv2.GaussianBlur(garment_mask, (5, 5), 0.6)
    
    # Output RGBA garment
    garment_rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    garment_rgba[:, :, 3] = alpha
    garment_rgba[garment_mask == 0, :3] = 255
    garment_rgba[garment_mask == 0, 3] = 0
    
    cv2.imwrite('scripts/polo_front_clean.png', garment_rgba)
    print('Clean garment saved to scripts/polo_front_clean.png')
    
    # Also extract the floor shadow as a separate layer
    # Shadow is where gray < 255 and outside the garment
    shadow_mask = np.zeros((h, w), np.uint8)
    shadow_val = np.clip((255 - gray) * 1.5, 0, 255).astype(np.uint8)
    shadow_mask[garment_mask == 0] = shadow_val[garment_mask == 0]
    
    shadow_rgba = np.zeros((h, w, 4), np.uint8)
    shadow_rgba[:, :, :3] = 0 # black shadow
    shadow_rgba[:, :, 3] = shadow_mask
    cv2.imwrite('scripts/polo_shadow.png', shadow_rgba)
    print('Floor shadow saved to scripts/polo_shadow.png')

extract_clean_garment()
