import { Request, Response } from "express"
import { reporte_rotacion_DALC } from "../DALC/reportes.dalc"

export const getRotacion = async (req: Request, res: Response): Promise<Response> => {
    const idEmpresa = Number(req.params.idEmpresa)
    const zona = req.query.zona ? String(req.query.zona) : undefined
    const data = await reporte_rotacion_DALC(idEmpresa, zona)
    return res.json(require("lsi-util-node/API").getFormatedResponse(data))
}
