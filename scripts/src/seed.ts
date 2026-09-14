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
  pagamentosTable,
} from "@workspace/db";

const groupFixtures = [
  {
    nome: "Viagem Praia ☀️",
    participantes: ["Gabi", "Ana", "Bruno", "Clara", "Você"],
    despesas: [
      ["Restaurante beira-mar", "185.00", "restaurante"],
      ["Uber para pousada", "62.40", "transporte"],
      ["Mercado", "120.00", "compras"],
    ],
  },
  {
    nome: "Fim de semana em Campos",
    participantes: ["Rafa", "Bia", "Caio", "Duda", "Leo"],
    despesas: [
      ["Hospedagem na serra", "480.00", "hospedagem"],
      ["Fondue", "156.50", "restaurante"],
      ["Combustível", "210.00", "transporte"],
    ],
  },
  {
    nome: "Churrasco da firma",
    participantes: ["Ivo", "Júlia", "Nando", "Paula", "Vini"],
    despesas: [
      ["Carnes e acompanhamentos", "275.90", "compras"],
      ["Bebidas", "98.70", "compras"],
      ["Carvão e descartáveis", "45.00", "outros"],
    ],
  },
  {
    nome: "Casa nova",
    participantes: ["Lia", "Marcos", "Nina", "Otávio", "Sofia"],
    despesas: [
      ["Pizza da mudança", "89.90", "restaurante"],
      ["Materiais de limpeza", "73.25", "compras"],
      ["Frete dos móveis", "190.00", "transporte"],
    ],
  },
  {
    nome: "Festival de música",
    participantes: ["Alice", "Bernardo", "Cecília", "Diego", "Elisa"],
    despesas: [
      ["Ingressos", "620.00", "lazer"],
      ["Camping", "240.00", "hospedagem"],
      ["Lanches do festival", "132.80", "alimentação"],
    ],
  },
  {
    nome: "Trilha na serra",
    participantes: ["Fê", "Gui", "Hugo", "Isa", "João"],
    despesas: [
      ["Aluguel do carro", "320.00", "transporte"],
      ["Equipamentos", "115.00", "lazer"],
      ["Almoço da trilha", "104.60", "restaurante"],
    ],
  },
  {
    nome: "Jantar de aniversário",
    participantes: ["Karen", "Luca", "Malu", "Noah", "Olívia"],
    despesas: [
      ["Jantar", "360.00", "restaurante"],
      ["Bolo", "78.00", "alimentação"],
      ["Decoração", "52.40", "outros"],
    ],
  },
  {
    nome: "Réveillon",
    participantes: ["Pedro", "Rita", "Samuel", "Tainá", "Ursula"],
    despesas: [
      ["Aluguel da casa", "900.00", "hospedagem"],
      ["Ceia", "425.75", "alimentação"],
      ["Fogos e decoração", "140.00", "lazer"],
    ],
  },
  {
    nome: "Piquenique no parque",
    participantes: ["Val", "Wesley", "Xavier", "Yasmin", "Zeca"],
    despesas: [
      ["Cesta de piquenique", "148.30", "alimentação"],
      ["Bebidas", "44.90", "compras"],
      ["Aluguel de bicicletas", "80.00", "lazer"],
    ],
  },
  {
    nome: "Intercâmbio",
    participantes: ["Aline", "Breno", "Carla", "Davi", "Estela"],
    despesas: [
      ["Seguro viagem", "285.00", "viagem"],
      ["Transporte urbano", "96.40", "transporte"],
      ["Jantar de despedida", "210.00", "restaurante"],
    ],
  },
] as const;

async function seed() {
  console.log("🌱 Seeding database...");

  await db.transaction(async (tx) => {
    for (const fixture of groupFixtures) {
      const existingGroup = (
        await tx.select().from(gruposTable)
      ).find((group) => group.nome === fixture.nome);

      const grupo =
        existingGroup ??
        (
          await tx
            .insert(gruposTable)
            .values({ nome: fixture.nome })
            .returning()
        )[0];

      const participantesExistentes = (
        await tx.select().from(participantesTable)
      ).filter((participant) => participant.grupoId === grupo.id);

      const participantes = [...participantesExistentes];
      for (const nome of fixture.participantes) {
        const participanteExistente = participantes.find((p) => p.nome === nome);
        if (participanteExistente) continue;

        const [participante] = await tx
          .insert(participantesTable)
          .values({ nome, grupoId: grupo.id })
          .returning();
        participantes.push(participante);
      }

      const despesasExistentes = (
        await tx.select().from(despesasTable)
      ).filter((expense) => expense.grupoId === grupo.id);

      for (let index = despesasExistentes.length; index < fixture.despesas.length; index += 1) {
        const [descricao, valor, categoria] = fixture.despesas[index];
        const pagador = participantes[index % participantes.length];
        const [despesa] = await tx
          .insert(despesasTable)
          .values({
            descricao,
            valor,
            categoria,
            pagadorId: pagador.id,
            grupoId: grupo.id,
          })
          .returning();

        const participantesDoRateio =
          index === 2 ? participantes.slice(0, 3) : participantes;
        await tx.insert(despesasParticipantesTable).values(
          participantesDoRateio.map((participante) => ({
            despesaId: despesa.id,
            participanteId: participante.id,
          }))
        );
      }

      const pagamentosDoGrupo = (
        await tx.select().from(pagamentosTable)
      ).filter((payment) => payment.grupoId === grupo.id).slice(0, 1);

      if (pagamentosDoGrupo.length === 0 && participantes.length >= 2) {
        const pagador = participantes[0];
        const recebedor = participantes[1];
        await tx.insert(pagamentosTable).values({
          pagadorId: pagador.id,
          recebedorId: recebedor.id,
          valor: (25 + fixture.nome.length).toFixed(2),
          status: "pago",
          grupoId: grupo.id,
        });
      }
    }
  });

  const counts = await Promise.all([
    db.select().from(gruposTable),
    db.select().from(participantesTable),
    db.select().from(despesasTable),
    db.select().from(despesasParticipantesTable),
    db.select().from(pagamentosTable),
  ]);
  const [grupos, participantes, despesas, rateios, pagamentos] = counts;
  console.log(`  ✓ ${grupos.length} grupos`);
  console.log(`  ✓ ${participantes.length} participantes`);
  console.log(`  ✓ ${despesas.length} despesas`);
  console.log(`  ✓ ${rateios.length} registros de despesas_participantes`);
  console.log(`  ✓ ${pagamentos.length} pagamentos`);
  console.log("🎉 Seed complete!");
}

seed().catch(console.error);
