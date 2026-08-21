import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { gruposTable } from "./grupos";
import { participantesTable } from "./participantes";

export const despesasTable = pgTable("despesas", {
  id: serial("id").primaryKey(),
  descricao: text("descricao").notNull(),
  valor: numeric("valor", { precision: 10, scale: 2 }).notNull(),
  categoria: text("categoria").notNull().default("outros"),
  pagadorId: integer("pagador_id").notNull().references(() => participantesTable.id, { onDelete: "restrict" }),
  grupoId: integer("grupo_id").notNull().references(() => gruposTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const despesasParticipantesTable = pgTable("despesas_participantes", {
  despesaId: integer("despesa_id").notNull().references(() => despesasTable.id, { onDelete: "cascade" }),
  participanteId: integer("participante_id").notNull().references(() => participantesTable.id, { onDelete: "cascade" }),
});

export const insertDespesaSchema = createInsertSchema(despesasTable).omit({ id: true, createdAt: true });
export type InsertDespesa = z.infer<typeof insertDespesaSchema>;
export type Despesa = typeof despesasTable.$inferSelect;
