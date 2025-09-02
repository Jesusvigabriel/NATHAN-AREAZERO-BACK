import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller";

const router = Router();
const prefixAPI = "/apiv3";

router.get(prefixAPI + "/dashboard/:idEmpresa", getDashboard);

export default router;
