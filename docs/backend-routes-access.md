# Mapeamento de rotas e níveis de acesso — SCGE API

Referência para implementar e revisar o controle de acesso do backend.

**Base URL:** `http://127.0.0.1:8000`  
**Autenticação:** JWT no header `Authorization: Bearer <token>`

---

## Níveis de acesso (`AccessLevels`)

Definidos em `backend/models/role.py`. São **fixos no sistema** — o admin escolhe o nível ao criar o cargo, mas não inventa novos valores.


| Nível      | Valor | Descrição                                             |
| ---------- | ----- | ----------------------------------------------------- |
| `VIEWER`   | 1     | Somente consulta (leitura)                            |
| `OPERATOR` | 2     | Opera o estoque (movimentações)                       |
| `MANAGER`  | 3     | Gerencia cadastros (produtos e categorias)            |
| `ADMIN`    | 4     | Administra usuários, cargos e configurações sensíveis |


**Regra de autorização:** o usuário acessa a rota se `role.access_level >= nível exigido`.

Exemplo: um `MANAGER` (3) pode acessar rotas que exigem `VIEWER`, `OPERATOR` ou `MANAGER`, mas não rotas `ADMIN`.

**Guard no código:** `require_min_access_level(AccessLevels.X)` em `backend/core/security.py`.

---

## Legenda das colunas


| Coluna                | Significado                             |
| --------------------- | --------------------------------------- |
| **Nível recomendado** | Mínimo sugerido para a rota             |
| **Auth hoje**         | O que está implementado no código atual |
| 🔓                    | Público (sem token)                     |
| 🔒                    | Autenticado (qualquer usuário logado)   |
| `VIEWER` … `ADMIN`    | Exige esse nível ou superior            |


---

## Autenticação — `/auth`


| Método | Rota                    | O que faz                   | Nível recomendado | Auth hoje      |
| ------ | ----------------------- | --------------------------- | ----------------- | -------------- |
| POST   | `/auth/login`           | Login; retorna token JWT    | 🔓 Público        | 🔓 Público     |
| POST   | `/auth/register`        | Cadastra novo usuário       | `ADMIN`           | `ADMIN`        |
| GET    | `/auth/me`              | Dados do usuário logado     | `VIEWER`          | 🔒 Autenticado |
| POST   | `/auth/logout`          | Confirma logout             | `VIEWER`          | 🔒 Autenticado |
| POST   | `/auth/forgot-password` | Recuperação de senha (stub) | 🔓 Público        | 🔓 Público     |


> **Nota:** `/auth/register` com nível `ADMIN` evita cadastro público de usuários. Alternativa aceitável: manter registro público apenas na primeira instalação (seed).

---

## Usuários — `/users`


| Método | Rota               | O que faz                      | Nível recomendado | Auth hoje      |
| ------ | ------------------ | ------------------------------ | ----------------- | -------------- |
| GET    | `/users/`          | Lista usuários ativos          | `ADMIN`           | 🔒 Autenticado |
| GET    | `/users/{user_id}` | Busca usuário por ID           | `ADMIN`           | 🔒 Autenticado |
| POST   | `/users/`          | Cria usuário                   | `ADMIN`           | 🔒 Autenticado |
| PUT    | `/users/{user_id}` | Atualiza usuário               | `ADMIN`           | 🔒 Autenticado |
| DELETE | `/users/{user_id}` | Desativa usuário (soft delete) | `ADMIN`           | 🔒 Autenticado |


---

## Cargos (perfis) — `/roles`


| Método | Rota               | O que faz           | Nível recomendado | Auth hoje      |
| ------ | ------------------ | ------------------- | ----------------- | -------------- |
| GET    | `/roles/`          | Lista cargos ativos | `ADMIN`           | 🔒 Autenticado |
| POST   | `/roles/`          | Cria cargo          | `ADMIN`           | 🔒 Autenticado |
| PUT    | `/roles/{role_id}` | Atualiza cargo      | `ADMIN`           | 🔒 Autenticado |
| DELETE | `/roles/{role_id}` | Desativa cargo      | `ADMIN`           | 🔒 Autenticado |


> **Sugestão opcional:** permitir `GET /roles/` para `MANAGER` (somente leitura), se precisar preencher selects ao criar usuário sem dar acesso à gestão de perfis.

---

## Categorias — `/categories`


| Método | Rota                        | O que faz               | Nível recomendado | Auth hoje      |
| ------ | --------------------------- | ----------------------- | ----------------- | -------------- |
| GET    | `/categories/`              | Lista categorias ativas | `VIEWER`          | 🔒 Autenticado |
| GET    | `/categories/{category_id}` | Busca categoria por ID  | `VIEWER`          | 🔒 Autenticado |
| POST   | `/categories/`              | Cria categoria          | `MANAGER`         | 🔒 Autenticado |
| PUT    | `/categories/{category_id}` | Atualiza categoria      | `MANAGER`         | 🔒 Autenticado |
| DELETE | `/categories/{category_id}` | Desativa categoria      | `MANAGER`         | 🔒 Autenticado |


