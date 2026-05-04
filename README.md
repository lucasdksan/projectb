# Project B

Sistema de gestão de produtos e loja virtual com tema escuro, voltado a donos de loja que personalizam vitrine, vendem online e usam integração com **Google Gemini** para geração de conteúdo (anúncios, sugestões, pós-venda). Cada usuário pode ter lojas com slug próprio; clientes acessam a loja em rotas públicas (`/store/[slug]`).

## Stack principal

| Área        | Tecnologia |
|------------|------------|
| Framework  | [Next.js](https://nextjs.org/) 16 (App Router), React 19 |
| Linguagem  | TypeScript |
| Banco      | [Prisma](https://www.prisma.io/) + SQLite (valores monetários em **centavos**, `Int`) |
| Estilo     | Tailwind CSS 4 |
| Validação  | Zod, React Hook Form |
| Auth       | JWT ([jose](https://github.com/panva/jose)), hash com Argon2 + pepper |
| IA         | [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini) |
| Arquivos   | [@vercel/blob](https://www.npmjs.com/package/@vercel/blob) |
| E-mail     | Nodemailer |
| Testes     | Vitest, Testing Library; Playwright nas dependências de desenvolvimento |

## Funcionalidades (visão geral)

- **Área pública da loja**: catálogo por loja (`/store/[slug]`), detalhe do produto, carrinho e checkout com confirmação de pedido.
- **Dashboard (área autenticada)**: criação e edição de produtos, configuração da loja (cores, banners, logo), fluxos de pedidos e métricas (ex.: gráficos com Recharts).
- **Contas**: cadastro, login, recuperação de senha (depende de SMTP configurado).
- **IA**: geração e sugestões de conteúdo ligadas ao catálogo e à loja (requer `GEMINI_API_KEY`).
- **CI**: no GitHub Actions — lint, build, testes e `prisma generate` (usando `.env.test`).

## Estrutura do repositório

- `app/` — rotas Next (grupos `(public)` / `(private)`), layouts e Server Actions por feature.
- `backend/` — serviços, repositórios, schemas de domínio e integrações externas.
- `frontend/` — componentes de UI e *view models* (MVVM) consumidos pelas páginas.
- `libs/` — utilitários compartilhados (`auth`, `jwt`, `env`, formatação, etc.).
- `prisma/` — `schema.prisma` e migrações.
- `proxy.ts` — lógica de middleware Next (rate limit em rotas `/auth`, proteção de rotas); o projeto pode exigir que este arquivo esteja exposto como `middleware.ts` na raiz, conforme a convenção do Next.js no seu branch.

## Pré-requisitos

- [Node.js](https://nodejs.org/) **20+** (o CI usa **24**).
- npm (lockfile versionado).

## Configuração local

1. Clone o repositório e entre na pasta do projeto.

2. Copie as variáveis de ambiente e preencha os valores:

   ```bash
   cp .env.example .env
   ```

3. Instale dependências:

   ```bash
   npm ci
   ```

4. Gere o cliente Prisma e aplique migrações (ajuste `DATABASE_URL` no `.env`; exemplo típico com SQLite: `file:./dev.db`):

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. Suba o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   A aplicação costuma responder em [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Definidas e validadas em `libs/env.ts`. Resumo (detalhes no `.env.example`):

| Variável | Uso |
|----------|-----|
| `DATABASE_URL` | URL do SQLite (ou outro provider se você adaptar o schema) |
| `NEXT_PUBLIC_APP_URL` | URL pública base da aplicação |
| `NEXT_PUBLIC_NODE_ENV` | Ambiente exposto ao cliente (`local`, `production`, etc.) |
| `NODE_ENV` | Ambiente Node (ex.: `development`, `production`) |
| `JWT_SECRET` | Assinatura dos validadores de sessão |
| `PASSWORD_PEPPER` | Segredo adicional no hash de senhas |
| `MAIL_*` | SMTP para e-mails transacionais |
| `GEMINI_API_KEY` | API do Gemini |
| `BLOB_READ_WRITE_TOKEN` | Uploads/leitura no Vercel Blob |

## Scripts npm

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento Next |
| `npm run build` | Build de produção |
| `npm run start` | Servidor após `build` |
| `npm run lint` | ESLint (config Next) |
| `npm run test` | Vitest |
| `npm run test:ui` | Vitest com UI |

## Testes e CI

- Testes unitários/integrados leves com **Vitest** (`libs/__tests__/` e outros).
- Workflow `.github/workflows/ci.yml`: em pushes e PRs para `main`, executa `npm ci`, `cp .env.test .env`, `npx prisma generate`, `npm run lint`, `npm run build` e `npm run test`.

## Modelo de dados (resumo)

Principais entidades no Prisma: usuários, lojas (`Store` + `ConfigStore`), produtos e imagens, clientes, pedidos e itens de pedido, conteúdo gerado por IA (`ContentAI`). Relações são por **loja** e **usuário dono** da loja.

---

Projeto privado (`private: true` no `package.json`). Ajuste licença e políticas conforme a necessidade do seu time.
