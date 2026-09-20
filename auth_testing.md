# Auth Testing Playbook — Kayo Mestiza

Credentials in /app/memory/test_credentials.md.

Step 1: MongoDB
```
mongosh
use app
db.users.find({role: "admin"}).pretty()
```
Verify bcrypt hash starts with `$2b$`.

Step 2: API
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@kayomestiza.com","password":"KayoFire2026!"}'
curl -b cookies.txt http://localhost:8001/api/auth/me
curl -b cookies.txt -X PUT http://localhost:8001/api/auth/... # schedule PUT is /api/schedule
curl -X PUT http://localhost:8001/api/schedule -H "Content-Type: application/json" -d '{"entries":[]}'  # expect 401 without cookie
```
Login returns the admin user and sets `access_token` cookie. /me returns the same user. PUT /api/schedule requires the cookie; GET /api/schedule is public.
