# Auditoria de completude — Backend SCGE

Documento de análise do backend FastAPI do SCGE: o que está pronto, o que falta, inconsistências entre camadas e itens a padronizar para considerar o backend **completo** para uso acadêmico e integração com o frontend.

**Data da análise:** junho/2026  
**Escopo:** `backend/` (models, schemas, routes, services, core, database, docs)

---

## 1. Resumo executivo

| Área | Situação | Completude estimada |
|------|----------|---------------------|
| CRUD principal (usuários, cargos, categorias, produtos, movimentações) | Implementado | ~90% |
| Autenticação JWT | Implementado | ~85% |
| RBAC hierárquico (`AccessLevels`) | Implementado nas rotas | ~80% |
| Bootstrap / seed inicial | **Não implementado** | 0% |
| Recuperação de senha | **Stub** | ~5% |
| Relatórios | 1 endpoint; lógica na rota | ~40% |
| Padronização de código e imports | **Inconsistente** | ~60% |
| Documentação alinhada ao código | Parcialmente desatualizada | ~65% |
| Infraestrutura (migrations, Postgres) | Apenas SQLite + `create_all` | ~50% |

**Conclusão:** o backend tem a **estrutura e os fluxos principais** de um sistema de estoque, mas **não está completo para produção nem para primeiro deploy “limpo”** sem intervenção manual no banco. Os bloqueadores mais graves são: **seed/bootstrap**, **imports quebrados em `security.py`**, **código legado (`require_role`)** e **documentação desatualizada**.

---

## 2. O que já está bem implementado

### 2.1 Arquitetura em camadas

Padrão consistente em quase todo o projeto:

```text
routes/  →  services/  →  models/ + schemas/
                ↓
         core/responses.py (envelope JSON)
         core/security.py (JWT + RBAC)
```

- Rotas finas, delegando lógica aos services.
- Soft delete via `is_active = False` em User, Role, Category, Product.
- Envelope de API padronizado: `{ success, message, data }` / `{ success, error }`.

### 2.2 Recursos HTTP registrados

Todos os routers estão incluídos em `app.py`:

| Prefixo | Recurso | Status |
|---------|---------|--------|
| `/auth` | Autenticação | Ativo |
| `/users` | Usuários | Ativo |
| `/roles` | Cargos / perfis | Ativo |
| `/categories` | Categorias | Ativo |
| `/products` | Produtos | Ativo |
| `/movements` | Movimentações | Ativo |
| `/reports` | Relatórios | Ativo |

### 2.3 RBAC hierárquico

- Enum `AccessLevels`: `VIEWER(1)` → `OPERATOR(2)` → `MANAGER(3)` → `ADMIN(4)`.
- Coluna `access_level` no model `Role`.
- Guard `require_min_access_level()` aplicado nas rotas conforme `docs/backend-routes-access.md`.
- Login e `/auth/me` retornam `role_name` e `access_level` via `_user_to_dict()`.
- `POST /auth/register` exige `ADMIN`.

### 2.4 Regras de negócio relevantes

- Movimentações alteram `Product.quantity` (ENTRY soma; EXIT/LOSS subtraem).
- Validação de estoque insuficiente em saídas/perdas.
- Produto exige categoria ativa.
- Categoria inativa pode ser reativada ao criar com mesmo nome (comportamento documentado no service).

### 2.5 Configuração obrigatória

Em `core/config.py`:

- `DATABASE_URL` — obrigatório (RuntimeError se ausente).
- `SECRET_KEY` — obrigatório (RuntimeError se ausente).

---

## 3. Bloqueadores críticos (impedem uso “do zero”)

### 3.1 Ausência de seed / bootstrap

**Problema:** em banco vazio:

1. Não existem cargos nem usuários.
2. `POST /auth/login` falha (sem usuário).
3. `POST /auth/register`, `POST /users/`, `POST /roles/` exigem `ADMIN`.
4. **Impossível usar a API** sem inserir dados manualmente no SQLite.

