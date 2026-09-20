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


DEFAULT_SCHEDULE = [
    {"day": "Monday", "time": "CLOSED", "location": "Kitchen Prep Day", "address": "", "note": "Restocking the fire. See you Tuesday.", "closed": True},
    {"day": "Tuesday", "time": "5:00 PM - 10:00 PM", "location": "Spark Social SF", "address": "601 Mission Bay Blvd N, San Francisco, CA", "note": "Taco Tuesday: Adobo Tacos $2 off", "closed": False},
    {"day": "Wednesday", "time": "5:00 PM - 10:00 PM", "location": "Off the Grid: Fort Mason", "address": "2 Marina Blvd, San Francisco, CA", "note": "", "closed": False},
    {"day": "Thursday", "time": "11:30 AM - 2:30 PM", "location": "SoMa Streat Food Park", "address": "428 11th St, San Francisco, CA", "note": "Lunch rush only", "closed": False},
    {"day": "Friday", "time": "5:00 PM - 11:00 PM", "location": "Oakland First Fridays", "address": "Telegraph Ave, Oakland, CA", "note": "Late-night lumpia drop", "closed": False},
    {"day": "Saturday", "time": "12:00 PM - 9:00 PM", "location": "TreasureFest", "address": "Treasure Island, San Francisco, CA", "note": "Full menu + Turon Magic all day", "closed": False},
    {"day": "Sunday", "time": "11:00 AM - 4:00 PM", "location": "Undiscovered SF", "address": "888 Brannan St, San Francisco, CA", "note": "Hummingbird Cassava Cake while it lasts", "closed": False},
]


async def seed_schedule():
    if await db.schedule.count_documents({}) == 0:
        await db.schedule.insert_many([{**e, "id": str(uuid.uuid4())} for e in DEFAULT_SCHEDULE])


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())
    await seed_admin()
    await seed_schedule()
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
