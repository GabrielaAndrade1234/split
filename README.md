# Split ☀️

> Divisão de despesas para grupos de amigos — sem planilha, sem briga.

---

## O que é o projeto?

O **Split** é um aplicativo web mobile-first que resolve um problema clássico: quando um grupo de amigos viaja, janta junto ou faz qualquer atividade, pessoas diferentes pagam coisas diferentes — e na hora do acerto ninguém sabe exatamente quem deve quanto pra quem.

O Split permite criar um grupo, registrar cada despesa com o pagador e quem participou, e ao final exibe automaticamente a lista mínima de transferências necessárias para zerar todas as dívidas. O algoritmo de acerto (fluxo de caixa mínimo) garante o menor número possível de transferências entre o grupo.

**Funcionalidades da v1:**
- Criar grupos e adicionar participantes
- Registrar despesas com valor, pagador e quem divide
- Visualizar o saldo individual de cada participante
- Ver a lista de quem deve pagar quem (e quanto)
- Marcar dívidas como pagas

---

## Para quem é o projeto?

Para **jovens adultos** que dividem gastos com amigos em situações como viagens, restaurantes, festas e atividades em grupo — e usam principalmente o celular.

O Split é ideal para quem resolve hoje isso com calculadora, anotações no bloco de notas, planilha do Google ou grupos de WhatsApp. O objetivo é substituir esse processo manual por algo rápido e matemático.

> Projeto desenvolvido como MVP para validação até o **Demo Day — 08/10/2026**.

---

## O que precisa?

**Requisitos:**

| Dependência | Versão mínima |
|---|---|
| Node.js | 24+ |
| pnpm | 9+ |
| PostgreSQL | 15+ |

**Variáveis de ambiente:**

```env
DATABASE_URL=postgresql://user:password@host:5432/split
SESSION_SECRET=uma-string-aleatoria-longa
```

> No Replit, ambas já estão configuradas automaticamente como Secrets.

---

## Como rodar?

**1. Instalar dependências**
```bash
pnpm install
```

**2. Subir o schema no banco**
```bash
pnpm --filter @workspace/db run push
```

**3. Popular com dados de exemplo** *(opcional)*
```bash
pnpm --filter @workspace/scripts tsx src/seed.ts
```

**4. Rodar em desenvolvimento**
```bash
# Em terminais separados:
pnpm --filter @workspace/api-server run dev   # API → porta 5000
pnpm --filter @workspace/split-app run dev    # Frontend → porta definida pelo ambiente
```

**Outros comandos úteis:**
```bash
pnpm run typecheck                              # Checar tipos em todos os pacotes
pnpm run build                                 # Build completo
pnpm --filter @workspace/api-spec run codegen  # Regenerar hooks e schemas da OpenAPI spec
```

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript 5.9 |
| Frontend | React + Vite, Wouter (roteamento), TanStack Query |
| Backend | Express 5 |
| Banco | PostgreSQL + Drizzle ORM |
| Validação | Zod v4, drizzle-zod |
| API codegen | Orval (gerado a partir da spec OpenAPI) |
| Monorepo | pnpm workspaces |
| Build | esbuild (bundle CJS) |

**Estrutura do repositório:**
```
artifacts/
  split-app/      → frontend React + Vite
  api-server/     → backend Express 5
lib/
  db/             → schema Drizzle + client PostgreSQL
  api-spec/       → spec OpenAPI (fonte da verdade da API)
  api-zod/        → schemas e hooks gerados pelo Orval
scripts/          → seed e utilitários
```

---

## Quem mantém?

Projeto desenvolvido e mantido pela equipe:

| Nome | Papel |
|---|---|
| **Gabriela Andrade** | Produto & Desenvolvimento |
| **Maria Luiza Mourão** | Produto & Desenvolvimento |
| **Eduardo Alcides** | Produto & Desenvolvimento |

PRD v1 definido em 16/08/2026. Repositório criado como parte do ciclo de desenvolvimento até o Demo Day.
