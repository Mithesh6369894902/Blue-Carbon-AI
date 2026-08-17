import os
import shutil

src_icon = r"C:\Users\MITHESH D\.gemini\antigravity-ide\brain\cf16049b-0923-4254-97f4-d2c907c91561\bluecarbon_app_icon_1786972929695.jpg"
src_uiux = r"C:\Users\MITHESH D\.gemini\antigravity-ide\brain\cf16049b-0923-4254-97f4-d2c907c91561\bluecarbon_mobile_screen_uiux_1786973215064.jpg"

dest_dir = r"c:\Users\MITHESH D\Downloads\Blue carbon SIH\public\screenshots"
os.makedirs(dest_dir, exist_ok=True)

if os.path.exists(src_icon):
    shutil.copy(src_icon, os.path.join(dest_dir, "app_icon.jpg"))
    print("Copied app_icon.jpg")

if os.path.exists(src_uiux):
    shutil.copy(src_uiux, os.path.join(dest_dir, "mobile_uiux.jpg"))
    print("Copied mobile_uiux.jpg")
