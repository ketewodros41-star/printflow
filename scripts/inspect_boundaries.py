import cv2
import numpy as np
from PIL import Image

# Load white shirt source image
img = cv2.imread('C:/Users/Davea/.gemini/antigravity/brain/437b513a-73e0-4e4b-92bb-e5583cd97c04/.user_uploaded/media_1791749270517_12f90213.png')
h, w = img.shape[:2]
print(f"Loaded image size: {w}x{h}")

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Look at bottom hem: where is the bottom hem?
# Around y = 803. Below y = 804 is table shadow.
# Let's inspect the row profiles of gray from y = 795 to y = 825 at x = 512 (center)
print("Center hem column y=795..815:")
for y in range(795, 815):
    print(f"y={y}: {gray[y, 512]}")

# Let's inspect inner left arm cavity: x in 180..260, y in 500..650
print("Left cavity profile at y=550:")
for x in range(160, 270, 10):
    print(f"x={x}: {gray[550, x]}")
