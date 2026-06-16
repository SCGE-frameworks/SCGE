# SCGE - Sistema de Controle e Gestão de Estoque

O **SCGE** é uma aplicação web para controle e acompanhamento de estoque. O sistema reúne funcionalidades para controle de usuários, perfis de acesso, produtos em estoque, movimentações e relatórios de apoio à gestão.

O projeto é desenvolvido no contexto acadêmico do **IFMS**, como parte das atividades práticas de desenvolvimento de software.

## Objetivo

- Centralizar o gerenciamento de estoque em uma aplicação web.
- Reduzir erros causados por processos manuais.
- Melhorar a visibilidade sobre produtos, movimentações e usuários.

## Status do projeto

O projeto está em desenvolvimento.

- **Backend:** API desenvolvida com FastAPI.
- **Frontend:** interface desenvolvida com React + Vite.
- **Integração com API:** em andamento.
- Algumas telas ainda utilizam mocks ou fluxos parciais enquanto o backend evolui.

## Tecnologias

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Lucide React

### Backend

- Python
- FastAPI
- SQLAlchemy
- Uvicorn
- Pydantic
- SQLite local, com possibilidade futura de PostgreSQL

### Gestão

- Jira
- GitHub
- Figma

## Design e Protótipo

O protótipo das telas do SCGE foi desenvolvido no Figma e serve como referência visual para a implementação do frontend.

- [Acessar protótipo no Figma](https://www.figma.com/design/axawXFROpTsEGqkq5cjCMz/Sistema-de-Estoque?node-id=3-180&t=IpvnkfOjhyjIpMe9-1)

O protótipo contempla telas como login, recuperação de senha, dashboard, estoque/inventário, movimentações, relatórios, gestão de usuários e perfis de acesso.

## Estrutura do projeto

```text
SCGE/
├── backend/
│   ├── app.py
│   ├── core/               # config, JWT, respostas padronizadas
│   ├── database/           # engine, sessão, Base
│   ├── models/
│   ├── schemas/
│   ├── routes/
│   └── services/
├── frontend/
├── README.md
└── .gitignore
```

- **backend:** API em camadas, código e contrato JSON em inglês (`core` + `database`).
- **frontend:** interface React; telas em português, integração com API via `services/*.api.js`.

## Como executar o backend localmente

No Windows, a partir da raiz do projeto:

```powershell
cd backend
python -m venv ../.venv
..\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app:app --reload
```

A API ficará disponível em:

- `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

Se necessário, copie `backend/.env.example` para `backend/.env` e ajuste as variáveis de ambiente locais.

## Como executar o frontend localmente

A partir da raiz do projeto:

```powershell
cd frontend
npm install
npm run dev
```

O Vite normalmente executa a aplicação em:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

## Scripts úteis do frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Fluxo de branches

- `develop` é a branch principal de desenvolvimento.
- `master` é usada como branch estável/final.
- Novas tarefas devem sair da `develop`.
- Pull requests devem ser abertos preferencialmente para `develop`.

Exemplo:

```bash
git checkout develop
git pull origin develop
git checkout -b feat/front-XX-descricao-da-task
```

## Padrão de commits

Exemplos:

- `feat(front-XX): implementa tela de gestão de usuários`
- `fix(front-XX): corrige comportamento da sidebar`
- `docs(front-XX): atualiza documentação`
- `refactor(front-XX): reorganiza services`

## Funcionalidades atuais

- Tela de login mockada.
- Recuperação de senha visual/simulada.
- Layout autenticado com Sidebar e Header.
- Rotas protegidas.
- Navegação administrativa por perfil.
- Tela de Gestão de Usuários integrada à API.
- Services reais para usuários e perfis/cargos.
- Telas de Dashboard, Estoque/Inventário, Movimentações e Relatórios em evolução.

## Rotas principais do frontend

### Públicas

- `/login`
- `/forgot-password`
- `/reset-password`

### Internas

- `/dashboard`
- `/inventario`
- `/movimentacoes`
- `/relatorios`

### Administrativas

- `/admin/usuarios`
- `/admin/perfis-acesso`

## Observações importantes

- Não commitar `.env`.
- Não commitar `.venv`.
- Não commitar `node_modules`.
- Não commitar `dist`.
- Não commitar banco local gerado para testes.
- Algumas integrações dependem do backend estar rodando em `http://127.0.0.1:8000`.

## Equipe de desenvolvimento

- Ana Laura Martins
- Caio Victor Santos Valentim
- Diogo Queiroz da Silva
- Dirceu Alves Neto
- Eduardo Melo Perucci
- Fernando Tinno Venceslau
- Gabriel Correa de A. Guanais
- Hideki wakui
- Hudson Batista Brandao
- Inacio Ribeiro Azevedo
- Joao Victor Carrenho Alves
- Paulo Henrique R. Rebello

---

Três Lagoas - MS | 2026