**O que falta:**

- Script ou função de seed em `app.py` / `database/seed.py` que crie:
  - Cargos padrão: Administrador (`ADMIN`), Gerente (`MANAGER`), Operador (`OPERATOR`), Consulta (`VIEWER`).
  - Pelo menos 1 usuário admin (ex.: `admin@scge.com`).
- Opcional: endpoint de “primeira instalação” ou registro público **apenas** quando não há usuários no banco.

**Prioridade:** 🔴 Crítica

---

### 3.2 Imports inconsistentes (`backend.*` vs `core.*`)

**Problema:** o README manda rodar com `cd backend && uvicorn app:app`. Nesse modo, `backend` **não é pacote Python** (não há `backend/__init__.py` na raiz do módulo como pacote instalável).

Arquivos com imports problemáticos:

| Arquivo | Import | Risco |
|---------|--------|-------|
| `core/security.py` | `from backend.core import error_message` | `ModuleNotFoundError` |
| `core/security.py` | `from backend.models.role import AccessLevels` | `ModuleNotFoundError` |
| `routes/user_routes.py` | `from backend.core.security import require_min_access_level` | Inconsistente com demais rotas |

Demais arquivos usam `from core import ...` e `from models import ...` — padrão correto para execução em `backend/`.

**O que falta:**

- Padronizar **100%** para imports relativos ao cwd `backend/`:
  - `from core import ...`
  - `from models import AccessLevels, ...`
- Remover todos os `from backend.*`.

**Prioridade:** 🔴 Crítica (pode impedir subida da API)

---

### 3.3 Bug em `require_min_access_level` quando cargo não existe

```python
# core/security.py — trecho atual
if not role:
    return error_message("Role not found", ...)  # retorna JSONResponse
```

Dependencies do FastAPI devem **`raise HTTPException`**, não retornar `JSONResponse`. Retornar response pode fazer `current_user` virar um objeto de resposta e quebrar handlers que esperam `User`.

**O que falta:**

- Trocar por `raise HTTPException(status_code=404, detail="Role not found")`.
- Validar também `role.is_active` (cargo desativado ainda autoriza hoje).

**Prioridade:** 🔴 Alta

---

## 4. Funcionalidades incompletas ou stub

### 4.1 Autenticação

| Endpoint | Status | Detalhe |
|----------|--------|---------|
| `POST /auth/login` | ✅ Completo | Retorna token + `user` com `access_level` |
| `GET /auth/me` | ✅ Completo | Retorna usuário enriquecido |
| `POST /auth/logout` | ⚠️ Cosmético | JWT stateless; token continua válido até expirar |
| `POST /auth/register` | ✅ Protegido | Duplica `POST /users/` — decidir se mantém os dois |
| `POST /auth/forgot-password` | ❌ Stub | Corpo da função é `pass`; retorna `null` |
| Reset de senha | ❌ Inexistente | Frontend tem `/reset-password`; backend não tem rota |

**O que falta para auth “completa”:**

- Implementar fluxo forgot/reset (e-mail ou token temporário) **ou** remover rotas/documentação até existir.
- Unificar códigos HTTP de login (hoje 404 para usuário inexistente vs 401 para senha errada — pode vazar informação).
- Considerar retornar sempre 401 com mensagem genérica “Invalid credentials”.

**Prioridade:** 🟡 Média (auth básica funciona; recuperação de senha não)

---

### 4.2 Relatórios e alertas

| Item | Status |
|------|--------|
| `GET /reports/low-stock` | ✅ Implementado na rota |
| Service dedicado (`report_services.py`) | ❌ Lógica inline na rota |
| `GET /notifications/stock-alerts` | ❌ Não existe |
| Flag `low_stock` em `Product.to_dict()` | ❌ Removida / nunca adicionada de forma persistente |
| Outros relatórios (movimentação por período, estoque parado, etc.) | ❌ Não existem |

**O que falta:**

- Extrair lógica para `services/report_services.py`.
- Opcional bônus: endpoint de alertas + `low_stock` calculado no `to_dict()`.
- Documentar `/reports` no `backend/README.md`.

**Prioridade:** 🟡 Média

---

### 4.3 Gestão de cargos — regras de proteção

**Implementado:** CRUD com `access_level` no schema e services.

**Falta:**

- Impedir desativar o **último** cargo/usuário `ADMIN`.
- Impedir rebaixar ou desativar cargo ainda vinculado a usuários sem validação clara.
- Impedir excluir categoria com produtos ativos (hoje soft delete sem checagem).
- Impedir excluir cargo com usuários ativos.

**Prioridade:** 🟡 Média

---

## 5. Inconsistências entre camadas

### 5.1 Models vs Schemas

| Entidade | Model | Schema | Gap |
|----------|-------|--------|-----|
| Role | `access_level` obrigatório | `RoleCreate` com `access_level` | ✅ Alinhado |
| Role | — | Sem `RoleUpdate` parcial | Usa `RoleCreate` no PUT |
| User | `is_active` | `UserCreate`/`UserUpdate` sem `is_active` | Desativar só via DELETE |
| Category | `is_active` | Schemas sem `is_active` | Service reativa por nome |
| Product | `name` unique | Service só valida `code` duplicado | **Risco de erro 500** no commit se nome repetir |
| Movement | `type` no model | Tipo vem da rota (`/entry`, etc.) | ✅ Intencional |

**O que falta:**

- Validar `name` duplicado em `product_services` (create e update).
- Alinhar regras de `min_length` (Category exige 3 chars; Product exige 1).
- Schemas de resposta Pydantic (opcional, mas padronizaria contrato OpenAPI).

---

### 5.2 Models — `to_dict()` e serialização

| Model | `to_dict()` | Observação |
|-------|-------------|------------|
| Role | Inclui `access_level` como int | ✅ |
| User | `role_name`, `access_level` via service | ✅ |
| Product | Sem `low_stock` calculado | Frontend recalcula ou usa relatório |
| Product / Movement | `created_at` / `movement_date` como objeto datetime | JSON pode serializar inconsistente; ideal ISO string |
| Category | Completo | OK |

**O que falta:**

- Padronizar datas como string ISO em todos os `to_dict()`.
- Decidir se `low_stock` entra no produto na API global.

---

### 5.3 Services — padrões de erro

Comportamento **inconsistente** para listas vazias:

| Service | Lista vazia |
|---------|-------------|
| `list_products_service` | 200 + lista vazia |
| `list_categories_service` | 200 + lista vazia |
| `list_movements_service` | **404** "No movements found" |
| `get_users_service` | **404** "No users found" |
| `role_list_service` | 200 + lista vazia |

**Recomendação:** padronizar para **200 + lista vazia** (REST comum) ou documentar exceções.

**Transações:** apenas `movement_service` usa `try/except` + `rollback`; demais services confiam no commit direto.

---

### 5.4 Routes — padrões de proteção

| Padrão | Rotas que seguem | Exceção |
|--------|------------------|---------|
| Router com `dependencies=[Depends(get_current_user)]` | users, roles, categories, products, movements | reports usa só `require_min_access_level` |
| `require_min_access_level` por endpoint | Maioria | auth: login/forgot públicos |
| Lógica de negócio no service | Maioria | **reports: query na rota** |

**Duplicação:** `report_routes` aplica `require_min_access_level(VIEWER)` no router **e** na rota.

**Import inconsistente:** `user_routes.py` usa `backend.core.security`; demais usam `from core import require_min_access_level`.

---

## 6. Código legado e dead code

### 6.1 `require_role()` em `role_services.py`

- Espera `current_user` como `dict` com `user_id`.
- `get_current_user` retorna `User` ORM.
- **Nunca usado** em nenhuma rota.
- Substituído por `require_min_access_level`.

**Ação:** remover `require_role` e export em `services/__init__.py`.

---

### 6.2 `routes/__init__.py` — `__all__` incompleto

`reports_router` é importado, mas **não está** em `__all__`:

```python
__all__ = [
    "auth_router",
    ...
    "users_router",
    # falta "reports_router"
]
```

---

### 6.3 Duplicação de criação de usuário

- `POST /auth/register` → `create_user_service`
- `POST /users/` → `create_user_service`

Decidir: manter só `/users` (admin) ou documentar diferença de propósito.

---

## 7. Segurança — itens pendentes

| Item | Status | Recomendação |
|------|--------|--------------|
| SECRET_KEY obrigatória | ✅ | Adicionar rejeição de placeholder (`change_this_secret_key_in_production`) |
| RBAC nas rotas | ✅ | — |
| Cargo inativo ainda autoriza | ❌ | Filtrar `Role.is_active` no guard |
| Último admin protegido | ❌ | Validar em update/delete user e role |
| JWT expiration | ✅ 60 min hardcoded | Tornar configurável via `.env` |
| `datetime.utcnow()` no token | ⚠️ Deprecated | Usar `datetime.now(timezone.utc)` |
| CORS | Hardcoded localhost:5173 | Configurável para deploy |
| Rate limit / brute force login | ❌ | Fora de escopo acadêmico, opcional |
| Validação global Pydantic → envelope | ❌ | Erros 422 vêm no formato FastAPI, não no envelope `{ error }` |

---

## 8. Banco de dados e infraestrutura

### 8.1 Migrations

- Apenas `Base.metadata.create_all()` no startup.
- Sem Alembic.
- Mudança de schema = apagar `.db` manualmente.

**O que falta para evolução segura:**

- Alembic ou script de migration documentado.
- Versionamento de schema.

---

### 8.2 Nome do arquivo SQLite

| Fonte | Nome sugerido |
|-------|---------------|
| `.env.example` / `.env` | `scge.db` |
| `config.py` (mensagem de erro) | `database.db` |
| `README.md` (reset) | `scge.db` |

**Ação:** unificar para **`scge.db`** em todos os lugares.

---

### 8.3 PostgreSQL (futuro)

- `.env.example` comenta URL Postgres + `psycopg2`.
- `requirements.txt` **não inclui** driver Postgres.
- `create_engine(..., connect_args={"check_same_thread": False})` é **específico SQLite**.

**O que falta para Postgres:**

- `psycopg2-binary` ou `psycopg[binary]`.
- `connect_args` condicional por driver.
- Testes de conexão documentados.

---

### 8.4 Relacionamentos ORM

- Apenas FKs; sem `relationship()` no SQLAlchemy.
- Joins manuais nos services (funciona, mas verboso).

**Opcional:** adicionar relationships para simplificar queries e eager loading.

---

## 9. Documentação desatualizada

| Documento | Problema |
|-----------|----------|
| `docs/backend-routes-access.md` | Seção “Status” diz que rotas só têm `get_current_user` — **falso** após RBAC |
| `docs/backend-routes-access.md` | Checklist desatualizado (`access_level` em `/auth/me` já feito) |
| `docs/backend-class-diagram.md` | Diagrama de `Role` sem `access_level`; User sem `access_level` no `to_dict` |
| `backend/README.md` | Falta `/reports`; não menciona RBAC nem seed |
| `backend/README.md` | Não documenta variáveis `.env` obrigatórias de forma explícita |

**Ação:** revisar os três docs após fechar itens críticos.

---

## 10. Nomenclatura e padronização

| Item | Situação atual | Padrão sugerido |
|------|----------------|-----------------|
| Arquivo de service | `movement_service.py` (singular) | `movement_services.py` (plural, como os outros) |
| Nome de handler em product routes | `get_product_by_id` | `get_product` (como category) |
| Imports em routes | Mistura `core` e `backend.core` | Sempre `from core import ...` |
| Resposta de movimentação | `{ movement_id, product_id, current_quantity }` | Documentar ou alinhar com `Movement.to_dict()` |
| Enum | `AccessLevels` (plural) | Aceitável; alternativa comum: `AccessLevel` (singular) |

