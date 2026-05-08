# SCGE - Sistema de Controle e Gestao de Estoque

O **SCGE** e uma aplicacao para registro, controle e acompanhamento de estoque, com foco em reduzir perdas operacionais, evitar rupturas e melhorar a visibilidade das movimentacoes.

## Objetivo do projeto

Centralizar o gerenciamento de inventario em uma solucao moderna, organizada e escalavel, substituindo processos manuais sujeitos a erro.

## Status atual

Este repositorio contem o backend em **FastAPI** com rotas iniciais para:

- autenticacao (`/auth`)
- usuarios (`/users`)
- itens (`/items`)

As rotas atuais estao em formato base (MVP inicial), com respostas de exemplo para evolucao incremental.

## Tecnologias

### Backend

- Python
- FastAPI
- Estrutura em camadas para evolucao de API REST

### Frontend (planejado)

- React
- Figma (prototipacao)

### Banco de dados (planejado)

- PostgreSQL

### Gestao e processo

- Trello
- Metodologia agil

## Como executar localmente

### 1) Pre-requisitos

- Python 3.10+ recomendado
- `pip`

### 2) Criar ambiente virtual

```bash
python -m venv .venv
source .venv/bin/activate
```

### 3) Instalar dependencias

> Se ainda nao existir `requirements.txt`, instale ao menos:

```bash
pip install fastapi uvicorn
```

### 4) Iniciar servidor

```bash
uvicorn app:app --reload
```

API disponivel em:

- `http://127.0.0.1:8000`
- Documentacao Swagger: `http://127.0.0.1:8000/docs`
- Documentacao ReDoc: `http://127.0.0.1:8000/redoc`

## Funcionalidades previstas (MVP)

- Cadastro e gestao de usuarios (com perfil e permissao)
- Cadastro e controle de itens em estoque
- Registro de entradas e saidas
- Alertas de estoque minimo
- Relatorios para apoio a decisao
- Filtros por nome, codigo e categoria

## Equipe de desenvolvimento

- Ana Laura Martins
- Caio Victor Santos Valentim
- Diogo Queiroz da Silva
- Dirceu Alves Neto
- Fernando Tinno Venceslau
- Gabriel Correa de A. Guanais
- Hudson Batista Brandao
- Inacio Ribeiro Azevedo
- Joao Victor Carrenho Alves
- Paulo Henrique R. Rebello

---

Tres Lagoas - MS | 2026