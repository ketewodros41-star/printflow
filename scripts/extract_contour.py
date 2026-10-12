import cv2
import numpy as np

img = cv2.imread('C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749270517_12f90213.png')
h, w = img.shape[:2]
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# In the white shirt, the table background is (255, 255, 255).
# The table shadow is 245-253.
# The garment body is 200-244, with subtle highlights near 246-248.
# If we look at threshold at 246:
thresh = (gray < 246).astype(np.uint8) * 255

# Apply morphological closing to bridge any micro-gaps, then find the largest connected component
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

# Find contours
contours, hierarchy = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
# Find the largest contour (the garment)
largest_contour = max(contours, key=cv2.contourArea)

# Create a clean mask from this contour
contour_mask = np.zeros((h, w), dtype=np.uint8)
cv2.drawContours(contour_mask, [largest_contour], -1, 255, thickness=cv2.FILLED)

# Check inner sleeve cavities: are they properly hollowed out?
# Find contours with RETR_CCOMP or RETR_TREE
contours_tree, hier = cv2.findContours(closed, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
print(f"Largest contour area: {cv2.contourArea(largest_contour)}")

cv2.imwrite('scripts/screenshots/contour_mask.png', contour_mask)
print('Saved contour_mask.png')
