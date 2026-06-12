# Frontend SCGE

Interface web do SCGE construída com React e Vite.

## Acessar a pasta frontend

```bash
cd frontend
```

## Instalar dependências

```bash
npm install
```

## Rodar o projeto

```bash
npm run dev
```

## Gerar build

```bash
npm run build
```

## Scripts disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento do Vite.
- `npm run build`: gera a versão de produção em `dist`.
- `npm run lint`: executa o ESLint.
- `npm run preview`: serve localmente o build gerado.
- `npm run prepare`: executa a preparação do Husky.

## Rotas públicas

- `/login`
- `/forgot-password`
- `/reset-password`

## Rotas internas

As rotas internas exigem um usuário salvo no `localStorage` na chave `scge:user`.

- `/dashboard`
- `/inventario`
- `/movimentacoes`
- `/relatorios`

## Rotas administrativas

As rotas administrativas exigem usuário autenticado com `role` igual a `Administrador`.

- `/admin/usuarios`
- `/admin/perfis-acesso`

## Protótipo no Figma

As telas do frontend devem seguir o protótipo definido no Figma:

- [Acessar protótipo no Figma](https://www.figma.com/design/axawXFROpTsEGqkq5cjCMz/Sistema-de-Estoque?node-id=3-180&t=IpvnkfOjhyjIpMe9-1)

## Usuários mockados para teste

- `admin@scge.com`: Administrador
- `diogo.queiroz@scge.com`: Administrador
- `dirceu.neto@scge.com`: Administrador
- `fernando.tinno@scge.com`: Operador

## Perfis de acesso

- `Administrador`: acessa as rotas internas comuns e também a seção administrativa.
- `Operador`: acessa as rotas internas comuns, sem acesso à seção administrativa.

## Backend

A autenticação e os usuários ainda são mockados no frontend. Algumas telas futuras dependem da API do backend em `http://127.0.0.1:8000`.
