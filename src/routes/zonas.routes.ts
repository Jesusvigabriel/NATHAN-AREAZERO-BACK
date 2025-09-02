import { Router } from "express";
import { getZonas, setPosiciones } from "../controllers/zonas.controller";

const router = Router();
const prefixAPI = "/apiv3";

router.get(prefixAPI + "/zonas", getZonas);
router.post(prefixAPI + "/zonas/:idZona/posiciones", setPosiciones);

export default router;
