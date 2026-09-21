import os
from PIL import Image, ImageDraw, ImageFont, ImageChops

def create_labeled_header(width, text_left, text_right, height=48):
    header = Image.new("RGB", (width, height), (15, 23, 42)) # slate-900
    draw = ImageDraw.Draw(header)
    # Default PIL font is basic, let's draw clear text
    draw.text((24, 16), text_left, fill=(255, 255, 255))
    mid = width // 2
    draw.line([(mid, 0), (mid, height)], fill=(71, 85, 105), width=2)
    draw.text((mid + 24, 16), text_right, fill=(56, 189, 248)) # sky-400
    return header

def generate_comparisons():
    os.makedirs("H:/LC/research", exist_ok=True)
    os.makedirs("H:/LC/web/tests/screenshots", exist_ok=True)

    # -------------------------------------------------------------
    # 1. DESKTOP COMPARISONS
    # -------------------------------------------------------------
    ref_desk_path = "H:/LC/research/ref_desktop.png"
    act_desk_path = "H:/LC/web/tests/screenshots/desktop-services-viewport.png"

    if os.path.exists(ref_desk_path) and os.path.exists(act_desk_path):
        ref_desk = Image.open(ref_desk_path).convert("RGB")
        act_desk = Image.open(act_desk_path).convert("RGB")

        # Chuẩn hóa cùng kích thước chuẩn Desktop 1440x900
        target_w, target_h = 1440, 900
        ref_desk_resized = ref_desk.resize((target_w, target_h), Image.Resampling.LANCZOS)
        act_desk_resized = act_desk.resize((target_w, target_h), Image.Resampling.LANCZOS)

        # A. Desktop Overlay (50% blend)
        desk_overlay = Image.blend(ref_desk_resized, act_desk_resized, alpha=0.5)
        
        # Header banner cho overlay
        overlay_banner = Image.new("RGB", (target_w, 40), (2, 132, 199)) # sky-600
        draw = ImageDraw.Draw(overlay_banner)
        draw.text((24, 12), "ẢNH CHỒNG LỚP ĐỐI CHIẾU DESKTOP (50% OPACITY OVERLAY) - KIỂM CHỨNG BỐ CỤC & TỶ LỆ", fill=(255, 255, 255))
        
        final_desk_overlay = Image.new("RGB", (target_w, target_h + 40))
        final_desk_overlay.paste(overlay_banner, (0, 0))
        final_desk_overlay.paste(desk_overlay, (0, 40))
        final_desk_overlay.save("H:/LC/research/comparison_desktop_overlay.png")
        print("Generated: comparison_desktop_overlay.png")

        # B. Desktop Side-by-Side
        total_w = target_w * 2 + 16
        header = create_labeled_header(total_w, "ẢNH MẪU THAM CHIẾU (IMAGE.PNG - DESKTOP)", "GIAO DIỆN THỰC TẾ LC COMPASS (DESKTOP CHROME 1440x900)")
        side_by_side_desk = Image.new("RGB", (total_w, target_h + 48), (241, 245, 249))
        side_by_side_desk.paste(header, (0, 0))
        side_by_side_desk.paste(ref_desk_resized, (0, 48))
        side_by_side_desk.paste(act_desk_resized, (target_w + 16, 48))
        side_by_side_desk.save("H:/LC/research/comparison_desktop_side_by_side.png")
        print("Generated: comparison_desktop_side_by_side.png")

    # -------------------------------------------------------------
    # 2. MOBILE COMPARISONS
    # -------------------------------------------------------------
    ref_mob_path = "H:/LC/research/ref_mobile.png"
    act_mob_path = "H:/LC/web/tests/screenshots/mobile-services-viewport.png"

    if os.path.exists(ref_mob_path) and os.path.exists(act_mob_path):
        ref_mob = Image.open(ref_mob_path).convert("RGB")
        act_mob = Image.open(act_mob_path).convert("RGB")

        # Kích thước chuẩn Mobile iPhone Viewport 375x812
        target_mw, target_mh = 380, 812
        ref_mob_resized = ref_mob.resize((target_mw, target_mh), Image.Resampling.LANCZOS)
        act_mob_resized = act_mob.resize((target_mw, target_mh), Image.Resampling.LANCZOS)

        # A. Mobile Overlay (50% blend)
        mob_overlay = Image.blend(ref_mob_resized, act_mob_resized, alpha=0.5)
        mob_banner = Image.new("RGB", (target_mw, 36), (16, 185, 129)) # emerald-500
        draw_m = ImageDraw.Draw(mob_banner)
        draw_m.text((12, 10), "OVERLAY 50% MOBILE (375x812)", fill=(255, 255, 255))

        final_mob_overlay = Image.new("RGB", (target_mw, target_mh + 36))
        final_mob_overlay.paste(mob_banner, (0, 0))
        final_mob_overlay.paste(mob_overlay, (0, 36))
        final_mob_overlay.save("H:/LC/research/comparison_mobile_overlay.png")
        print("Generated: comparison_mobile_overlay.png")

        # B. Mobile Side-by-Side
        total_mw = target_mw * 2 + 16
        mob_header = create_labeled_header(total_mw, "ẢNH MẪU (MOBILE)", "THỰC TẾ LC COMPASS (MOBILE 375x812)")
        side_by_side_mob = Image.new("RGB", (total_mw, target_mh + 48), (241, 245, 249))
        side_by_side_mob.paste(mob_header, (0, 0))
        side_by_side_mob.paste(ref_mob_resized, (0, 48))
        side_by_side_mob.paste(act_mob_resized, (target_mw + 16, 48))
        side_by_side_mob.save("H:/LC/research/comparison_mobile_side_by_side.png")
        print("Generated: comparison_mobile_side_by_side.png")

if __name__ == "__main__":
    generate_comparisons()