---

## Produtos — `/products`


| Método | Rota                     | O que faz             | Nível recomendado | Auth hoje      |
| ------ | ------------------------ | --------------------- | ----------------- | -------------- |
| GET    | `/products/`             | Lista produtos ativos | `VIEWER`          | 🔒 Autenticado |
| GET    | `/products/{product_id}` | Busca produto por ID  | `VIEWER`          | 🔒 Autenticado |
| POST   | `/products/`             | Cria produto          | `MANAGER`         | 🔒 Autenticado |
| PUT    | `/products/{product_id}` | Atualiza produto      | `MANAGER`         | 🔒 Autenticado |
| DELETE | `/products/{product_id}` | Desativa produto      | `MANAGER`         | 🔒 Autenticado |


---

## Movimentações — `/movements`


| Método | Rota                       | O que faz                 | Nível recomendado | Auth hoje      |
| ------ | -------------------------- | ------------------------- | ----------------- | -------------- |
| GET    | `/movements/`              | Lista movimentações       | `VIEWER`          | 🔒 Autenticado |
| GET    | `/movements/{movement_id}` | Busca movimentação por ID | `VIEWER`          | 🔒 Autenticado |
| POST   | `/movements/entry`         | Entrada de estoque        | `OPERATOR`        | 🔒 Autenticado |
| POST   | `/movements/exit`          | Saída de estoque          | `OPERATOR`        | 🔒 Autenticado |
| POST   | `/movements/loss`          | Perda / ajuste negativo   | `OPERATOR`        | 🔒 Autenticado |


---

## Relatórios — `/reports`


| Método | Rota                 | O que faz                     | Nível recomendado | Auth hoje      |
| ------ | -------------------- | ----------------------------- | ----------------- | -------------- |
| GET    | `/reports/low-stock` | Produtos com estoque ≤ mínimo | `VIEWER`          | 🔒 Autenticado |


---

## Resumo por recurso


| Recurso              | Leitura (GET) | Escrita (POST/PUT/DELETE) |
| -------------------- | ------------- | ------------------------- |
| Auth (login, forgot) | 🔓 Público    | —                         |
| Auth (me, logout)    | `VIEWER`      | —                         |
| Auth (register)      | —             | `ADMIN`                   |
| Usuários             | `ADMIN`       | `ADMIN`                   |
| Cargos               | `ADMIN`       | `ADMIN`                   |
| Categorias           | `VIEWER`      | `MANAGER`                 |
| Produtos             | `VIEWER`      | `MANAGER`                 |
| Movimentações        | `VIEWER`      | `OPERATOR`                |
| Relatórios           | `VIEWER`      | —                         |


---

## Cargos padrão sugeridos (seed)


| Nome do cargo (exemplo) | `access_level` | Uso típico                             |
| ----------------------- | -------------- | -------------------------------------- |
| Administrador           | `ADMIN` (4)    | TI, gestão do sistema                  |
| Gerente de Estoque      | `MANAGER` (3)  | Cadastros e configuração de itens      |
| Operador                | `OPERATOR` (2) | Entradas, saídas e perdas              |
| Consulta                | `VIEWER` (1)   | Auditoria e relatórios somente leitura |


O **nome** do cargo é livre; o **nível** é o que define as permissões.

---

## Como aplicar nas rotas

Exemplo para rota que exige `MANAGER` ou superior:

```python
from fastapi import Depends
from core.security import require_min_access_level
from models.role import AccessLevels

@router.post(
    "/",
    dependencies=[Depends(require_min_access_level(AccessLevels.MANAGER))],
)
def create_product(...):
    ...
```

Exemplo para proteger o router inteiro (ex.: `/users`):

```python
router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[
        Depends(get_current_user),
        Depends(require_min_access_level(AccessLevels.ADMIN)),
    ],
)
```

---

## Status da implementação


| Item                       | Situação                                                                |
| -------------------------- | ----------------------------------------------------------------------- |
| Enum `AccessLevels`        | ✅ Implementado                                                          |
| `require_min_access_level` | ✅ Implementado                                                          |
| `POST /auth/register`      | ✅ Protegido com `ADMIN`                                                 |
| Demais rotas               | ⚠️ Apenas autenticação (`get_current_user`); níveis ainda não aplicados |


---

## Checklist para concluir o controle de acesso

- [ ] Aplicar `require_min_access_level` em cada rota conforme tabelas acima
- [ ] Incluir `access_level` no `Role.to_dict()` e em `/auth/me`
- [ ] Criar seed com cargos padrão (`Administrador`, `Operador`, etc.)
- [ ] Atualizar frontend para usar `access_level` em vez do nome fixo `"Administrador"`
- [ ] Garantir que sempre exista pelo menos um usuário `ADMIN` ativo

---

*Documento gerado para o projeto SCGE — IFMS, 2026.*