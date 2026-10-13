import os
import cv2
import numpy as np
import sys
sys.path.insert(0, ".")
from scripts.build_zip_hoodie_studio_blanks import composite_zipper

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

def build_clean_master_hoodie():
    src_path = "public/mockups/hoodie-flatlay-front-white.png"
    img = cv2.imread(src_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError(f"Could not load {src_path}")
    h, w, _ = img.shape
    bgr = img[:, :, :3].copy()
    
    pts_l = [
        (476, 312), (486, 320), (494, 330), (490, 340), (486, 350), (481, 360),
        (473, 370), (464, 380), (457, 390), (454, 400), (454, 410), (459, 420),
        (459, 430), (469, 440), (484, 450), (487, 460), (489, 470), (488, 480),
        (484, 490), (476, 500), (472, 510), (470, 520)
    ]
    pts_r = [
        (538, 312), (536, 320), (533, 330), (544, 340), (547, 350), (552, 360),
        (560, 370), (567, 380), (574, 390), (578, 400), (580, 410), (579, 420),
        (578, 430), (573, 440), (567, 450), (560, 460), (555, 470), (554, 480),
        (556, 490), (558, 500), (561, 510), (563, 520)
    ]
    
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.polylines(mask, [np.array(pts_l, np.int32).reshape((-1, 1, 2))], False, 255, 18)
    cv2.polylines(mask, [np.array(pts_r, np.int32).reshape((-1, 1, 2))], False, 255, 18)
    cv2.circle(mask, (470, 520), 12, 255, -1)
    cv2.circle(mask, (563, 520), 12, 255, -1)
    
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.dilate(mask, k, iterations=1)
    
    inp = cv2.inpaint(bgr, mask, 5, cv2.INPAINT_TELEA)
    
    # Restore authentic microtexture
    virgin = bgr[420:450, 500:530].astype(np.float32)
    virgin_blur = cv2.GaussianBlur(virgin, (5, 5), 0)
    grain = virgin - virgin_blur
    gh, gw, _ = grain.shape
    tiled_grain = np.tile(grain, (h // gh + 2, w // gw + 2, 1))[:h, :w]
    soft_mask = cv2.GaussianBlur(mask.astype(np.float32) / 255.0, (5, 5), 0)[:, :, None]
    
    # Restore continuous collar seam lines
    cv2.line(inp, (476, 345), (496, 349), (205, 205, 205), 1, cv2.LINE_AA)
    cv2.line(inp, (532, 349), (552, 345), (205, 205, 205), 1, cv2.LINE_AA)
    
    result = np.clip(inp.astype(np.float32) + tiled_grain * soft_mask * 0.95, 0, 255).astype(np.uint8)
    
    clean_master = img.copy()
    clean_master[:, :, :3] = result
    return clean_master

def main():
    out_dir = "public/mockups"
    os.makedirs(out_dir, exist_ok=True)
    
    print("1. Synthesizing clean-chest master pullover hoodie blank...")
    clean_hoodie_white = build_clean_master_hoodie()
    cv2.imwrite(os.path.join(out_dir, "hoodie-flatlay-front-white.png"), clean_hoodie_white)
    cv2.imwrite(os.path.join(out_dir, "hoodie-flatlay-white.png"), clean_hoodie_white)
    print("  -> Saved hoodie-flatlay-front-white.png and hoodie-flatlay-white.png")
    
    print("2. Dyeing all pullover hoodie colorways...")
    for slug, hex_code, target_rgb, b_mult, c_boost in PRODUCTION_PALETTE:
        if slug == "white":
            continue
        dyed = photometrically_dye(clean_hoodie_white, target_rgb, b_mult, c_boost)
        dst = os.path.join(out_dir, f"hoodie-flatlay-front-{slug}.png")
        cv2.imwrite(dst, dyed)
        print(f"  -> Generated pullover: {dst}")
        
    print("3. Generating clean-chest full-zip hoodie blanks (with zipper composite)...")
    for slug, hex_code, target_rgb, b_mult, c_boost in PRODUCTION_PALETTE:
        src_path = os.path.join(out_dir, f"hoodie-flatlay-front-{slug}.png")
        src_img = cv2.imread(src_path, cv2.IMREAD_UNCHANGED)
        zip_img = composite_zipper(src_img)
        dst_path = os.path.join(out_dir, f"hoodie-zip-flatlay-front-{slug}.png")
        cv2.imwrite(dst_path, zip_img)
        print(f"  -> Generated zip hoodie: {dst_path}")
        
    white_zip = cv2.imread(os.path.join(out_dir, "hoodie-zip-flatlay-front-white.png"), cv2.IMREAD_UNCHANGED)
    if white_zip is not None:
        cv2.imwrite(os.path.join(out_dir, "hoodie-zip-flatlay-white.png"), white_zip)
        print("  -> Saved hoodie-zip-flatlay-white.png")
        
    print("=== Complete: All clean-chest studio blanks successfully generated! ===")

if __name__ == "__main__":
    main()
