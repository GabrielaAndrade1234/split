import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, participantesTable } from "@workspace/db";
import {
  CreateParticipanteBody,
  CreateParticipanteParams,
  DeleteParticipanteParams,
  ListParticipantesParams,
} from "@workspace/api-zod";

const router = Router();

// GET /grupos/:id/participantes
router.get("/grupos/:id/participantes", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = ListParticipantesParams.safeParse({ id: Number(rawId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const participantes = await db
    .select()
    .from(participantesTable)
    .where(eq(participantesTable.grupoId, parsed.data.id))
    .orderBy(participantesTable.nome);

  res.json(
    participantes.map((p) => ({ id: p.id, nome: p.nome, grupoId: p.grupoId }))
  );
});

// POST /grupos/:id/participantes
router.post("/grupos/:id/participantes", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = CreateParticipanteParams.safeParse({ id: Number(rawId) });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const bodyParsed = CreateParticipanteBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const [p] = await db
    .insert(participantesTable)
    .values({ nome: bodyParsed.data.nome, grupoId: paramsParsed.data.id })
    .returning();

  res.status(201).json({ id: p.id, nome: p.nome, grupoId: p.grupoId });
});

// DELETE /participantes/:id
router.delete("/participantes/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = DeleteParticipanteParams.safeParse({ id: Number(rawId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(participantesTable).where(eq(participantesTable.id, parsed.data.id));
  res.status(204).send();
});

export default router;
