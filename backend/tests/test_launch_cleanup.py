"""Regression tests for pre-launch cleanup: waitlist defaults, empty schedule, admin settings & schedule CRUD."""
import os
import httpx
import pytest

BASE = os.environ.get("REACT_APP_BACKEND_URL", "https://blasian-fire.preview.emergentagent.com").rstrip("/")
API = f"{BASE}/api"

ADMIN_EMAIL = "admin@kayomestiza.com"
ADMIN_PASSWORD = "KayoFire2026!"


@pytest.fixture(scope="module")
def admin_session():
    s = httpx.Client(base_url=API, timeout=30.0)
    r = s.post("/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.text}"
    yield s
    s.close()


# --- Public settings & schedule defaults ---
class TestPublicDefaults:
    def test_settings_waitlist_mode(self):
        r = httpx.get(f"{API}/settings", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["drop"]["drop_at"] is None
        assert data["drop"]["overline"] == "Opening Soon"
        assert data["contact"]["instagram"] == ""
        assert data["contact"]["facebook"] == ""
        assert data["contact"]["tiktok"] == ""
        assert "Fredericksburg" in data["drop"]["location_note"]

    def test_schedule_empty_on_fresh_db(self):
        r = httpx.get(f"{API}/schedule", timeout=15)
        assert r.status_code == 200
        data = r.json()
        # Should be either empty OR contain no placeholder venues
        placeholders = {"Spark Social SF", "Off the Grid: Fort Mason", "SoMa Streat Food Park",
                        "Oakland First Fridays", "Kitchen Prep Day"}
        locs = {e["location"] for e in data["entries"]}
        assert placeholders.isdisjoint(locs), f"Placeholder venues still present: {placeholders & locs}"


# --- Admin schedule CRUD ---
class TestScheduleAdmin:
    def test_admin_can_publish_and_clear_schedule(self, admin_session):
        entry = {"day": "Friday", "time": "5-9pm", "location": "TEST_PopUp",
                 "address": "100 Main St, Fredericksburg VA", "note": "", "closed": False}
        r = admin_session.put("/schedule", json={"entries": [entry]})
        assert r.status_code == 200
        data = r.json()
        assert any(e["location"] == "TEST_PopUp" for e in data["entries"])

        # Verify public GET reflects it
        r2 = httpx.get(f"{API}/schedule", timeout=15)
        assert any(e["location"] == "TEST_PopUp" for e in r2.json()["entries"])

        # Clear
        r3 = admin_session.put("/schedule", json={"entries": []})
        assert r3.status_code == 200
        assert r3.json()["entries"] == []


# --- Admin settings update (socials + drop_at toggle) ---
class TestSettingsAdmin:
    def test_toggle_socials_and_drop_date(self, admin_session):
        # Get current settings
        current = httpx.get(f"{API}/settings", timeout=15).json()

        # Set socials & drop_at
        patched = {
            "drop": {**current["drop"], "drop_at": "2026-03-01T18:00:00Z", "item_name": "TEST_ITEM"},
            "contact": {**current["contact"],
                        "instagram": "https://instagram.com/test",
                        "facebook": "https://facebook.com/test",
                        "tiktok": "https://tiktok.com/@test"},
        }
        r = admin_session.put("/settings", json=patched)
        assert r.status_code == 200

        r2 = httpx.get(f"{API}/settings", timeout=15).json()
        assert r2["drop"]["drop_at"] == "2026-03-01T18:00:00Z"
        assert r2["contact"]["instagram"] == "https://instagram.com/test"
        assert r2["contact"]["facebook"] == "https://facebook.com/test"
        assert r2["contact"]["tiktok"] == "https://tiktok.com/@test"

        # Restore waitlist defaults (empty socials & null drop_at)
        restore = {
            "drop": {**current["drop"], "drop_at": None, "item_name": ""},
            "contact": {**current["contact"], "instagram": "", "facebook": "", "tiktok": ""},
        }
        r3 = admin_session.put("/settings", json=restore)
        assert r3.status_code == 200
        r4 = httpx.get(f"{API}/settings", timeout=15).json()
        assert r4["drop"]["drop_at"] is None
        assert r4["contact"]["instagram"] == ""


# --- Inquiries (catering form still submits) ---
class TestInquiries:
    def test_catering_inquiry_submits(self, admin_session):
        payload = {
            "type": "catering",
            "name": "TEST_Buyer",
            "email": "test_buyer@example.com",
            "phone": "555-1234",
            "message": "Need a quote for 40-person office lunch",
            "package": "office-popup",
        }
        r = httpx.post(f"{API}/inquiries", json=payload, timeout=15)
        assert r.status_code == 200
        created = r.json()
        assert created["name"] == "TEST_Buyer"
        assert "id" in created

        # Admin can see it
        r2 = admin_session.get("/inquiries")
        assert r2.status_code == 200
        assert any(i["id"] == created["id"] for i in r2.json())


# --- AI concierge quotes new price ---
class TestConciergePrice:
    def test_concierge_quotes_kayo_box_13(self):
        menu = [
            {"name": "The Kayo Box",
             "description": "Any Griddle item plus 2 pieces of Traditional Lumpia.",
             "price": 13.0, "category": "combos", "tags": ["Signature"], "heat": 2},
            {"name": "Traditional Lumpia", "description": "2 pieces.",
             "price": 4.5, "category": "lumpia", "tags": [], "heat": 1},
        ]
        r = httpx.post(f"{API}/ai/concierge",
                       json={"session_id": "TEST_price_check", "message": "How much is the Kayo Box?", "menu": menu},
                       timeout=60)
        assert r.status_code == 200, r.text
        answer = r.json()["answer"]
        assert "13" in answer, f"Expected $13 in answer: {answer}"
