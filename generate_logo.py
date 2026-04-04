import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import random
from scipy.ndimage import gaussian_filter

def create_thermal_background(width, height):
    # Grayscale base layer
    bg = np.zeros((height, width), dtype=np.uint8)
    
    # 1. Base organic noise
    noise = (np.random.rand(height, width) * 50).astype(np.uint8)
    bg = cv2.add(bg, noise)
    
    # 2. Central Human Figure(s)
    # Drawing multiple soft ovals for head/body
    cx, cy = width // 2, height // 2
    # Torso
    cv2.ellipse(bg, (cx, cy + 50), (120, 250), 0, 0, 360, 180, -1)
    # Head
    cv2.circle(bg, (cx, cy - 220), 80, 220, -1)
    # Arms
    cv2.ellipse(bg, (cx - 150, cy + 50), (60, 200), 20, 0, 360, 150, -1)
    cv2.ellipse(bg, (cx + 150, cy + 50), (60, 200), -20, 0, 360, 150, -1)
    
    # Blur to create heat dissipation
    bg = cv2.GaussianBlur(bg, (151, 151), 0)
    
    # 3. Add random heat "blobs"
    for _ in range(10):
        bx, by = random.randint(0, width), random.randint(0, height)
        br = random.randint(50, 200)
        cv2.circle(bg, (bx, by), br, random.randint(100, 255), -1)
    
    bg = cv2.GaussianBlur(bg, (201, 201), 0)
    
    # Apply Colormap (JET or MAGMA-like via OpenCV)
    # cv2.COLORMAP_JET is common for thermal
    thermal_bgr = cv2.applyColorMap(bg, cv2.COLORMAP_JET)
    thermal_rgb = cv2.cvtColor(thermal_bgr, cv2.COLOR_BGR2RGB)
    
    return Image.fromarray(thermal_rgb)

