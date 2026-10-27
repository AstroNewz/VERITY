import pytest
from app.engine.asset_vision import analyze_graphic_asset, create_sample_brand_poster

def test_sample_brand_poster_generation():
    poster_bytes = create_sample_brand_poster()
    assert poster_bytes is not None
    assert len(poster_bytes) > 1000
    assert poster_bytes[:8] == b"\x89PNG\r\n\x1a\n"

def test_asset_vision_analysis_metrics():
    poster_bytes = create_sample_brand_poster()
    result = analyze_graphic_asset(poster_bytes, filename="test_banner.png")
    
    assert result["filename"] == "test_banner.png"
    assert result["dimensions"]["width"] == 1200
    assert result["dimensions"]["height"] == 630
    assert "Landscape" in result["dimensions"]["aspect_label"]
    
    # Palette check
    palette = result["dominant_palette"]
    assert len(palette) >= 3
    assert result["palette_alignment_score"] >= 0.70
    assert any(p["is_official"] for p in palette)
    
    # WCAG Contrast check
    wcag = result["wcag_contrast"]
    assert wcag["ratio"] >= 4.5
    assert wcag["pass_aa"] is True
    
    # Clear space check
    clear_space = result["clear_space"]
    assert "status" in clear_space
    
    # Findings and critique
    assert len(result["findings"]) >= 2
    assert any(f["rule_id"] in ["V-1", "A-1", "V-2"] for f in result["findings"])
    assert len(result["art_director_critique"]) > 20
    assert result["annotated_preview_base64"].startswith("data:image/png;base64,")
