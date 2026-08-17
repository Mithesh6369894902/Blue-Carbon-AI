import os
from PIL import Image

src_icon_path = r"C:\Users\MITHESH D\.gemini\antigravity-ide\brain\cf16049b-0923-4254-97f4-d2c907c91561\bluecarbon_app_icon_1786972929695.jpg"
android_res_dir = r"c:\Users\MITHESH D\Downloads\Blue carbon SIH\android\app\src\main\res"
public_dir = r"c:\Users\MITHESH D\Downloads\Blue carbon SIH\public"

if not os.path.exists(src_icon_path):
    print(f"Error: Source icon not found at {src_icon_path}")
    exit(1)

img = Image.open(src_icon_path).convert("RGBA")

# Mipmap sizes for launcher icons
sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

for folder, size in sizes.items():
    target_folder = os.path.join(android_res_dir, folder)
    os.makedirs(target_folder, exist_ok=True)
    
    # Resize icon
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    
    icon_png = os.path.join(target_folder, "ic_launcher.png")
    icon_round_png = os.path.join(target_folder, "ic_launcher_round.png")
    icon_fore_png = os.path.join(target_folder, "ic_launcher_foreground.png")
    
    resized.save(icon_png, "PNG")
    resized.save(icon_round_png, "PNG")
    resized.save(icon_fore_png, "PNG")
    print(f"Updated icons in {folder} ({size}x{size})")

# Save to public web icons as well
logo_png = os.path.join(public_dir, "bluecarbon_logo.png")
img.resize((512, 512), Image.Resampling.LANCZOS).save(logo_png, "PNG")
img.resize((64, 64), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "favicon.png"), "PNG")

print("All app icons updated successfully!")
