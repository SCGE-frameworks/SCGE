from utils.responses import error_message, success_message
from models import users

def criar_usuario_service(data):
    if not isinstance(data, dict):
        return error_message(
            "Corpo da requisicao deve ser um objeto JSON",
            code="INVALID_BODY",
            status_code=422,
        )

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    if not name or not email or not password:
        return error_message(
            "name, email e password sao obrigatorios",
            code="MISSING_FIELDS",
            status_code=422,
        )

    for user in users:
        if user.get("email") == email:
            return error_message("Email ja cadastrado", code="EMAIL_IN_USE", status_code=400)

    user_id = len(users) + 1
    users.append(
        {
            "id": user_id,
            "name": name,
            "email": email,
            "password": password,
        }
    )
    return success_message(
        "Usuario cadastrado com sucesso",
        {"id": user_id, "name": name, "email": email},
    )
