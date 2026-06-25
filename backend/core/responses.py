from typing import Optional

from fastapi.responses import JSONResponse


def success_message(message: str, data: Optional[dict] = None):
    return {
        "message": message,
        "success": True,
        "data": data or {},
    }


def error_message(message: str, code: str = "ERROR", status_code: int = 400):
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {"code": code, "message": message},
            "success": False,
        },
    )
