import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/categorias.controller";

const router = Router();
const prefixAPI = "/apiv3";

router.get(prefixAPI + "/categorias", getAll);
router.get(prefixAPI + "/categorias/:id", getById);
router.post(prefixAPI + "/categorias", create);
router.put(prefixAPI + "/categorias/:id", update);
router.delete(prefixAPI + "/categorias/:id", remove);

export default router;
