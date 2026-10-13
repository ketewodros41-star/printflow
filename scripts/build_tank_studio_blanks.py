import os
import cv2
import numpy as np

def extract_chroma_blank(jpg_path):
    img = cv2.imread(jpg_path)
    if img is None:
        raise ValueError(f"Could not load {jpg_path}")
    h, w = img.shape[:2]
    
    b = img[:, :, 0].astype(np.float32)
    g = img[:, :, 1].astype(np.float32)
    r = img[:, :, 2].astype(np.float32)
    
    max_rb = np.maximum(r, b)
    greenness = g - max_rb
    
    # Chroma key threshold
    low_thresh = 18.0
    high_thresh = 50.0
    alpha = np.clip(1.0 - (greenness - low_thresh) / (high_thresh - low_thresh), 0.0, 1.0)
    
    # Boundary clean: corners strictly 0
    alpha[:10, :] = 0.0
    alpha[-10:, :] = 0.0
    alpha[:, :10] = 0.0
    alpha[:, -10:] = 0.0
    
    # Despill: neutralise any residual green bounce along garment boundary
    despill_mask = (alpha > 0.0) & (alpha < 1.0) & (greenness > 0.0)
    g[despill_mask] = max_rb[despill_mask]
    
    interior_tint = (alpha > 0.9) & (greenness > 12.0)
    g[interior_tint] = np.clip(g[interior_tint] - greenness[interior_tint]*0.8, 0, 255)
    
    out = np.zeros((h, w, 4), dtype=np.uint8)
    out[:, :, 0] = np.clip(b, 0, 255).astype(np.uint8)
    out[:, :, 1] = np.clip(g, 0, 255).astype(np.uint8)
    out[:, :, 2] = np.clip(r, 0, 255).astype(np.uint8)
    out[:, :, 3] = np.clip(alpha * 255.0, 0, 255).astype(np.uint8)
    
    zero_mask = out[:, :, 3] < 2
    out[zero_mask, 0] = 255
    out[zero_mask, 1] = 255
    out[zero_mask, 2] = 255
    out[zero_mask, 3] = 0
    return out

PRODUCTION_PALETTE = [
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
    ("mauve", "#B87B7B", (184, 123, 123), 1.0, 1.12),
    ("military-green", "#4A5240", (74, 82, 64), 1.0, 1.18),
    ("dark-grey-heather", "#4A4A48", (74, 74, 72), 1.0, 1.22),
]

def photometrically_dye(base_rgba, target_rgb, brightness_mult=1.0, contrast_boost=1.0):
    arr = base_rgba.astype(np.float32)
    bgr = arr[:, :, :3]
    alpha = arr[:, :, 3]
    
    lum = (0.114 * bgr[:, :, 0] + 0.587 * bgr[:, :, 1] + 0.299 * bgr[:, :, 2]) / 255.0
    S = np.clip(lum / 0.92, 0.04, 1.25)
    S_curved = np.power(S, contrast_boost)
    
    target_r, target_g, target_b = target_rgb
    dyed_b = S_curved * target_b * brightness_mult
    dyed_g = S_curved * target_g * brightness_mult
    dyed_r = S_curved * target_r * brightness_mult
    
    specular = np.power(np.clip((lum - 0.84) / 0.16, 0.0, 1.0), 2.0) * 16.0
    dyed_b += specular
    dyed_g += specular
    dyed_r += specular
    
    out = np.zeros_like(arr, dtype=np.uint8)
    out[:, :, 0] = np.clip(dyed_b, 0, 255).astype(np.uint8)
    out[:, :, 1] = np.clip(dyed_g, 0, 255).astype(np.uint8)
    out[:, :, 2] = np.clip(dyed_r, 0, 255).astype(np.uint8)
    out[:, :, 3] = alpha.astype(np.uint8)
    
    zero_mask = out[:, :, 3] < 2
    out[zero_mask, :3] = 255
    out[zero_mask, 3] = 0
    return out

def main():
    front_src = r"C:\Users\Davea\.gemini\antigravity\brain\9015c630-3b8c-411c-8ee8-77bd6d7f8b45\studio_tank_top_1791902662668.jpg"
    back_src = r"C:\Users\Davea\.gemini\antigravity\brain\9015c630-3b8c-411c-8ee8-77bd6d7f8b45\studio_tank_back_1791902700359.jpg"
    out_dir = "public/mockups"
    
    print("Extracting tank blanks...")
    tank_front_white = extract_chroma_blank(front_src)
    tank_back_white = extract_chroma_blank(back_src)
    
    cv2.imwrite(os.path.join(out_dir, "tank-flatlay-white.png"), tank_front_white)
    cv2.imwrite(os.path.join(out_dir, "tank-flatlay-back-white.png"), tank_back_white)
    cv2.imwrite(os.path.join(out_dir, "tank-flatlay-front-white.png"), tank_front_white)
    cv2.imwrite(os.path.join(out_dir, "tank-flatlay-back-white.png"), tank_back_white)
    print("Saved white tank blanks.")
    
    for slug, hex_code, target_rgb, b_mult, c_boost in PRODUCTION_PALETTE:
        if slug == "white":
            continue
        dyed_f = photometrically_dye(tank_front_white, target_rgb, b_mult, c_boost)
        dyed_b = photometrically_dye(tank_back_white, target_rgb, b_mult, c_boost)
        cv2.imwrite(os.path.join(out_dir, f"tank-flatlay-front-{slug}.png"), dyed_f)
        cv2.imwrite(os.path.join(out_dir, f"tank-flatlay-back-{slug}.png"), dyed_b)
        print(f"  -> Generated tank {slug}")

    print("Tank palette generated successfully!")

if __name__ == "__main__":
    main()
