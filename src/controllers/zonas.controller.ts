import { Request, Response } from "express";
import { zonas_getAll_DALC, zona_setPosiciones_DALC } from "../DALC/zonas.dalc";

export const getZonas = async (_req: Request, res: Response): Promise<Response> => {
    const zonas = await zonas_getAll_DALC();
    return res.json(require("lsi-util-node/API").getFormatedResponse(zonas));
};

export const setPosiciones = async (req: Request, res: Response): Promise<Response> => {
    const idZona = Number(req.params.idZona);
    const posiciones: number[] = Array.isArray(req.body.posiciones) ? req.body.posiciones : [];
    if (isNaN(idZona)) {
        return res.status(400).json(require("lsi-util-node/API").getFormatedResponse("", "Parámetro idZona inválido"));
    }
    await zona_setPosiciones_DALC(idZona, posiciones.map(Number));
    return res.json(require("lsi-util-node/API").getFormatedResponse({ ok: true }));
};