def generate_logo_v4():
    width, height = 1024, 1024
    bg_img = create_thermal_background(width, height)
    
    # Monolith layer (the black mass)
    monolith = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    d = ImageDraw.Draw(monolith)
    
    # Symmetrical helper
    def draw_mirrored_poly(points, fill):
        d.polygon(points, fill=fill)
        m_points = [(width - x, y) for x, y in points]
        d.polygon(m_points, fill=fill)
        
    def draw_mirrored_circle(pos, r, fill):
        cx, cy = pos
        d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=fill)
        d.ellipse([width-cx-r, cy-r, width-cx+r, cy-r+2*r], fill=fill)

    # 1. Text (diedfavorite) - Center
    try:
        font = ImageFont.truetype("C:\\Windows\\Fonts\\OLDENGL.TTF", 180)
    except:
        font = ImageFont.load_default()
        
    text = "diedfavorite"
    left, top, right, bottom = d.textbbox((0, 0), text, font=font)
    tw, th = right - left, bottom - top
    tx, ty = (width - tw) // 2, (height - th) // 2
    
    # Base text (Black)
    d.text((tx, ty), text, fill="black", font=font)
    
    # 2. Symbols
    # Hexagrams (top and bottom)
    def draw_hex(center, size):
        cx, cy = center
        h = size * 0.866
        # Downward Triangle (Satanic/Metal style)
        tri1 = [(cx, cy + size), (cx - h, cy - size/2), (cx + h, cy - size/2)]
        tri2 = [(cx, cy - size), (cx - h, cy + size/2), (cx + h, cy + size/2)]
        d.polygon(tri1, fill="black")
        d.polygon(tri2, fill="black")
        
    draw_hex((width//2, ty - 120), 100) # Main Top
    draw_hex((width//2, ty + th + 150), 120) # Main Bottom
    
    # 2.5 "Crazy" elements (added 20+ symbols symmetrically)
    for _ in range(12): # 12 pairs = 24 elements
        sx = random.randint(100, width//2 - 50)
        sy = random.randint(ty - 200, ty + th + 250)
        stype = random.choice(["hex", "cross", "inv_cross", "spike"])
        s_size = random.randint(20, 50)
        
        if stype == "hex":
            # Draw on left
            h = s_size * 0.866
            d.polygon([(sx, sy+s_size), (sx-h, sy-s_size/2), (sx+h, sy-s_size/2)], fill="black")
            d.polygon([(sx, sy-s_size), (sx-h, sy+s_size/2), (sx+h, sy+s_size/2)], fill="black")
            # Mirror to right
            mx = width - sx
            d.polygon([(mx, sy+s_size), (mx-h, sy-s_size/2), (mx+h, sy-s_size/2)], fill="black")
            d.polygon([(mx, sy-s_size), (mx-h, sy+s_size/2), (mx+h, sy+s_size/2)], fill="black")
        elif stype == "cross":
            d.rectangle([sx-2, sy-s_size, sx+2, sy+s_size], fill="black")
            d.rectangle([sx-s_size, sy-2, sx+s_size, sy+2], fill="black")
            mx = width - sx
            d.rectangle([mx-2, sy-s_size, mx+2, sy+s_size], fill="black")
            d.rectangle([mx-s_size, sy-2, mx+s_size, sy+2], fill="black")
        elif stype == "inv_cross":
            # Inverted cross (longer bottom part)
            d.rectangle([sx-2, sy-s_size, sx+2, sy+s_size*1.5], fill="black")
            d.rectangle([sx-s_size, sy+s_size/2-2, sx+s_size, sy+s_size/2+2], fill="black")
            mx = width - sx
            d.rectangle([mx-2, sy-s_size, mx+2, sy+s_size*1.5], fill="black")
            d.rectangle([mx-s_size, sy+s_size/2-2, mx+s_size, sy+s_size/2+2], fill="black")
        else: # Spike
            d.polygon([(sx-5, sy), (sx+5, sy), (sx, sy - s_size*2)], fill="black")
            mx = width - sx
            d.polygon([(mx-5, sy), (mx+5, sy), (mx, sy - s_size*2)], fill="black")

    # 3. Crosses (Left and Right - Original positioning)
    def draw_side_cross(cx, cy, s):
        d.rectangle([cx-5, cy-s, cx+5, cy+s], fill="black")
        d.rectangle([cx-s, cy-5, cx+s, cy+5], fill="black")
        # Mirror
        m_cx = width - cx
        d.rectangle([m_cx-5, cy-s, m_cx+5, cy+s], fill="black")
        d.rectangle([m_cx-s, cy-5, m_cx+s, cy+5], fill="black")

    draw_side_cross(tx - 60, ty + th//2, 80)
    
    # 3. Dense Mirror Thorns
    # Procedurally scatter jagged structures
    for _ in range(800):
        lx = random.randint(50, width//2)
        ly = random.randint(ty - 150, ty + th + 200)
        
        # Branch-like spikes
        angle = random.uniform(-np.pi, np.pi)
        length = random.uniform(20, 100)
        p1 = (lx, ly)
        p2 = (lx + length * np.sin(angle), ly + length * np.cos(angle))
        thickness = random.uniform(1, 4)
        p3 = (lx + thickness * np.cos(angle), ly + thickness * np.sin(angle))
        
        draw_mirrored_poly([p1, p2, p3], fill="black")

    # 4. Skull Silhouettes (simplified)
    # Scatter some "skulls" in the monolithic mix
    for _ in range(6):
        sx = random.randint(tx, width//2)
        sy = random.randint(ty, ty + th)
        # Head
        draw_mirrored_circle((sx, sy), 20, "black")
        # Jaw
        # d.rectangle([sx-10, sy+15, sx+10, sy+25], fill="black")
    
    # 5. Integrated White Outline
    # Extract alpha mask
    mask = monolith.split()[3]
    # Dilation for outline
    dilated_mask = mask.filter(ImageFilter.MaxFilter(13))
    outline_img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    
    # Final Composition
    final = bg_img.convert("RGBA")
    # Paste outline
    final.paste(outline_img, (0, 0), dilated_mask)
    # Paste black structure
    final.paste(monolith, (0, 0), monolith)
    
    # Post-process: slight grain (optional but similar to lo-fi feel)
    final_rgb = final.convert("RGB")
    final_np = np.array(final_rgb)
    noise = (np.random.randn(*final_np.shape) * 10).astype(np.int16)
    final_np = np.clip(final_np.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    Image.fromarray(final_np).save("logo.png")
    print("Logo v4 generated: logo.png")

if __name__ == "__main__":
    generate_logo_v4()
