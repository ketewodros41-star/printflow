import cv2
import numpy as np

img = cv2.imread('C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749270517_12f90213.png')
h, w = img.shape[:2]

# Initialize mask with cv2.GC_PR_BGD
mask = np.full((h, w), cv2.GC_PR_BGD, dtype=np.uint8)

# Definite Background: outer margins and table floor
mask[0:110, :] = cv2.GC_BGD
mask[804:h, :] = cv2.GC_BGD
mask[:, 0:45] = cv2.GC_BGD
mask[:, 980:w] = cv2.GC_BGD

# Definite Background in sleeve cavities
mask[480:660, 215:255] = cv2.GC_BGD
mask[480:660, 770:810] = cv2.GC_BGD

# Floor below cuffs
mask[696:h, 0:260] = cv2.GC_BGD
mask[696:h, 765:w] = cv2.GC_BGD

# Probable foreground: anything between cuffs and collar
mask[115:804, 45:980] = cv2.GC_PR_FGD

# Definite Foreground: core chest and torso
mask[200:750, 310:715] = cv2.GC_FGD
# Forearms
mask[250:650, 80:200] = cv2.GC_PR_FGD
mask[250:650, 825:945] = cv2.GC_PR_FGD

# Run GrabCut
bgdModel = np.zeros((1, 65), np.float64)
fgdModel = np.zeros((1, 65), np.float64)

print("Running GrabCut...")
cv2.grabCut(img, mask, None, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_MASK)

# Extract binary mask: 1 where foreground, 0 where background
bin_mask = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype('uint8')

# Save binary mask for inspection
cv2.imwrite('scripts/screenshots/grabcut_mask.png', bin_mask)
print("Saved scripts/screenshots/grabcut_mask.png")
