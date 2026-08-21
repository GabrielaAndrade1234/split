import { Router } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  despesasTable,
  despesasParticipantesTable,
  participantesTable,
} from "@workspace/db";
import {
  CreateDespesaBody,
  CreateDespesaParams,
  GetDespesaParams,
  DeleteDespesaParams,
  ListDespesasParams,
} from "@workspace/api-zod";

const router = Router();

async function formatDespesa(d: typeof despesasTable.$inferSelect, allParticipantes: Array<{ id: number; nome: string; grupoId: number }>) {
  const pagador = allParticipantes.find((p) => p.id === d.pagadorId);
  const dpRows = await db
    .select()
    .from(despesasParticipantesTable)
    .where(eq(despesasParticipantesTable.despesaId, d.id));
  const dpParticipantes = allParticipantes.filter((p) =>
    dpRows.some((dp) => dp.participanteId === p.id)
  );
  return {
    id: d.id,
    descricao: d.descricao,
    valor: parseFloat(d.valor),
    pagadorId: d.pagadorId,
    pagadorNome: pagador?.nome ?? "",
    grupoId: d.grupoId,
    dataCriacao: d.createdAt.toISOString(),
    categoria: d.categoria,
    participantes: dpParticipantes.map((p) => ({ id: p.id, nome: p.nome, grupoId: p.grupoId })),
  };
}

// GET /grupos/:id/despesas
router.get("/grupos/:id/despesas", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = ListDespesasParams.safeParse({ id: Number(rawId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const despesas = await db
    .select()
    .from(despesasTable)
    .where(eq(despesasTable.grupoId, parsed.data.id))
    .orderBy(despesasTable.createdAt);

  const allParticipantes = await db
    .select()
    .from(participantesTable)
    .where(eq(participantesTable.grupoId, parsed.data.id));

  const result = await Promise.all(
    despesas.map((d) => formatDespesa(d, allParticipantes.map((p) => ({ id: p.id, nome: p.nome, grupoId: p.grupoId }))))
  );

  res.json(result);
});

// POST /grupos/:id/despesas
router.post("/grupos/:id/despesas", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = CreateDespesaParams.safeParse({ id: Number(rawId) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const bodyParsed = CreateDespesaBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const { descricao, valor, pagadorId, participanteIds, categoria } = bodyParsed.data;

  const [despesa] = await db
    .insert(despesasTable)
    .values({
      descricao,
      valor: String(valor),
      pagadorId,
      grupoId: paramsParsed.data.id,
      categoria: categoria ?? "outros",
    })
    .returning();

  // Insert participants
  if (participanteIds.length > 0) {
    await db.insert(despesasParticipantesTable).values(
      participanteIds.map((pid: number) => ({ despesaId: despesa.id, participanteId: pid }))
    );
  }

  const allParticipantes = await db
    .select()
    .from(participantesTable)
    .where(eq(participantesTable.grupoId, paramsParsed.data.id));

  const formatted = await formatDespesa(
    despesa,
    allParticipantes.map((p) => ({ id: p.id, nome: p.nome, grupoId: p.grupoId }))
  );

  res.status(201).json(formatted);
});

// GET /despesas/:id
router.get("/despesas/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetDespesaParams.safeParse({ id: Number(rawId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [d] = await db
    .select()
    .from(despesasTable)
    .where(eq(despesasTable.id, parsed.data.id));

  if (!d) {
    res.status(404).json({ error: "Despesa não encontrada" });
    return;
  }

  const allParticipantes = await db
    .select()
    .from(participantesTable)
    .where(eq(participantesTable.grupoId, d.grupoId));

  const formatted = await formatDespesa(
    d,
    allParticipantes.map((p) => ({ id: p.id, nome: p.nome, grupoId: p.grupoId }))
  );

  res.json(formatted);
});

// DELETE /despesas/:id
router.delete("/despesas/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = DeleteDespesaParams.safeParse({ id: Number(rawId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(despesasTable).where(eq(despesasTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
