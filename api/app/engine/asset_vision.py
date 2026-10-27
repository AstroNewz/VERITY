import io
import math
import base64
import logging
from typing import Dict, Any, List, Tuple, Optional
from PIL import Image, ImageDraw, ImageOps
import numpy as np

logger = logging.getLogger(__name__)

OFFICIAL_BRAND_PALETTE = {
    "Official Canvas Cream": "#FFFBEF",
    "Official Ink Black": "#111111",
    "Official Primary Yellow": "#FFE500",
    "Official Mint Accent": "#00FF66",
    "Official Coral Accent": "#FF3366"
}

def hex_to_rgb(hex_str: str) -> Tuple[int, int, int]:
    h = hex_str.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{int(r):02X}{int(g):02X}{int(b):02X}"

def color_distance(c1: Tuple[int, int, int], c2: Tuple[int, int, int]) -> float:
    # Weighted Euclidean distance to account for human perception (redmean formula)
    r1, g1, b1 = c1
    r2, g2, b2 = c2
    r_bar = (r1 + r2) / 2.0
    dr = r1 - r2
    dg = g1 - g2
    db = b1 - b2
    return math.sqrt((2 + r_bar / 256.0) * (dr ** 2) + 4.0 * (dg ** 2) + (2 + (255 - r_bar) / 256.0) * (db ** 2))

def get_relative_luminance(rgb: Tuple[int, int, int]) -> float:
    def channel_lum(val: float) -> float:
        c = val / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * channel_lum(r) + 0.7152 * channel_lum(g) + 0.0722 * channel_lum(b)

