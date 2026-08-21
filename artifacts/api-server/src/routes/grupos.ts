import { Router } from "express";
import { eq, sql } from "drizzle-orm";
import { db, gruposTable, participantesTable, despesasTable, despesasParticipantesTable, pagamentosTable } from "@workspace/db";
import {
  CreateGrupoBody,
  UpdateGrupoBody,
  GetGrupoParams,
  UpdateGrupoParams,
  DeleteGrupoParams,
  GetGrupoResumoParams,
} from "@workspace/api-zod";

const router = Router();

// GET /grupos
router.get("/grupos", async (req, res): Promise<void> => {
  const grupos = await db.select().from(gruposTable).orderBy(gruposTable.createdAt);

  const result = await Promise.all(
    grupos.map(async (g) => {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(participantesTable)
        .where(eq(participantesTable.grupoId, g.id));
      return {
        id: g.id,
        nome: g.nome,
        dataCriacao: g.createdAt.toISOString(),
        totalParticipantes: count,
      };
    })
  );

  res.json(result);
});

// POST /grupos
router.post("/grupos", async (req, res): Promise<void> => {
  const parsed = CreateGrupoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [grupo] = await db
    .insert(gruposTable)
    .values({ nome: parsed.data.nome })
    .returning();

  // Add initial participants if provided
  if (parsed.data.participantes && parsed.data.participantes.length > 0) {
    await db.insert(participantesTable).values(
      parsed.data.participantes.map((nome: string) => ({ nome, grupoId: grupo.id }))
    );
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(participantesTable)
    .where(eq(participantesTable.grupoId, grupo.id));

  res.status(201).json({
    id: grupo.id,
    nome: grupo.nome,
    dataCriacao: grupo.createdAt.toISOString(),
    totalParticipantes: count,
  });
});

// GET /grupos/:id
router.get("/grupos/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetGrupoParams.safeParse({ id: Number(rawId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [grupo] = await db
    .select()
    .from(gruposTable)
    .where(eq(gruposTable.id, parsed.data.id));

  if (!grupo) {
    res.status(404).json({ error: "Grupo não encontrado" });
    return;
  }

  const participantes = await db
    .select()
    .from(participantesTable)
    .where(eq(participantesTable.grupoId, grupo.id))
    .orderBy(participantesTable.nome);

  res.json({
    id: grupo.id,
    nome: grupo.nome,
    dataCriacao: grupo.createdAt.toISOString(),
    participantes: participantes.map((p) => ({
      id: p.id,
      nome: p.nome,
      grupoId: p.grupoId,
    })),
  });
});

// PATCH /grupos/:id
router.patch("/grupos/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = UpdateGrupoParams.safeParse({ id: Number(rawId) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const bodyParsed = UpdateGrupoBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (bodyParsed.data.nome) updates.nome = bodyParsed.data.nome;

  const [updated] = await db
    .update(gruposTable)
    .set(updates)
    .where(eq(gruposTable.id, paramsParsed.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Grupo não encontrado" });
    return;
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(participantesTable)
    .where(eq(participantesTable.grupoId, updated.id));

  res.json({
    id: updated.id,
    nome: updated.nome,
    dataCriacao: updated.createdAt.toISOString(),
    totalParticipantes: count,
  });
});

// DELETE /grupos/:id
router.delete("/grupos/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = DeleteGrupoParams.safeParse({ id: Number(rawId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(gruposTable).where(eq(gruposTable.id, parsed.data.id));
  res.status(204).send();
});

