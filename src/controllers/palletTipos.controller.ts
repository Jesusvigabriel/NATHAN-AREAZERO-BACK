import { Request, Response } from "express";
import {
    palletTipos_getAll_DALC,
    palletTipo_getById_DALC,
    palletTipo_add_DALC,
    palletTipo_edit_DALC,
    palletTipo_deleteById_DALC
} from "../DALC/palletTipos.dalc";

export const getAll = async (req: Request, res: Response): Promise<Response> => {
    const tipos = await palletTipos_getAll_DALC();
    return res.json(require("lsi-util-node/API").getFormatedResponse(tipos));
};

export const getById = async (req: Request, res: Response): Promise<Response> => {
    const tipo = await palletTipo_getById_DALC(parseInt(req.params.id));
    if (tipo) {
        return res.json(require("lsi-util-node/API").getFormatedResponse(tipo));
    }
    return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Tipo de pallet inexistente"));
};

export const create = async (req: Request, res: Response): Promise<Response> => {
    const { CapacidadPesoKg, CapacidadVolumenCm3 } = req.body;
    if (CapacidadPesoKg < 0 || CapacidadVolumenCm3 < 0) {
        return res.status(400).json(require("lsi-util-node/API").getFormatedResponse("", "Capacidades inválidas"));
    }
    const result = await palletTipo_add_DALC(req.body);
    return res.json(require("lsi-util-node/API").getFormatedResponse(result));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);
    const tipo = await palletTipo_getById_DALC(id);
    if (!tipo) {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Tipo de pallet inexistente"));
    }
    const capacidadPeso = req.body.CapacidadPesoKg ?? tipo.CapacidadPesoKg;
    const capacidadVolumen = req.body.CapacidadVolumenCm3 ?? tipo.CapacidadVolumenCm3;
    if (capacidadPeso < 0 || capacidadVolumen < 0) {
        return res.status(400).json(require("lsi-util-node/API").getFormatedResponse("", "Capacidades inválidas"));
    }
    const result = await palletTipo_edit_DALC(req.body, id);
    return res.json(require("lsi-util-node/API").getFormatedResponse(result));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
    await palletTipo_deleteById_DALC(parseInt(req.params.id));
    return res.json(require("lsi-util-node/API").getFormatedResponse("OK"));
};
