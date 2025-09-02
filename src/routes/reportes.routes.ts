import {Router} from 'express'
const router = Router()

import { getRotacion } from "../controllers/reportes.controller"

const prefixAPI = "/apiv3"

router.get(prefixAPI+"/reportes/rotacion/:idEmpresa", getRotacion)

export default router
