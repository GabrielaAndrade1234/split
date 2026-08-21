import { Router } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  gruposTable,
  participantesTable,
  despesasTable,
  despesasParticipantesTable,
  pagamentosTable,
} from "@workspace/db";
import {
  ListDividasParams,
  MarcarPagamentoBody,
  MarcarPagamentoParams,
} from "@workspace/api-zod";
import { computeTransferencias } from "./grupos";

const router = Router();

// GET /grupos/:id/dividas
router.get("/grupos/:id/dividas", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = ListDividasParams.safeParse({ id: Number(rawId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [grupo] = await db.select().from(gruposTable).where(eq(gruposTable.id, parsed.data.id));
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

  // Compute balances
  const balances: Record<number, number> = {};
  for (const p of participantes) balances[p.id] = 0;

  for (const d of despesas) {
    const dpRows = await db
      .select()
      .from(despesasParticipantesTable)
      .where(eq(despesasParticipantesTable.despesaId, d.id));

    const valor = parseFloat(d.valor);
    const share = valor / (dpRows.length || 1);

    if (balances[d.pagadorId] !== undefined) balances[d.pagadorId] += valor;
    for (const dp of dpRows) {
      if (balances[dp.participanteId] !== undefined) balances[dp.participanteId] -= share;
    }
  }

  const pagamentosFeitos = await db
    .select()
    .from(pagamentosTable)
    .where(eq(pagamentosTable.grupoId, grupo.id));

  for (const p of pagamentosFeitos) {
    const valor = parseFloat(p.valor);
    if (balances[p.pagadorId] !== undefined) balances[p.pagadorId] += valor;
    if (balances[p.recebedorId] !== undefined) balances[p.recebedorId] -= valor;
  }

  const transferencias = computeTransferencias(balances, participantes.map((p) => ({ id: p.id, nome: p.nome, grupoId: p.grupoId })));

  const pagamentosFormatted = pagamentosFeitos.map((p) => {
    const pagador = participantes.find((pp) => pp.id === p.pagadorId);
    const recebedor = participantes.find((pp) => pp.id === p.recebedorId);
    return {
      id: p.id,
      pagadorId: p.pagadorId,
      pagadorNome: pagador?.nome ?? "",
      recebedorId: p.recebedorId,
      recebedorNome: recebedor?.nome ?? "",
      valor: parseFloat(p.valor),
      status: p.status,
      dataCriacao: p.createdAt.toISOString(),
    };
  });

  res.json({
    grupoId: grupo.id,
    nome: grupo.nome,
    transferencias,
    pagamentos: pagamentosFormatted,
  });
});

// POST /grupos/:id/dividas/pagar
router.post("/grupos/:id/dividas/pagar", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = MarcarPagamentoParams.safeParse({ id: Number(rawId) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const bodyParsed = MarcarPagamentoBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const { pagadorId, recebedorId, valor } = bodyParsed.data;

  const participantes = await db
    .select()
    .from(participantesTable)
    .where(eq(participantesTable.grupoId, paramsParsed.data.id));

  const [pagamento] = await db
    .insert(pagamentosTable)
    .values({
      pagadorId,
      recebedorId,
      valor: String(valor),
      status: "pago",
      grupoId: paramsParsed.data.id,
    })
    .returning();

  const pagador = participantes.find((p) => p.id === pagadorId);
  const recebedor = participantes.find((p) => p.id === recebedorId);

  res.json({
    id: pagamento.id,
    pagadorId: pagamento.pagadorId,
    pagadorNome: pagador?.nome ?? "",
    recebedorId: pagamento.recebedorId,
    recebedorNome: recebedor?.nome ?? "",
    valor: parseFloat(pagamento.valor),
    status: pagamento.status,
    dataCriacao: pagamento.createdAt.toISOString(),
  });
});

export default router;
