"""
Accuracy check benchmark script for Verity (BraKet).
Runs all 6 seeded demo posts with known planted errors and measures:
- Total Planted Errors vs Caught Errors (Recall)
- False Flags on Clean Copy (Precision)
"""
import sys
import os

# Add api to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "api")))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.seed_data import seed_database, DEMO_POSTS
from app.engine.deterministic import run_deterministic_checks
from app.engine.claim_ledger import check_claim_ledger

def run_accuracy_benchmark():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    seed_database(db)

    print("=" * 65)
    print("  VERITY GOVERNANCE ENGINE — ACCURACY BENCHMARK SUITE")
    print("=" * 65)

    # Ground truth expectations for the 6 demo posts:
    # 1. demo_post_comprehensive:
    #    - "NovaFest" (T-1)
    #    - "CHEAP" (T-2 & V-2)
    #    - "#1 student fest in India" (C-1 expired)
    #    - "guaranteed to" (T-3)
    #    - "Project Falcon" (P-1)
    #    - "!!!" (V-1)
    #    Expected planted errors caught: 6
    # 2. demo_post_clean:
    #    - Clean copy: 0 errors expected!
    # 3. demo_post_subtle_ai_voice:
    #    - Evaluated in AI pass (or 0 deterministic)
    # 4. demo_post_claims_expiring:
    #    - "free entry for students" (C-1 expiring soon warning): 1 error caught
    # 5. demo_post_tone_hygiene:
    #    - "GET READY EVERYONE", "THIS IS THE BIGGEST PARTY OF THE YEAR", "DO NOT MISS OUT" (V-2)
    #    - "!!!!!" (V-1), "!!!" (V-1)
    #    Expected: 3+ errors caught
    # 6. demo_post_accessibility:
    #    - Contrast ratio #FFFF00 on #FFFFFF (A-1)
    #    - Missing alt text ![]() (A-2)
    #    Expected: 2 errors caught

    total_planted_in_deterministic_scope = 12
    caught_planted_errors = 0
    false_flags = 0

    for post in DEMO_POSTS:
        text = post["text"]
        post_id = post["id"]
        
        det_findings = run_deterministic_checks(text, db)
        claim_findings = check_claim_ledger(text, db)
        all_findings = det_findings + claim_findings

        # Filter out informational verification tags
        actionable_findings = [f for f in all_findings if f["severity"] in ["critical", "warning"]]

        print(f"\n[Post: {post['title']}]")
        print(f"Excerpt: \"{text[:75]}...\"")
        print(f"Findings ({len(actionable_findings)}):")
        for f in actionable_findings:
            print(f"  • [{f.get('rule_id', 'N/A')}] {f['severity'].upper()}: {f['message'][:60]}... (Quote: '{f['quote']}')")

        if post_id == "demo_post_clean":
            if len(actionable_findings) > 0:
                false_flags += len(actionable_findings)
                print(f"  FAILED: False flags on clean post: {len(actionable_findings)}")
            else:
                print("  SUCCESS: 0 false flags on clean post (100% precision).")
        elif post_id == "demo_post_comprehensive":
            rule_ids = set(f.get("rule_id") for f in actionable_findings)
            # Checked T-1, T-2, T-3, V-1, V-2, C-1, P-1
            caught_count = len(rule_ids.intersection({"T-1", "T-2", "T-3", "V-1", "V-2", "C-1", "P-1"}))
            caught_planted_errors += caught_count
            print(f"  Comprehensive test caught {caught_count} / 6 distinct rule violations.")
        elif post_id == "demo_post_claims_expiring":
            if any("EXPIRES IN" in f["message"] for f in actionable_findings):
                caught_planted_errors += 1
                print("  Expiring claim test caught ledger warning accurately.")
        elif post_id == "demo_post_tone_hygiene":
            tone_rules = set(f.get("rule_id") for f in actionable_findings)
            if "V-1" in tone_rules and "V-2" in tone_rules:
                caught_planted_errors += 2
                print("  Tone hygiene test caught ALL-CAPS and repeated exclamations.")
        elif post_id == "demo_post_accessibility":
            acc_rules = set(f.get("rule_id") for f in actionable_findings)
            if "A-1" in acc_rules:
                caught_planted_errors += 1
            if "A-2" in acc_rules:
                caught_planted_errors += 1
            print(f"  Accessibility test caught {len(acc_rules.intersection({'A-1', 'A-2'}))} / 2 defects.")

    print("\n" + "=" * 65)
    print("  ACCURACY BENCHMARK RESULTS")
    print("=" * 65)
    print(f"  Caught {caught_planted_errors} of {total_planted_in_deterministic_scope} planted errors.")
    print(f"  False flags on clean copy: {false_flags}")
    recall_pct = (caught_planted_errors / total_planted_in_deterministic_scope) * 100
    precision_pct = 100.0 if false_flags == 0 else (caught_planted_errors / (caught_planted_errors + false_flags)) * 100
    print(f"  Recall: {recall_pct:.1f}%")
    print(f"  False Positive Rate: {false_flags}%")
    print("=" * 65 + "\n")

    return caught_planted_errors, false_flags

if __name__ == "__main__":
    run_accuracy_benchmark()
