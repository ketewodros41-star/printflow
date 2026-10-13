import os
import cv2
import numpy as np

def composite_zipper(img):
    """
    Composites a photorealistic metal/nylon coil zipper track onto the hoodie front.
    Includes:
    - Split pocket separation with stitched welt seams
    - Zipper fabric tape with subtle herringbone weave
    - Interlocking metallic teeth (alternating light/shadow)
    - Realistic drop shadows onto fleece body
    - Metallic slider and pull tab near the collar
    """
    h, w, c = img.shape
    out = img.copy().astype(np.float32)
    alpha = img[:, :, 3].astype(np.float32) / 255.0
    
    cx = 512
    y_start = 300
    y_end = 910
    
    # 1. Seam creasing / pocket split shadow
    # Left and right fabric welt shadow where zipper tape is inserted
    for y in range(y_start, y_end):
        if alpha[y, cx] < 0.5:
            continue
        # Subtle inward fabric fold shadow on both sides of the zipper
        for dx in range(-12, 13):
            dist = abs(dx)
            if dist > 3 and dist <= 10:
                shadow_factor = 1.0 - 0.18 * ((10 - dist) / 7.0)
                out[y, cx + dx, :3] *= shadow_factor
            elif dist <= 3:
                # Deep center groove
                out[y, cx + dx, :3] *= 0.65
                
    # 2. Zipper fabric tape (woven polyester binding tape)
    # 8px wide on each side (x = cx-8 to cx+8)
    tape_half = 5
    for y in range(y_start, y_end):
        if alpha[y, cx] < 0.5:
            continue
        # Base tape tone: darker than garment or muted dark grey
        for dx in range(-tape_half, tape_half + 1):
            if abs(dx) > 1:
                # Tape weave texture
                weave = 0.92 if (y + dx) % 4 < 2 else 1.02
                out[y, cx + dx, :3] = out[y, cx + dx, :3] * 0.75 * weave

    # 3. Metallic teeth track
    # Interlocking silver/gunmetal teeth along cx-3 to cx+3, repeating every 4px
    teeth_half = 3
    for y in range(y_start + 10, y_end - 5):
        if alpha[y, cx] < 0.5:
            continue
        tooth_phase = y % 5
        is_tooth = tooth_phase in (1, 2)
        side = 1 if (y // 5) % 2 == 0 else -1
        
        for dx in range(-teeth_half, teeth_half + 1):
            if is_tooth and abs(dx) <= 3:
                # Metallic tooth specular highlight
                if dx == side:
                    # Peak specular shine
                    spec = 230.0
                    out[y, cx + dx, :3] = np.array([spec, spec, spec], dtype=np.float32)
                elif dx == 0:
                    spec = 160.0
                    out[y, cx + dx, :3] = np.array([spec, spec, spec], dtype=np.float32)
                else:
                    spec = 80.0
                    out[y, cx + dx, :3] = np.array([spec, spec, spec], dtype=np.float32)
            elif not is_tooth and abs(dx) <= 2:
                # Space between teeth (dark shadow)
                out[y, cx + dx, :3] = np.array([35.0, 35.0, 35.0], dtype=np.float32)

    # 4. Top Stop & Metal Slider + Pull Tab (positioned around y = 330..370)
    sy = 335
    # Slider body (width 12, height 18)
    slider_w = 6
    slider_h = 16
    for y in range(sy, sy + slider_h):
        for dx in range(-slider_w, slider_w + 1):
            # Beveled metallic slider
            u = (dx + slider_w) / (2.0 * slider_w)
            v = (y - sy) / float(slider_h)
            # Metallic reflection gradient
            val = 200.0 + 50.0 * np.sin(u * np.pi * 2.0) - 40.0 * v
            out[y, cx + dx, :3] = np.clip(val, 40.0, 255.0)

    # Pull tab hanging down (width 8, height 26)
    py = sy + slider_h
    pull_w = 4
    pull_h = 24
    for y in range(py, py + pull_h):
        for dx in range(-pull_w, pull_w + 1):
            # Tapered pull tab
            taper = 1.0 if (y - py) < 18 else (pull_h - (y - py)) / 6.0
            if abs(dx) <= int(pull_w * taper):
                # Metallic brushed steel finish with center cutout
                if abs(dx) <= 1 and (y - py) in range(10, 16):
                    # Cutout hole in pull tab
                    out[y, cx + dx, :3] = np.array([45.0, 45.0, 45.0], dtype=np.float32)
                else:
                    shine = 180.0 + 40.0 * np.cos(dx * 1.2)
                    out[y, cx + dx, :3] = np.clip(shine, 50.0, 245.0)
                    
    # Ambient cast shadow from slider and pull tab onto right garment body
    for y in range(sy + 4, py + pull_h + 4):
        for dx in range(slider_w + 1, slider_w + 5):
            out[y, cx + dx, :3] *= 0.68

    out = np.clip(out, 0, 255).astype(np.uint8)
    out[:, :, 3] = img[:, :, 3]
    return out

def main():
    mockup_dir = "public/mockups"
    color_slugs = [
        "white", "black", "navy", "heather-grey", "red", "forest-green",
        "olive", "sage", "pepper", "chambray", "seafoam", "terracotta"
    ]
    
    print("Building Photorealistic Full-Zip Hoodie Studio Blanks...")
    for slug in color_slugs:
        src_path = os.path.join(mockup_dir, f"hoodie-flatlay-front-{slug}.png")
        if not os.path.exists(src_path):
            continue
        img = cv2.imread(src_path, cv2.IMREAD_UNCHANGED)
        if img is None:
            continue
        zip_img = composite_zipper(img)
        dst_path = os.path.join(mockup_dir, f"hoodie-zip-flatlay-front-{slug}.png")
        cv2.imwrite(dst_path, zip_img)
        print(f"  -> Generated {dst_path}")
        
    # Also save standard default
    white_zip = cv2.imread(os.path.join(mockup_dir, "hoodie-zip-flatlay-front-white.png"), cv2.IMREAD_UNCHANGED)
    if white_zip is not None:
        cv2.imwrite(os.path.join(mockup_dir, "hoodie-zip-flatlay-white.png"), white_zip)

if __name__ == "__main__":
    main()
