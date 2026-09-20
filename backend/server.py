import asyncio
import os
import logging
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import List, Optional

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, Field, EmailStr
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from lib.db import client, db, ensure_indexes

JWT_ALGORITHM = "HS256"
DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(email: str) -> str:
    payload = {
        "sub": email,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access",
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def seed_admin():
    email = os.environ["ADMIN_EMAIL"].lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": email,
            "password_hash": hash_password(password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc),
        })
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})


PLACEHOLDER_SCHEDULE_LOCATIONS = [
    "Spark Social SF", "Off the Grid: Fort Mason", "SoMa Streat Food Park", "Oakland First Fridays",
    "TreasureFest", "Undiscovered SF", "Kitchen Prep Day", "Downtown Caroline Street", "Central Park",
    "Riverfront Park", "Hurkamp Park", "Spotsylvania Towne Centre", "Old Town Farmers Market",
]


async def seed_schedule():
    # No auto-seeded locations: the site shows "no pop-ups announced yet" until the owner adds
    # approved spots in /admin. This clears the earlier placeholder venues once.
    await db.schedule.delete_many({"location": {"$in": PLACEHOLDER_SCHEDULE_LOCATIONS}})


async def seed_settings():
    if await db.settings.find_one({"key": "site"}) is None:
        await db.settings.insert_one({"key": "site", **SiteSettings().model_dump()})


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())
    await seed_admin()
    await seed_schedule()
    await seed_settings()
    yield
    client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class AdminUser(BaseModel):
    id: str
    email: str
    name: str
    role: str


class ScheduleEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    day: str
    time: str
    location: str
    address: str = ""
    note: str = ""
    closed: bool = False


class ScheduleEntryInput(BaseModel):
    day: str
    time: str
    location: str
    address: str = ""
    note: str = ""
    closed: bool = False


class ScheduleResponse(BaseModel):
    entries: List[ScheduleEntry]


class ScheduleUpdate(BaseModel):
    entries: List[ScheduleEntryInput]


class InquiryCreate(BaseModel):
    type: str
    name: str
    email: EmailStr
    phone: str = ""
    message: str
    event_date: Optional[str] = None
    guests: Optional[int] = None
    package: Optional[str] = None


class Inquiry(InquiryCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DropSettings(BaseModel):
    enabled: bool = True
    drop_at: Optional[str] = None  # ISO 8601 datetime; null => "coming soon" waitlist mode (no timer)
    overline: str = "Opening Soon"
    item_name: str = ""
    subtitle: str = "Kayo Mestiza is firing up its first pop-up. Join the list and you'll be the first to know the date, the spot, and the menu."
    location_note: str = "Fredericksburg, VA \u2605 Locations announced to the list first"


class ContactSettings(BaseModel):
    phone_display: str = "826-272-5555"
    phone_number: str = "+18262725555"  # digits with country code, no prefix
    email: str = "eats@kayomestiza.com"
    instagram: str = ""
    facebook: str = ""
    tiktok: str = ""


class SiteSettings(BaseModel):
    drop: DropSettings = Field(default_factory=DropSettings)
    contact: ContactSettings = Field(default_factory=ContactSettings)


async def get_current_admin(request: Request) -> AdminUser:
    token = request.cookies.get("access_token")
    auth = request.headers.get("Authorization", "")
    if not token and auth.startswith("Bearer "):
        token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"email": payload["email"]})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Not authorized")
    return AdminUser(id=user["id"], email=user["email"], name=user.get("name", "Admin"), role="admin")


@api_router.get("/")
async def root():
    return {"message": "KAYO MESTIZA API"}


@api_router.post("/auth/login", response_model=AdminUser)
async def login(body: LoginBody, response: Response):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(email)
    response.set_cookie(
        key="access_token", value=token, httponly=True, secure=True,
        samesite="none", max_age=86400, path="/",
    )
    return AdminUser(id=user["id"], email=email, name=user.get("name", "Admin"), role="admin")


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/", secure=True, samesite="none")
    return {"ok": True}


@api_router.get("/auth/me", response_model=AdminUser)
async def me(admin: AdminUser = Depends(get_current_admin)):
    return admin


