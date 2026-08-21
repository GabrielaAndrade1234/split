/**
 * Seed script — populates the database with sample data for development.
 * Run with: pnpm --filter @workspace/scripts tsx src/seed.ts
 */
import { db } from "@workspace/db";
import {
  gruposTable,
  participantesTable,
  despesasTable,
  despesasParticipantesTable,
} from "@workspace/db";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create sample group
  const [grupo] = await db
    .insert(gruposTable)
    .values({ nome: "Viagem Praia ☀️" })
    .returning();

  console.log(`  ✓ Grupo: ${grupo.nome} (id=${grupo.id})`);

  // Add participants
  const participantes = await db
    .insert(participantesTable)
    .values([
      { nome: "Gabi", grupoId: grupo.id },
      { nome: "Ana", grupoId: grupo.id },
      { nome: "Bruno", grupoId: grupo.id },
      { nome: "Clara", grupoId: grupo.id },
      { nome: "Você", grupoId: grupo.id },
    ])
    .returning();

  console.log(`  ✓ ${participantes.length} participantes`);

  const [gabi, ana, bruno] = participantes;

  // Expense 1: Restaurante beira-mar — Gabi paid, all share
  const [d1] = await db
    .insert(despesasTable)
    .values({
      descricao: "Restaurante beira-mar",
      valor: "185.00",
      categoria: "restaurante",
      pagadorId: gabi.id,
      grupoId: grupo.id,
    })
    .returning();
  await db.insert(despesasParticipantesTable).values(
    participantes.map((p) => ({ despesaId: d1.id, participanteId: p.id }))
  );

  // Expense 2: Uber para pousada — Bruno paid, all share
  const [d2] = await db
    .insert(despesasTable)
    .values({
      descricao: "Uber para pousada",
      valor: "62.40",
      categoria: "transporte",
      pagadorId: bruno.id,
      grupoId: grupo.id,
    })
    .returning();
  await db.insert(despesasParticipantesTable).values(
    participantes.map((p) => ({ despesaId: d2.id, participanteId: p.id }))
  );

  // Expense 3: Mercado — Ana paid, first 3 share
  const [d3] = await db
    .insert(despesasTable)
    .values({
      descricao: "Mercado",
      valor: "120.00",
      categoria: "compras",
      pagadorId: ana.id,
      grupoId: grupo.id,
    })
    .returning();
  await db.insert(despesasParticipantesTable).values(
    [gabi, ana, bruno].map((p) => ({ despesaId: d3.id, participanteId: p.id }))
  );

  console.log("  ✓ 3 despesas");
  console.log("🎉 Seed complete!");
}

seed().catch(console.error);
