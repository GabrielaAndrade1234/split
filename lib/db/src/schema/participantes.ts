import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { gruposTable } from "./grupos";

export const participantesTable = pgTable("participantes", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  grupoId: integer("grupo_id").notNull().references(() => gruposTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertParticipanteSchema = createInsertSchema(participantesTable).omit({ id: true, createdAt: true });
export type InsertParticipante = z.infer<typeof insertParticipanteSchema>;
export type Participante = typeof participantesTable.$inferSelect;