@api_router.get("/schedule", response_model=ScheduleResponse)
async def get_schedule():
    docs = await db.schedule.find().to_list(100)
    entries = [ScheduleEntry(**{k: v for k, v in d.items() if k != "_id"}) for d in docs]
    entries.sort(key=lambda e: DAY_ORDER.index(e.day) if e.day in DAY_ORDER else 99)
    return ScheduleResponse(entries=entries)


@api_router.put("/schedule", response_model=ScheduleResponse)
async def update_schedule(body: ScheduleUpdate, admin: AdminUser = Depends(get_current_admin)):
    await db.schedule.delete_many({})
    await db.schedule.insert_many([{**e.model_dump(), "id": str(uuid.uuid4())} for e in body.entries])
    return await get_schedule()


@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(body: InquiryCreate):
    inquiry = Inquiry(**body.model_dump())
    await db.inquiries.insert_one(inquiry.model_dump())
    return inquiry


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries(admin: AdminUser = Depends(get_current_admin)):
    docs = await db.inquiries.find().sort("created_at", -1).to_list(500)
    out = []
    for d in docs:
        d.pop("_id", None)
        if isinstance(d.get("created_at"), datetime) and d["created_at"].tzinfo is None:
            d["created_at"] = d["created_at"].replace(tzinfo=timezone.utc)
        out.append(Inquiry(**d))
    return out


@api_router.get("/settings", response_model=SiteSettings)
async def get_settings():
    doc = await db.settings.find_one({"key": "site"})
    if doc is None:
        settings = SiteSettings()
        await db.settings.insert_one({"key": "site", **settings.model_dump()})
        return settings
    return SiteSettings(**{k: v for k, v in doc.items() if k in ("drop", "contact")})


@api_router.put("/settings", response_model=SiteSettings)
async def update_settings(body: SiteSettings, admin: AdminUser = Depends(get_current_admin)):
    await db.settings.update_one({"key": "site"}, {"$set": body.model_dump()}, upsert=True)
    return body


class ConciergeMenuItem(BaseModel):
    name: str
    description: str = ""
    price: Optional[float] = None
    category: str = ""
    tags: List[str] = []
    heat: int = 0


class ConciergeRequest(BaseModel):
    session_id: str = Field(min_length=6, max_length=80)
    message: str = Field(min_length=1, max_length=800)
    menu: List[ConciergeMenuItem] = Field(min_length=1, max_length=200)


class ConciergeResponse(BaseModel):
    answer: str


class CopyRequest(BaseModel):
    subject: str = Field(min_length=2, max_length=300)
    channel: str = Field(default="instagram caption", max_length=60)
    tone: str = Field(default="bold 90s streetwear hype", max_length=80)
    variants: int = Field(default=3, ge=1, le=5)


class CopyResponse(BaseModel):
    variants: List[str]


class ImageRequest(BaseModel):
    prompt: str = Field(min_length=3, max_length=1200)


class ImageResponse(BaseModel):
    mime_type: str
    data: str


CONCIERGE_SYSTEM = (
    "You are the KAYO MESTIZA menu concierge — the voice of a Blasian (Black x Filipino) "
    "fire & street eats food truck. Tone: bold, warm, street-smart, 90s streetwear energy. "
    "Answer ONLY from the MENU JSON and SCHEDULE JSON provided. Never invent items, prices, "
    "ingredients, locations or hours. If something is not in the data, say you don't have it and "
    "suggest the closest real item. Keep replies under 90 words, no markdown headings, no bullet "
    "spam — 1 short paragraph plus at most 3 short lines. Always end by nudging them to call or "
    "text the truck to order."
)


def gemini_client():
    from google import genai

    return genai.Client(api_key=os.environ["GEMINI_API_KEY"])


async def gemini_text(prompt: str, system: str, max_tokens: int = 2048) -> str:
    from google.genai import types

    client = gemini_client()
    config = types.GenerateContentConfig(system_instruction=system, max_output_tokens=max_tokens)
    models = [m.strip() for m in os.environ["GEMINI_TEXT_MODELS"].split(",") if m.strip()]
    last_exc: Exception | None = None
    for attempt, model in enumerate(models):
        try:
            response = await client.aio.models.generate_content(model=model, contents=prompt, config=config)
        except Exception as exc:  # 503/429 on the newest model: fall back to the previous flash
            logger.warning("gemini text failed on %s: %s", model, type(exc).__name__)
            last_exc = exc
            await asyncio.sleep(1.5 * (attempt + 1))
            continue
        text = (response.text or "").strip()
        if text:
            return text
        last_exc = HTTPException(status_code=502, detail="AI returned an empty answer")
    raise HTTPException(status_code=502, detail=f"AI unavailable: {type(last_exc).__name__}")


