import { Request, Response } from "express"
import { reporte_rotacion_DALC } from "../DALC/reportes.dalc"

export const getRotacion = async (req: Request, res: Response): Promise<Response> => {
    const idEmpresa = Number(req.params.idEmpresa)
    const data = await reporte_rotacion_DALC(idEmpresa)
    return res.json(require("lsi-util-node/API").getFormatedResponse(data))
}
