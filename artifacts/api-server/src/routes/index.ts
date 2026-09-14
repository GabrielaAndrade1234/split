import { Router, type IRouter } from "express";
import healthRouter from "./health";
import gruposRouter from "./grupos";
import participantesRouter from "./participantes";
import despesasRouter from "./despesas";
import dividasRouter from "./dividas";
import aiExpensesRouter from "./ai-expenses";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gruposRouter);
router.use(participantesRouter);
router.use(despesasRouter);
router.use(dividasRouter);
router.use(aiExpensesRouter);

export default router;