// GET /grupos/:id/resumo
router.get("/grupos/:id/resumo", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetGrupoResumoParams.safeParse({ id: Number(rawId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [grupo] = await db
    .select()
    .from(gruposTable)
    .where(eq(gruposTable.id, parsed.data.id));

  if (!grupo) {
    res.status(404).json({ error: "Grupo não encontrado" });
    return;
  }

  const participantes = await db
    .select()
    .from(participantesTable)
    .where(eq(participantesTable.grupoId, grupo.id));

  const despesas = await db
    .select()
    .from(despesasTable)
    .where(eq(despesasTable.grupoId, grupo.id));

  // Calculate balances
  const balances: Record<number, number> = {};
  for (const p of participantes) balances[p.id] = 0;

  for (const d of despesas) {
    const dpRows = await db
      .select()
      .from(despesasParticipantesTable)
      .where(eq(despesasParticipantesTable.despesaId, d.id));

    const valor = parseFloat(d.valor);
    const share = valor / dpRows.length;

    // Payer gets credited
    if (balances[d.pagadorId] !== undefined) {
      balances[d.pagadorId] += valor;
    }
    // Each participant owes their share
    for (const dp of dpRows) {
      if (balances[dp.participanteId] !== undefined) {
        balances[dp.participanteId] -= share;
      }
    }
  }

  // Subtract confirmed payments from balances
  const pagamentos = await db
    .select()
    .from(pagamentosTable)
    .where(eq(pagamentosTable.grupoId, grupo.id));

  for (const p of pagamentos) {
    const valor = parseFloat(p.valor);
    if (balances[p.pagadorId] !== undefined) balances[p.pagadorId] += valor;
    if (balances[p.recebedorId] !== undefined) balances[p.recebedorId] -= valor;
  }

  // Compute simplified transfers (min-cash-flow algorithm)
  const transferencias = computeTransferencias(balances, participantes);

  // Totals
  const saldoTotal = transferencias.reduce((s, t) => s + t.valor, 0);
  const aReceber = Object.values(balances).filter((b) => b > 0.005).reduce((s, b) => s + b, 0);
  const aPagar = Math.abs(Object.values(balances).filter((b) => b < -0.005).reduce((s, b) => s + b, 0));

  // Recent despesas
  const recentDespesas = await db
    .select()
    .from(despesasTable)
    .where(eq(despesasTable.grupoId, grupo.id))
    .orderBy(despesasTable.createdAt)
    .limit(5);

  const despesasFormatted = await Promise.all(
    recentDespesas.map(async (d) => {
      const pagador = participantes.find((p) => p.id === d.pagadorId);
      const dpRows = await db
        .select()
        .from(despesasParticipantesTable)
        .where(eq(despesasParticipantesTable.despesaId, d.id));
      const dpParticipantes = participantes.filter((p) =>
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
    })
  );

  res.json({
    grupoId: grupo.id,
    nome: grupo.nome,
    saldoTotal: Math.round(saldoTotal * 100) / 100,
    aReceber: Math.round(aReceber * 100) / 100,
    aPagar: Math.round(aPagar * 100) / 100,
    transferencias,
    despesasRecentes: despesasFormatted,
  });
});

function computeTransferencias(
  balances: Record<number, number>,
  participantes: Array<{ id: number; nome: string; grupoId: number }>
): Array<{ pagadorId: number; pagadorNome: string; recebedorId: number; recebedorNome: string; valor: number }> {
  const getNome = (id: number) => participantes.find((p) => p.id === id)?.nome ?? String(id);

  // Min cash flow greedy
  const creditors: Array<{ id: number; amount: number }> = [];
  const debtors: Array<{ id: number; amount: number }> = [];

  for (const [idStr, bal] of Object.entries(balances)) {
    const id = Number(idStr);
    if (bal > 0.005) creditors.push({ id, amount: bal });
    else if (bal < -0.005) debtors.push({ id, amount: -bal });
  }

  const transfers: Array<{ pagadorId: number; pagadorNome: string; recebedorId: number; recebedorNome: string; valor: number }> = [];

  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);
    if (amount > 0.005) {
      transfers.push({
        pagadorId: debtor.id,
        pagadorNome: getNome(debtor.id),
        recebedorId: creditor.id,
        recebedorNome: getNome(creditor.id),
        valor: Math.round(amount * 100) / 100,
      });
    }
    debtor.amount -= amount;
    creditor.amount -= amount;
    if (debtor.amount < 0.005) i++;
    if (creditor.amount < 0.005) j++;
  }

  return transfers;
}

export { computeTransferencias };
export default router;
