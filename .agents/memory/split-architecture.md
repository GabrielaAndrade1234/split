---
name: Split app architecture
description: Stack decisions, gotchas, and balance logic for the Split expense-splitting app.
---

## Stack
- Frontend: React + Vite at `artifacts/split-app`, routes via wouter, API calls via Orval-generated hooks from `@workspace/api-client-react`
- Backend: Express 5 at `artifacts/api-server`, routes under `src/routes/`
- DB: Drizzle ORM + PostgreSQL; schema in `lib/db/src/schema/` (grupos, participantes, despesas, despesas_participantes, pagamentos)
- API spec: `lib/api-spec/openapi.yaml` → codegen via `pnpm --filter @workspace/api-spec run codegen`

## Key gotcha: zod.int() vs zod v3
Orval generates `zod.int()` for OpenAPI `type: integer`, but the workspace uses zod v3 which has no `.int()` method (that's zod v4). **Fix: use `type: number` instead of `type: integer` in the OpenAPI spec.** This generates `zod.number()` which works in both versions.

## Balance calculation
The min-cash-flow greedy algorithm lives in `artifacts/api-server/src/routes/grupos.ts` → `computeTransferencias()` and is re-exported for use in `dividas.ts`.

**Why:** Minimizes the number of transfers between group members (classic "simplify debts" problem).

**How to apply:** When recomputing balances, remember that `pagamentosTable` rows must be applied to balances (payer +valor, receiver -valor) to adjust for already-settled debts.

## Seeded data
- 1 group: "Viagem Praia 🌊" (id=1), 5 participants (Gabi, Ana, Bruno, Clara, Você), 3 expenses (Restaurante beira-mar R$185, Uber R$62.40, Mercado R$120).

## Design system
- Primary #5B3FA8 (purple), Accent #A7F3D0 (mint), Success #047A45, Danger #C62828
- Font: Inter 400/700 only
- Radius: 12px cards/buttons, 4px inputs