@api_router.post("/ai/concierge", response_model=ConciergeResponse)
async def ai_concierge(body: ConciergeRequest):
    doc = await db.ai_chats.find_one({"session_id": body.session_id})
    history = (doc or {}).get("messages", [])[-10:]

    schedule = await get_schedule()
    transcript = "\n".join(f"{m['role'].upper()}: {m['text']}" for m in history)
    prompt = (
        f"MENU JSON:\n{[i.model_dump() for i in body.menu]}\n\n"
        f"SCHEDULE JSON:\n{[e.model_dump(exclude={'id'}) for e in schedule.entries]}\n\n"
        f"CONVERSATION SO FAR:\n{transcript or '(new conversation)'}\n\n"
        f"CUSTOMER: {body.message}"
    )
    answer = await gemini_text(prompt, CONCIERGE_SYSTEM, max_tokens=1024)
    answer = answer.replace("**", "").replace("##", "").strip()

    now = datetime.now(timezone.utc)
    await db.ai_chats.update_one(
        {"session_id": body.session_id},
        {
            "$push": {"messages": {"$each": [
                {"role": "user", "text": body.message, "at": now},
                {"role": "assistant", "text": answer, "at": now},
            ]}},
            "$set": {"updated_at": now},
            "$setOnInsert": {"id": str(uuid.uuid4()), "created_at": now},
        },
        upsert=True,
    )
    return ConciergeResponse(answer=answer)


@api_router.post("/ai/copy", response_model=CopyResponse)
async def ai_copy(body: CopyRequest, admin: AdminUser = Depends(get_current_admin)):
    prompt = (
        f"Write {body.variants} distinct {body.channel} options for KAYO MESTIZA, a Blasian "
        f"(Black x Filipino) fire & street eats food truck. Tone: {body.tone}. "
        "Keep every option punchy and under 45 words. Do not invent prices or locations. "
        "Return ONLY the options, one per line, each prefixed with '- '. No preamble.\n\n"
        f"SUBJECT / BRIEF: {body.subject}"
    )
    raw = await gemini_text(
        prompt,
        "You are a senior streetwear-brand copywriter for food trucks. Voice: bold, rhythmic, "
        "graffiti-poster energy. No corporate filler, no emoji spam.",
    )
    variants = [line.lstrip("-•* ").strip() for line in raw.splitlines() if line.strip()]
    variants = [v for v in variants if len(v) > 3][: body.variants]
    return CopyResponse(variants=variants or [raw])


@api_router.post("/ai/specials-image", response_model=ImageResponse)
async def ai_specials_image(body: ImageRequest, admin: AdminUser = Depends(get_current_admin)):
    import base64

    from google.genai import types

    client = gemini_client()
    styled = (
        f"{body.prompt}. Editorial food-truck photography for a Blasian street-food brand: "
        "dramatic hard light, charred textures, steam, moody dark background with flame-orange and "
        "gold accents, shallow depth of field, ultra appetizing, square composition, no text overlay."
    )
    config = types.GenerateContentConfig(response_modalities=["IMAGE"])
    models = [os.environ["GEMINI_IMAGE_MODEL"], os.environ["GEMINI_IMAGE_FALLBACK_MODEL"]]
    quota_blocked = False
    for model in models:
        try:
            response = await client.aio.models.generate_content(model=model, contents=styled, config=config)
        except Exception as exc:
            logger.warning("gemini image failed on %s: %s", model, str(exc)[:200])
            quota_blocked = quota_blocked or "RESOURCE_EXHAUSTED" in str(exc)
            continue
        for part in response.parts or []:
            if part.inline_data is not None:
                raw = part.inline_data.data
                encoded = base64.b64encode(raw).decode() if isinstance(raw, bytes) else raw
                return ImageResponse(mime_type=part.inline_data.mime_type or "image/png", data=encoded)
    if quota_blocked:
        raise HTTPException(
            status_code=402,
            detail="Gemini image models aren't included in your key's free tier quota. Enable billing on the Google Cloud project behind your AI Studio key to switch this on.",
        )
    raise HTTPException(status_code=502, detail="AI returned no image")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