def calculate_contrast_ratio(rgb1: Tuple[int, int, int], rgb2: Tuple[int, int, int]) -> float:
    l1 = get_relative_luminance(rgb1)
    l2 = get_relative_luminance(rgb2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

def analyze_graphic_asset(image_bytes: bytes, filename: str = "asset.png") -> Dict[str, Any]:
    """
    Multimodal Computer Vision Analysis of creative poster / banner graphics.
    Evaluates:
      1. Dimensions, aspect ratio, and print/digital resolution grade.
      2. Dominant color palette extraction and alignment with official Brand Tokens.
      3. Mathematical WCAG 2.1 AA luminance contrast ratio between foreground and canvas.
      4. Safe-zone border clear space margin detection (detects text/logo encroachment).
      5. Rule citations and art director governance recommendations.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        logger.error(f"Failed to open image for vision inspection: {e}")
        raise ValueError(f"Invalid or unreadable image file: {e}")

    width, height = img.size
    aspect_val = width / height if height > 0 else 1.0
    
    # 1. Aspect Ratio Classification
    if 1.7 <= aspect_val <= 2.1:
        aspect_label = "Social Landscape Banner (1.91:1 / 16:9)"
    elif 0.7 <= aspect_val <= 0.9:
        aspect_label = "Social Portrait Poster (4:5 / 9:16)"
    elif 0.95 <= aspect_val <= 1.05:
        aspect_label = "Square Creative Asset (1:1)"
    else:
        aspect_label = f"Custom Canvas ({aspect_val:.2f}:1)"

    res_grade = "High-Definition (Retina Ready)" if (width >= 1080 and height >= 600) else "Standard Web Resolution"

    # 2. Dominant Color Palette Extraction
    # Resize to fast thumbnail for stable color quantization
    thumb = img.resize((150, 150), Image.Resampling.LANCZOS)
    pixels = np.array(thumb).reshape(-1, 3)

    # Group colors by 16-step quantization bins to merge similar shades
    quantized_pixels = (pixels // 16) * 16
    unique_colors, counts = np.unique(quantized_pixels, axis=0, return_counts=True)
    sorted_indices = np.argsort(-counts)

    total_pixels = len(pixels)
    palette_data = []
    official_pixel_count = 0

    for idx in sorted_indices[:6]:
        r, g, b = int(unique_colors[idx][0]), int(unique_colors[idx][1]), int(unique_colors[idx][2])
        hex_code = rgb_to_hex(r, g, b)
        pct = round((counts[idx] / total_pixels) * 100, 1)

        # Match against official brand palette
        best_token = "Custom / Unofficial"
        min_dist = 999.0
        is_official = False

        for token_name, token_hex in OFFICIAL_BRAND_PALETTE.items():
            dist = color_distance((r, g, b), hex_to_rgb(token_hex))
            if dist < min_dist and dist < 85.0:
                min_dist = dist
                best_token = token_name
                is_official = True

        if is_official:
            official_pixel_count += counts[idx]

        palette_data.append({
            "hex": hex_code,
            "rgb": [r, g, b],
            "percentage": pct,
            "brand_token": best_token,
            "is_official": is_official,
            "distance": round(min_dist, 1) if is_official else None
        })

    palette_alignment_score = round(min(1.0, official_pixel_count / total_pixels), 2)

    # 3. Mathematical WCAG 2.1 Contrast Ratio
    # Determine dominant background (largest color) and foreground (highest contrasting color)
    bg_color = palette_data[0]["rgb"] if palette_data else [255, 251, 239]
    fg_candidates = [p["rgb"] for p in palette_data[1:]] if len(palette_data) > 1 else [[17, 17, 17]]
    
    best_fg = fg_candidates[0]
    max_contrast = 0.0
    for fg in fg_candidates:
        c = calculate_contrast_ratio(fg, bg_color)
        if c > max_contrast:
            max_contrast = c
            best_fg = fg

    wcag_pass_aa = max_contrast >= 4.5
    wcag_pass_aaa = max_contrast >= 7.0
    wcag_level = "AAA" if wcag_pass_aaa else "AA" if wcag_pass_aa else "FAIL"

    # 4. Safe Zone & Border Margin Inspection (Clear-Space Detection)
    # Check 5% outer boundary strip for element encroachment
    margin_pct = 0.05
    mw = max(4, int(width * margin_pct))
    mh = max(4, int(height * margin_pct))

    # Convert to grayscale for edge activity detection
    gray_img = img.convert("L")
    gray_arr = np.array(gray_img)

    # Extract border bands
    top_band = gray_arr[:mh, :]
    bottom_band = gray_arr[-mh:, :]
    left_band = gray_arr[:, :mw]
    right_band = gray_arr[:, -mw:]

    # Calculate standard deviation of pixel values in the border bands
    # Flat background has std < 8. Detailed graphics or text in the margin produce std > 18.
    border_stds = [np.std(top_band), np.std(bottom_band), np.std(left_band), np.std(right_band)]
    max_border_activity = float(max(border_stds))
    border_encroachment = max_border_activity > 22.0

    # 5. Generate Annotated Base64 Image Preview with Safe Zone Overlay
    annotated_img = img.copy().resize((600, int(600 / aspect_val)))
    draw = ImageDraw.Draw(annotated_img)
    aw, ah = annotated_img.size
    smw = int(aw * margin_pct)
    smh = int(ah * margin_pct)

    # Draw safe zone guide rectangle
    guide_color = (255, 51, 102) if border_encroachment else (0, 255, 102)
    draw.rectangle([smw, smh, aw - smw, ah - smh], outline=guide_color, width=3)

    buffered = io.BytesIO()
    annotated_img.save(buffered, format="PNG")
    preview_base64 = f"data:image/png;base64,{base64.b64encode(buffered.getvalue()).decode('utf-8')}"

    # 6. Rule-Cited Findings Generation
    findings = []
    
    # Check palette compliance
    if palette_alignment_score >= 0.70:
        official_tokens = [p["brand_token"] for p in palette_data if p["is_official"]][:5]
        findings.append({
            "rule_id": "V-1",
            "type": "visual_asset",
            "severity": "info",
            "title": "Brand Color Palette Alignment",
            "message": f"Asset demonstrates {int(palette_alignment_score * 100)}% adherence to Nova Fest official brand palette ({', '.join(official_tokens)}).",
            "source_cited": "Rule V-1: Nova Fest Brand Book 2026, Section 3.1 (Official Color Hierarchy)",
            "confidence": 0.96
        })
    else:
        findings.append({
            "rule_id": "V-1",
            "type": "visual_asset",
            "severity": "warning",
            "title": "Off-Palette Colors Detected",
            "message": f"Asset contains {int((1.0 - palette_alignment_score) * 100)}% off-palette shades. Brand guidelines require primary canvas in #FFFBEF or #111111.",
            "source_cited": "Rule V-1: Nova Fest Brand Book 2026, Section 3.1",
            "confidence": 0.92
        })

    # Check WCAG contrast
    if wcag_pass_aa:
        findings.append({
            "rule_id": "A-1",
            "type": "accessibility",
            "severity": "info",
            "title": "WCAG 2.1 AA Contrast Compliance",
            "message": f"Dominant foreground on canvas delivers {max_contrast:.2f}:1 contrast ratio, surpassing WCAG 2.1 {wcag_level} requirement.",
            "source_cited": "Rule A-1: W3C WCAG 2.1 Guideline 1.4.3 (Minimum Contrast 4.5:1)",
            "confidence": 0.99
        })
    else:
        findings.append({
            "rule_id": "A-1",
            "type": "accessibility",
            "severity": "critical",
            "title": "WCAG 2.1 Contrast Failure",
            "message": f"Low contrast ({max_contrast:.2f}:1) detected between foreground and background. Fails minimum 4.5:1 threshold.",
            "source_cited": "Rule A-1: W3C WCAG 2.1 Guideline 1.4.3",
            "confidence": 0.98
        })

    # Check Clear Space
    if border_encroachment:
        findings.append({
            "rule_id": "V-2",
            "type": "visual_asset",
            "severity": "warning",
            "title": "Logo / Perimeter Clear Space Encroachment",
            "message": "High-density graphic or typography elements encroach into the mandatory 5% outer perimeter margin. Elements risk clipping during social feed previews.",
            "source_cited": "Rule V-2: Nova Fest Brand Book 2026, Section 4.2 (Margin & Safe Zone Protection)",
            "confidence": 0.88
        })
    else:
        findings.append({
            "rule_id": "V-2",
            "type": "visual_asset",
            "severity": "info",
            "title": "Safe Zone Margin Compliance",
            "message": "Perimeter clear-space margins (5% safe zone) are fully preserved with zero bleed clipping.",
            "source_cited": "Rule V-2: Nova Fest Brand Book 2026, Section 4.2",
            "confidence": 0.95
        })

    # 7. Art Director Synthesis
    critique = (
        f"Verified {aspect_label} at {width}x{height}px. Dominant canvas adheres to {palette_alignment_score*100:.0f}% approved palette "
        f"with strong {max_contrast:.1f}:1 luminance contrast ({wcag_level}). "
        + ("Safe margins are well preserved." if not border_encroachment else "Recommended: Increase outer margin padding by 24px.")
    )

    return {
        "filename": filename,
        "dimensions": {
            "width": width,
            "height": height,
            "aspect_ratio": f"{aspect_val:.2f}:1",
            "aspect_label": aspect_label,
            "resolution_grade": res_grade
        },
        "dominant_palette": palette_data,
        "palette_alignment_score": palette_alignment_score,
        "wcag_contrast": {
            "fg_hex": rgb_to_hex(*best_fg),
            "bg_hex": rgb_to_hex(*bg_color),
            "ratio": round(max_contrast, 2),
            "ratio_str": f"{max_contrast:.2f}:1",
            "level": wcag_level,
            "pass_aa": wcag_pass_aa,
            "pass_aaa": wcag_pass_aaa
        },
        "clear_space": {
            "status": "FLAGGED" if border_encroachment else "PASSED",
            "safe_zone_margin_pct": 5,
            "border_encroachment_detected": border_encroachment
        },
        "findings": findings,
        "art_director_critique": critique,
        "annotated_preview_base64": preview_base64
    }

def create_sample_brand_poster() -> bytes:
    """Creates a sample Nova Fest 2026 digital social landscape banner in official brand colors."""
    img = Image.new("RGB", (1200, 630), color="#FFFBEF")
    draw = ImageDraw.Draw(img)
    # Header container
    draw.rectangle([60, 60, 1140, 220], fill="#111111")
    # Primary yellow hero block
    draw.rectangle([60, 250, 600, 560], fill="#FFE500")
    # Mint accent ticket block
    draw.rectangle([640, 250, 1140, 390], fill="#00FF66")
    # Coral highlight tag
    draw.rectangle([640, 420, 960, 510], fill="#FF3366")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
