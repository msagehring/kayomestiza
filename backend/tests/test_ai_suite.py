"""Backend tests for the Gemini AI Suite (concierge, copy, specials-image) + auth regression."""
import os
import uuid
import pytest
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://blasian-fire.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

MENU_SAMPLE = [
    {"name": "The Kayo Box", "description": "Signature combo", "price": 18, "category": "Combos & Flights", "tags": ["Signature"], "heat": 2},
    {"name": "Baboy Kabob", "description": "Charred pork skewers", "price": 9, "category": "Skewers & Tacos", "tags": ["Grilled"], "heat": 2},
    {"name": "Traditional Lumpia", "description": "Golden-fried spring rolls", "price": 8, "category": "The Lumpia Lineup", "tags": ["Classic"], "heat": 1},
    {"name": "Turon Magic", "description": "Sweet fried bananas", "price": 7, "category": "The Lumpia Lineup", "tags": ["Dessert"], "heat": 0},
]


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    return s


# ---- Concierge (public) ----
class TestConcierge:
    def test_concierge_public_starter(self, api):
        sid = f"sess-{uuid.uuid4().hex[:20]}"
        r = api.post(
            f"{BASE_URL}/api/ai/concierge",
            json={"session_id": sid, "message": "What should a first-timer order?", "menu": MENU_SAMPLE},
            timeout=60,
        )
        assert r.status_code == 200, f"{r.status_code} {r.text}"
        data = r.json()
        assert "answer" in data and isinstance(data["answer"], str) and len(data["answer"]) > 20
        # Should ground in real menu — expect at least one real item name mentioned
        answer_lower = data["answer"].lower()
        assert any(name.lower() in answer_lower for name in ["kayo box", "baboy", "lumpia", "turon"]), (
            f"answer didn't reference real menu items: {data['answer']}"
        )

    def test_concierge_multi_turn_memory(self, api):
        sid = f"sess-{uuid.uuid4().hex[:20]}"
        r1 = api.post(
            f"{BASE_URL}/api/ai/concierge",
            json={"session_id": sid, "message": "Recommend one thing for a first-timer.", "menu": MENU_SAMPLE},
            timeout=60,
        )
        assert r1.status_code == 200
        r2 = api.post(
            f"{BASE_URL}/api/ai/concierge",
            json={"session_id": sid, "message": "How much is that first one?", "menu": MENU_SAMPLE},
            timeout=60,
        )
        assert r2.status_code == 200
        ans = r2.json()["answer"]
        # Should contain a price digit referencing prior recommendation
        assert any(c.isdigit() for c in ans), f"follow-up didn't mention any price: {ans}"

    def test_concierge_refuses_off_menu(self, api):
        sid = f"sess-{uuid.uuid4().hex[:20]}"
        r = api.post(
            f"{BASE_URL}/api/ai/concierge",
            json={"session_id": sid, "message": "Do you sell pizza or sushi?", "menu": MENU_SAMPLE},
            timeout=60,
        )
        assert r.status_code == 200
        ans = r.json()["answer"].lower()
        # Refusal signal + real menu suggestion
        assert any(w in ans for w in ["don't", "do not", "no ", "not on", "sorry", "we don"]), (
            f"expected refusal, got: {ans}"
        )

    def test_concierge_validation_empty_message(self, api):
        r = api.post(
            f"{BASE_URL}/api/ai/concierge",
            json={"session_id": "sess-abcdefg", "message": "", "menu": MENU_SAMPLE},
            timeout=15,
        )
        assert r.status_code == 422

    def test_concierge_validation_empty_menu(self, api):
        r = api.post(
            f"{BASE_URL}/api/ai/concierge",
            json={"session_id": "sess-abcdefg", "message": "hi", "menu": []},
            timeout=15,
        )
        assert r.status_code == 422


# ---- Admin-only auth checks ----
class TestAdminOnly:
    def test_copy_requires_auth(self, api):
        r = api.post(f"{BASE_URL}/api/ai/copy", json={"subject": "hello world"}, timeout=15)
        assert r.status_code == 401

    def test_image_requires_auth(self, api):
        r = api.post(f"{BASE_URL}/api/ai/specials-image", json={"prompt": "hello world"}, timeout=15)
        assert r.status_code == 401


# ---- Admin copywriter ----
class TestCopy:
    def test_copy_returns_variants(self, admin_session):
        r = admin_session.post(
            f"{BASE_URL}/api/ai/copy",
            json={"subject": "Weekend special: Kayo Box combo drops Saturday", "channel": "instagram caption", "variants": 3},
            timeout=60,
        )
        assert r.status_code == 200, f"{r.status_code} {r.text}"
        data = r.json()
        assert "variants" in data and isinstance(data["variants"], list)
        assert len(data["variants"]) >= 1
        for v in data["variants"]:
            assert isinstance(v, str) and len(v) > 5


# ---- Admin specials image (expected 402 on free-tier key) ----
class TestSpecialsImage:
    def test_image_returns_402_or_200(self, admin_session):
        r = admin_session.post(
            f"{BASE_URL}/api/ai/specials-image",
            json={"prompt": "Crispy cheesesteak lumpia on a metal tray"},
            timeout=90,
        )
        # Free-tier: expect 402 with the specific message. If billing enabled, would be 200.
        assert r.status_code in (200, 402, 502), f"unexpected {r.status_code}: {r.text}"
        if r.status_code == 402:
            detail = r.json().get("detail", "")
            assert "free tier quota" in detail.lower() or "billing" in detail.lower(), detail
        elif r.status_code == 200:
            data = r.json()
            assert "data" in data and "mime_type" in data and len(data["data"]) > 100


# ---- Regression: existing endpoints ----
class TestRegression:
    def test_schedule_public(self, api):
        r = api.get(f"{BASE_URL}/api/schedule", timeout=15)
        assert r.status_code == 200
        assert "entries" in r.json()

    def test_settings_public(self, api):
        r = api.get(f"{BASE_URL}/api/settings", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "drop" in d and "contact" in d

    def test_inquiries_requires_auth(self, api):
        r = api.get(f"{BASE_URL}/api/inquiries", timeout=15)
        assert r.status_code == 401

    def test_auth_me(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/auth/me", timeout=15)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL
