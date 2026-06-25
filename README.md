# SCGE — Sistema de Controle e Gestão de Estoque

Aplicação web full stack para controle de estoque, desenvolvida no **IFMS — Campus Três Lagoas**. O backend expõe uma API REST com JWT e RBAC; o frontend React consome essa API com interface em português.

**Protótipo Figma:** [Sistema de Estoque](https://www.figma.com/design/axawXFROpTsEGqkq5cjCMz/Sistema-de-Estoque?node-id=3-180)

---

## Equipe

Ana Laura Martins · Caio Victor Santos Valentim · Diogo Queiroz da Silva · Dirceu Alves Neto · Eduardo Melo Perucci · Fernando Tinno Venceslau · Gabriel Correa de A. Guanais · Hideki Wakui · Hudson Batista Brandão · Inácio Ribeiro Azevedo · João Victor Carrenho Alves · Paulo Henrique R. Rebello

---

## Funcionalidades

- Login com JWT, recuperação e redefinição de senha
- Dashboard com KPIs, alertas e atividades recentes
- Inventário (CRUD de produtos)
- Movimentações (entrada, saída e perda)
- Relatório de estoque baixo com exportação CSV
- Gestão de usuários e perfis de acesso (admin)

---

## Arquitetura

```text
Frontend (React + Vite)
  pages → services/api.js → AuthContext
              │ HTTP + Bearer JWT
              ▼
Backend (FastAPI)
  routes → services → models → SQLite
```

Resposta padrão da API: `{ success, message, data }` ou `{ success: false, error: { code, message } }`.

---

## Tecnologias

| Camada | Stack |
|--------|-------|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend | Python, FastAPI, SQLAlchemy, Pydantic, Uvicorn, SQLite |

---

## Pré-requisitos

- Node.js 18+ e npm
- Python 3.11+
- Git

---

## Como executar

### Opção 1 — Um único comando (Linux/Ubuntu)

Pré-requisitos: `python3` (3.11+), `python3-venv` e `node` (18+) instalados.

```bash
bash start.sh
```

O script instala as dependências do backend e do frontend, gera o build do
frontend e sobe **tudo na mesma porta**. Ao terminar, acesse:

- Aplicação: `http://localhost:8000`
- Swagger (API): `http://localhost:8000/docs`

Login padrão: `admin@scge.com` / `admin@123`. Pressione `CTRL+C` para encerrar.

> Nesse modo o backend serve a interface já compilada — não há segundo servidor
> nem configuração de CORS a ajustar.

### Opção 2 — Manual (desenvolvimento)

**Backend:**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # Windows: copy .env.example .env
python -m uvicorn app:app --reload
```

- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`

Na primeira execução, o seed cria os perfis padrão e o usuário admin.

**Frontend** (em outro terminal):

```bash
cd frontend
npm install
cp .env.example .env               # Windows: copy .env.example .env
npm run dev
```

- App: `http://localhost:5173`

> No modo manual, backend e frontend rodam ao mesmo tempo (o frontend em `5173`
> consome a API em `8000`).

---

## Como testar

### 1. Subir o projeto

Use a [Opção 1 (`bash start.sh`)](#opção-1--um-único-comando-linuxubuntu) e abra
`http://localhost:8000`. (No modo manual, abra `http://localhost:5173`.)

### 2. Login

1. Acesse `/login`
2. Entre com:

| Campo | Valor |
|-------|-------|
| E-mail | `admin@scge.com` |
| Senha | `admin@123` |

3. Você deve ser redirecionado para o **Dashboard**

### 3. Inventário e categorias

O seed não cria categorias — crie a primeira pela própria interface:

1. Vá em **Estoque** (`/inventario`)
2. Clique em **Categorias**, adicione uma (nome + descrição) e feche o modal
3. Clique em **Novo Produto**, preencha os campos e selecione a categoria criada
4. Salve e confira o produto na tabela
5. Teste os filtros por categoria e status
6. Edite e exclua um produto

### 4. Movimentações

1. Vá em **Movimentações** (`/movimentacoes`)
2. Selecione o produto, escolha **Entrada**, informe quantidade e motivo
3. Registre e verifique o histórico
4. Teste **Saída** e **Perda** — a saída não pode exceder o estoque atual

### 5. Dashboard e relatórios

1. No **Dashboard**, confira se os KPIs e alertas refletem os dados cadastrados
2. Em **Relatórios** (`/relatorios`), veja produtos com estoque baixo
3. Use **Exportar CSV** para baixar o relatório

### 6. Administração

Como admin, o menu **Administração** aparece na sidebar:

| Tela | O que testar |
|------|----------------|
| Gestão de Usuários | Criar, editar e inativar usuário |
| Perfis de Acesso | Criar, editar e inativar perfil |

### 7. Recuperação de senha

1. Em `/forgot-password`, informe `admin@scge.com`
2. O token de reset aparece na tela (ambiente de desenvolvimento, sem e-mail)
3. Clique no link ou vá em `/reset-password` e cole o token
4. Defina uma nova senha e faça login novamente

### 8. Testar via API (opcional)

Todas as funcionalidades estão disponíveis pela interface. Se quiser inspecionar a API diretamente, use o Swagger (`/docs`) após autorizar com o token:

| Recurso | Endpoints principais |
|---------|---------------------|
| Produtos | `GET/POST /products/`, `PUT/DELETE /products/{id}` |
| Categorias | `GET/POST /categories/`, `PUT/DELETE /categories/{id}` |
| Movimentações | `GET /movements/`, `POST /movements/entry`, `exit`, `loss` |
| Relatórios | `GET /reports/low-stock` |
| Usuários | `GET/POST /users/`, `PUT/DELETE /users/{id}` |
| Perfis | `GET/POST /roles/`, `PUT/DELETE /roles/{id}` |

### 9. Build do frontend

```powershell
cd frontend
npm run build
```

Se passar sem erros, o frontend está compilando corretamente.

---

## Credenciais e níveis de acesso

| Nível | Perfil | Permissões |
|-------|--------|------------|
| 1 | Consulta | Visualizar telas |
| 2 | Operador | Registrar movimentações |
| 3 | Gerente | CRUD de produtos e categorias |
| 4 | Administrador | Usuários e perfis |

O frontend usa o `access_level` do login para exibir menus e ações.

---

## Rotas do frontend

| Tipo | Rotas |
|------|-------|
| Públicas | `/login`, `/forgot-password`, `/reset-password` |
| Autenticadas | `/dashboard`, `/inventario`, `/movimentacoes`, `/relatorios` |
| Admin (nível 4) | `/admin/usuarios`, `/admin/perfis-acesso` |

---

## Variáveis de ambiente

**Backend** (`backend/.env`):

| Variável | Descrição |
|----------|-----------|
| `SECRET_KEY` | Chave JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiração do token |
| `PASSWORD_RESET_EXPIRE_MINUTES` | Expiração do reset |
| `CORS_ORIGINS` | Origens permitidas |

**Frontend** (`frontend/.env`):

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL da API (padrão: `http://127.0.0.1:8000`) |

---

## Estrutura do repositório

```text
SCGE/
├── backend/          # API FastAPI (também serve o build do frontend)
├── frontend/         # App React
├── docs/             # Documentação técnica
├── start.sh          # Setup + execução em um único comando (Linux)
└── README.md
```

---

## Fluxo de desenvolvimento

- Branch principal: `develop` · Estável: `master`
- Novas tarefas: `feat/front-XX-descricao` ou `feat/back-XX-descricao`
- Commits: `feat(front-XX): descrição`, `fix(back-XX): descrição`

Documentação extra: `docs/backend-routes-access.md`

---

## Observações

- Não commitar `.env`, `.venv`, `node_modules`, `dist` nem `scge.db`
- O CORS do backend aceita apenas o frontend (`http://localhost:5173` e `http://127.0.0.1:5173`); se `npm run dev` falhar por porta ocupada, encerre o Vite antigo antes de subir de novo
- Se o banco estiver desatualizado após mudanças de schema, delete `backend/scge.db` e reinicie o backend
- Em desenvolvimento, o token de reset de senha é retornado na API (sem envio de e-mail)

---

**IFMS — Campus Três Lagoas · MS · 2026**