---

## 11. Checklist priorizado — o que falta para backend “completo”

### 🔴 Prioridade 1 — Bloqueadores (fazer primeiro)

- [ ] **Seed / bootstrap:** cargos padrão + usuário admin inicial
- [ ] **Corrigir imports** em `core/security.py` e `routes/user_routes.py` (remover `backend.*`)
- [ ] **Corrigir `require_min_access_level`:** `HTTPException` quando role ausente; checar `role.is_active`
- [ ] **Unificar nome do banco** (`scge.db`) em config, `.env.example` e README

### 🟠 Prioridade 2 — Completude funcional

- [ ] Validar **nome duplicado** de produto no service
- [ ] Proteger **último usuário/cargo ADMIN**
- [ ] Validar **delete de categoria** com produtos vinculados
- [ ] Validar **delete de cargo** com usuários vinculados
- [ ] Extrair **report** para service layer
- [ ] Remover **`require_role`** (dead code)
- [ ] Completar **`routes/__init__.py` `__all__`** com `reports_router`

### 🟡 Prioridade 3 — Padronização e qualidade

- [ ] Padronizar resposta de **listas vazias** (200 vs 404)
- [ ] Padronizar **datas ISO** em `to_dict()`
- [ ] Padronizar **login errors** (401 genérico)
- [ ] Adicionar **`low_stock`** em `Product.to_dict()` (se integração frontend precisar)
- [ ] Tornar **CORS**, **JWT expiry** configuráveis via `.env`
- [ ] Substituir `datetime.utcnow()` por UTC aware
- [ ] Handler global para erros de validação no envelope da API (opcional)

### 🟢 Prioridade 4 — Auth avançada e infra (opcional / pós-MVP)

- [ ] Implementar **forgot-password** e **reset-password**
- [ ] Remover ou justificar duplicação **`/auth/register`** vs **`/users/`**
- [ ] Alembic / migrations
- [ ] Suporte Postgres documentado e testado
- [ ] Endpoint **`/notifications/stock-alerts`**
- [ ] Schemas Pydantic de **response**
- [ ] Testes automatizados (pytest + TestClient)

---

## 12. Matriz “completo para…”

| Critério | Pronto? | Observação |
|----------|---------|------------|
| Apresentação acadêmica (CRUD + JWT + RBAC) | Quase | Falta seed e corrigir imports |
| Integração frontend real | Quase | API ok; frontend ainda usa mocks em várias telas |
| Deploy limpo (clone → run → login) | Não | Sem seed |
| Produção | Não | Sem migrations, reset senha, hardening |
| Documentação confiável | Parcial | Docs principais desatualizados |

---

## 13. Referência rápida — arquivos-chave

| Responsabilidade | Caminho |
|------------------|---------|
| Entrada da API | `backend/app.py` |
| Config / env | `backend/core/config.py` |
| JWT + RBAC | `backend/core/security.py` |
| Envelope JSON | `backend/core/responses.py` |
| Sessão DB | `backend/database/session.py` |
| Mapa de rotas + níveis | `docs/backend-routes-access.md` |
| Diagrama de classes | `docs/backend-class-diagram.md` |
| Este audit | `docs/backend-audit-completeness.md` |

---

## 14. Estimativa de esforço (orientativa)

| Bloco | Esforço |
|-------|---------|
| Seed + fix imports + fix guard RBAC | 2–4 h |
| Validações delete/produto + dead code | 2–3 h |
| Reports service + docs atualizados | 2–3 h |
| Forgot/reset password | 4–8 h |
| Migrations + Postgres | 4–6 h |
| Testes automatizados | 6–12 h |

---

*Documento gerado a partir de auditoria estática do repositório SCGE — IFMS, 2026.*
