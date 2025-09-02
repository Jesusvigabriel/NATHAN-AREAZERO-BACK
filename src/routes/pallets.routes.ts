import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/pallets.controller";

const router = Router();
const prefixAPI = "/apiv3";

router.get(prefixAPI + "/pallets", getAll);
router.get(prefixAPI + "/pallets/:id", getById);
router.post(prefixAPI + "/pallets", create);
router.put(prefixAPI + "/pallets/:id", update);
router.delete(prefixAPI + "/pallets/:id", remove);

export default router;
