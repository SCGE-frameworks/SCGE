# Guia de Contribuição

## Introdução

Este documento define o padrão de contribuição do projeto SCGE - Sistema de Controle e Gestão de Estoque. O objetivo é manter organização, rastreabilidade e qualidade nas entregas, facilitando o acompanhamento das tarefas, a revisão de código e a evolução do projeto.

## Branch principal de desenvolvimento

A branch `develop` é a base principal para novas tarefas de desenvolvimento. Sempre que uma nova tarefa for iniciada, a nova branch deve ser criada a partir da `develop`.

A branch `master` deve ser tratada como a versão estável/final do projeto. Evite abrir Pull Requests diretamente para `master`, exceto quando o grupo definir um fluxo específico para publicação ou entrega final.

Pull Requests devem ser abertas preferencialmente para `develop`.

## Como iniciar uma nova tarefa

Antes de criar uma branch nova, atualize sua branch local `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feat/front-XX-descricao-da-task
```

Substitua `FRONT-XX` pelo código da task no Jira. A descrição da branch deve ser curta, clara e escrita em `kebab-case`.

Exemplos:

- `feat/front-65-user-management-page`
- `fix/front-77-configure-cors`
- `docs/update-root-readme`

## Padrão de nomes de branch

Use um prefixo que indique o tipo da alteração, seguido do código da task e de uma descrição curta:

- `feat/front-XX-descricao`
- `fix/front-XX-descricao`
- `refactor/front-XX-descricao`
- `docs/front-XX-descricao`
- `chore/front-XX-descricao`

## Padrão de commits

Os commits devem ser objetivos e, quando possível, conter o código da task relacionada no Jira. Escreva mensagens que deixem claro o que foi alterado.

Exemplos:

- `feat(front-65): implementa tela de gestão de usuários`
- `fix(front-77): configura CORS no backend`
- `docs: atualiza README principal do projeto`
- `refactor(front-64): organiza services de usuários`
- `chore: ajusta configuração do projeto`

## Antes de commitar

Antes de criar um commit, confira:

- Rodar `git status`
- Conferir se só os arquivos da task estão alterados
- Não commitar arquivos locais
- Testar manualmente o fluxo alterado
- Rodar `npm run build` quando mexer no frontend
- Testar backend localmente quando mexer em integração/API

## Arquivos que não devem ser commitados

Não inclua no commit arquivos locais, gerados automaticamente ou específicos do ambiente de desenvolvimento, como:

- `.env`
- `.venv/`
- `node_modules/`
- `dist/`
- Bancos locais como `scge.db`, `database.db` ou arquivos SQLite gerados localmente
- Arquivos temporários do editor
- Arquivos de log

## Fluxo para abrir Pull Request

Depois de finalizar a tarefa, suba a branch para o repositório remoto:

```bash
git push --set-upstream origin nome-da-branch
```

Ao abrir a Pull Request:

- Abra a PR para `develop`
- Preencha a descrição da PR
- Informe a task relacionada
- Descreva o que foi feito
- Descreva como testar
- Informe pendências ou dependências de backend/frontend

## Checklist de Pull Request

Antes de solicitar revisão, confira:

- PR aponta para `develop`
- Título segue um padrão claro
- Task do Jira foi mencionada
- Build passou, quando aplicável
- Testes manuais foram feitos
- Não há arquivos locais no commit
- Alterações estão dentro do escopo da task

## Cuidados com frontend

Ao trabalhar no frontend React + Vite:

- Manter componentes organizados em `src/components`, `src/pages`, `src/layouts` e `src/services`
- Usar services para chamadas de API
- Evitar `fetch` direto nas páginas quando já houver service
- Manter consistência visual com componentes base
- Rodar `npm run build` antes da PR

## Cuidados com backend

Ao trabalhar no backend FastAPI:

- Manter estrutura em `routes`, `services`, `schemas`, `models` e `utils`
- Não alterar contratos da API sem avisar o grupo
- Documentar mudanças de response/payload quando impactarem o frontend
- Atualizar `requirements.txt` quando adicionar dependências
- Não commitar banco local

## Integração frontend/backend

Para tarefas que envolvem integração entre frontend e backend:

- Alinhar payloads e responses antes de implementar tela integrada
- Documentar quando uma task do front depende de ajuste no backend
- Testar endpoints no Swagger antes de validar no frontend
- Backend local roda em `http://127.0.0.1:8000`
- Frontend local roda normalmente em `http://localhost:5173`

## Organização com Jira

O Jira deve ser usado para acompanhar o andamento das tarefas:

- Cada branch deve corresponder a uma task
- Mover a task no Jira conforme andamento
- Comentar na task quando abrir PR
- Registrar bloqueios, especialmente dependências entre front e backend

## Boas práticas

Durante o desenvolvimento:

- Manter commits pequenos e coerentes
- Evitar misturar várias tasks na mesma branch
- Evitar mudanças fora do escopo
- Avisar o grupo antes de alterar arquivos compartilhados
- Revisar o próprio diff antes da PR

## Encerramento

Seguir este guia ajuda a manter o projeto fácil de revisar, testar e evoluir. A organização das branches, commits e Pull Requests reduz retrabalho e melhora a colaboração entre frontend, backend e gestão das tarefas no Jira.
