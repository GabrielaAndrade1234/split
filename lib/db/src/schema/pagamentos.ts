import { pgTable, serial, integer, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { gruposTable } from "./grupos";
import { participantesTable } from "./participantes";

export const pagamentosTable = pgTable("pagamentos", {
  id: serial("id").primaryKey(),
  pagadorId: integer("pagador_id").notNull().references(() => participantesTable.id, { onDelete: "cascade" }),
  recebedorId: integer("recebedor_id").notNull().references(() => participantesTable.id, { onDelete: "cascade" }),
  valor: numeric("valor", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pago"),
  grupoId: integer("grupo_id").notNull().references(() => gruposTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPagamentoSchema = createInsertSchema(pagamentosTable).omit({ id: true, createdAt: true });
export type InsertPagamento = z.infer<typeof insertPagamentoSchema>;
export type Pagamento = typeof pagamentosTable.$inferSelect;
