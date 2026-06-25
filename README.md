# SCGE — Sistema de Controle e Gestão de Estoque

Aplicação web full stack para controle de estoque, desenvolvida no **IFMS — Campus Três Lagoas**.

---

## Como rodar o sistema

### Forma recomendada — um único comando (Linux/Ubuntu)

**Pré-requisitos:** `python3` (3.11+), `python3-venv`, `node` (18+) e `npm`.

```bash
git clone <url-do-repositorio>
cd SCGE
bash start.sh
```

O script faz tudo automaticamente:

1. Cria o ambiente virtual do backend e instala as dependências Python
2. Gera o arquivo `backend/.env` (se ainda não existir)
3. Instala as dependências do frontend e gera o build de produção
4. Sobe a aplicação completa na porta **8000**

**Acesse no navegador:**

| Recurso | URL |
|---------|-----|
| Sistema (interface) | http://localhost:8000 |
| API (Swagger) | http://localhost:8000/docs |

**Login padrão** (criado automaticamente no primeiro start):

| Campo | Valor |
|-------|-------|
| E-mail | `admin@scge.com` |
| Senha | `admin@123` |

Para encerrar: `CTRL+C` no terminal.

> Nesse modo o backend serve a interface já compilada. Não é necessário subir dois servidores nem configurar CORS.

---

### Modo desenvolvimento — dois terminais

Use quando for alterar código do frontend ou do backend com hot-reload.

**Terminal 1 — Backend**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                 # Windows: copy .env.example .env
python -m uvicorn app:app --reload
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm install
cp .env.example .env                 # Windows: copy .env.example .env
npm run dev
```

| Recurso | URL |
|---------|-----|
| Interface (dev) | http://localhost:5173 |
| API | http://127.0.0.1:8000 |
| Swagger | http://127.0.0.1:8000/docs |

---

### Primeiro uso — fluxo rápido de teste

Depois de rodar o sistema e fazer login como admin:

1. **Estoque** → **Categorias** → crie uma categoria (ex.: Bebidas)
2. **Estoque** → **Novo Produto** → cadastre um produto na categoria criada
3. **Movimentações** → registre uma entrada, saída ou perda
4. **Dashboard** → confira KPIs e alertas
5. **Relatórios** → veja estoque baixo e exporte CSV
6. **Administração** → crie usuários e perfis de acesso

---

### Problemas comuns

| Sintoma | Solução |
|---------|---------|
| `Failed to fetch` no login | Confirme que o backend está rodando (`http://127.0.0.1:8000/docs` deve abrir) |
| Porta 8000 ocupada | Encerre o processo anterior ou use outra porta no uvicorn |
| Porta 5173 ocupada (modo dev) | Encerre o Vite antigo antes de rodar `npm run dev` |
| Erro de schema no banco | Delete `backend/scge.db` e reinicie o backend (o seed recria os dados) |
| `python3-venv` não encontrado | `sudo apt install -y python3-venv` (Ubuntu) |

---

## Sobre o projeto

O SCGE centraliza inventário, movimentações, relatórios e gestão de usuários com controle de acesso por perfis (RBAC). O backend expõe uma API REST com JWT; o frontend React consome essa API com interface em português.

**Protótipo Figma:** [Sistema de Estoque](https://www.figma.com/design/axawXFROpTsEGqkq5cjCMz/Sistema-de-Estoque?node-id=3-180)

### Funcionalidades

- Autenticação (login, recuperação e redefinição de senha)
- Dashboard com KPIs, alertas e atividades recentes
- Inventário — produtos e categorias
- Movimentações (entrada, saída e perda)
- Relatório de estoque baixo com exportação CSV
- Gestão de usuários e perfis de acesso (admin)

### Níveis de acesso

| Nível | Perfil | Permissões |
|-------|--------|------------|
| 1 | Consulta | Visualizar telas |
| 2 | Operador | Registrar movimentações |
| 3 | Gerente | CRUD de produtos e categorias |
| 4 | Administrador | Usuários e perfis |

---

## Tecnologias

| Camada | Stack |
|--------|-------|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend | Python, FastAPI, SQLAlchemy, Pydantic, Uvicorn, SQLite |

---

## Estrutura do repositório

```text
SCGE/
├── start.sh          # Setup + execução em um comando (Linux)
├── backend/          # API FastAPI (serve o build do frontend)
├── frontend/         # App React
├── docs/             # Documentação técnica
└── README.md
```

---

## Equipe

Ana Laura Martins · Caio Victor Santos Valentim · Diogo Queiroz da Silva · Dirceu Alves Neto · Eduardo Melo Perucci · Fernando Tinno Venceslau · Gabriel Correa de A. Guanais · Hideki Wakui · Hudson Batista Brandão · Inácio Ribeiro Azevedo · João Victor Carrenho Alves · Paulo Henrique R. Rebello

---

## Desenvolvimento

- Branch principal: `develop` · Estável: `master`
- Commits: `feat(front-XX): descrição`, `fix(back-XX): descrição`
- Documentação da API: `docs/backend-routes-access.md`
- Não commitar `.env`, `.venv`, `node_modules`, `dist` nem `scge.db`

---

**IFMS — Campus Três Lagoas · MS · 2026**
