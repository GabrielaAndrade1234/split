import {
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { gruposTable } from "./grupos";

export type AiExpenseSuggestionPayload = {
  descricao: string;
  valor: number;
  categoria:
    | "restaurante"
    | "transporte"
    | "hospedagem"
    | "lazer"
    | "compras"
    | "outros";
  pagadorId: number;
  participanteIds: number[];
  explicacao: string;
};

export const aiExpenseRequestsTable = pgTable("ai_expense_requests", {
  id: serial("id").primaryKey(),
  grupoId: integer("grupo_id")
    .notNull()
    .references(() => gruposTable.id, { onDelete: "cascade" }),
  requestHash: text("request_hash").notNull().unique(),
  prompt: text("prompt").notNull(),
  response: jsonb("response").$type<AiExpenseSuggestionPayload>().notNull(),
  model: text("model").notNull(),
  inputTokens: integer("input_tokens").notNull(),
  outputTokens: integer("output_tokens").notNull(),
  estimatedCostUsd: numeric("estimated_cost_usd", {
    precision: 12,
    scale: 8,
  }).notNull(),
  cacheHits: integer("cache_hits").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});