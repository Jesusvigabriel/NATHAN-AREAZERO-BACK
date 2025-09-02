import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/palletTipos.controller";

const router = Router();
const prefixAPI = "/apiv3";

router.get(prefixAPI + "/palletTipos", getAll);
router.get(prefixAPI + "/palletTipos/:id", getById);
router.post(prefixAPI + "/palletTipos", create);
router.put(prefixAPI + "/palletTipos/:id", update);
router.delete(prefixAPI + "/palletTipos/:id", remove);

export default router;
