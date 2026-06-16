# SCGE Backend

FastAPI API for inventory management.

## Structure

```text
backend/
├── app.py              # FastAPI entry point
├── core/               # config, JWT security, API response helpers
├── database/           # SQLAlchemy engine, session, Base
├── models/             # ORM entities (English names)
├── schemas/            # Pydantic request schemas
├── routes/             # HTTP endpoints
└── services/           # business logic
```

## Conventions

- **Code language:** English (classes, fields, endpoints, JSON keys).
- **API envelope:** `{ "success", "message", "data" }`.
- **Soft delete:** `is_active = False`.
- **Models:** each entity exposes `to_dict()` for API responses.
- **No `utils/`:** shared code lives in `core/` and `database/`.

## Run locally

```powershell
cd backend
python -m venv ../.venv
..\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app:app --reload
```

Swagger: `http://127.0.0.1:8000/docs`

## Database reset

After model changes, delete the local SQLite file and restart the API:

```powershell
Remove-Item scge.db -ErrorAction SilentlyContinue
python -m uvicorn app:app --reload
```

## Main endpoints

| Resource   | Prefix        |
|-----------|---------------|
| Auth      | `/auth`       |
| Users     | `/users`      |
| Roles     | `/roles`      |
| Categories| `/categories` |
| Products  | `/products`   |
| Movements | `/movements`  |

Movement routes (`POST /movements/entry`, `/exit`, `/loss`) require `Authorization: Bearer <token>`.
