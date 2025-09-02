import { Request, Response } from "express";
import {
    pallets_getAll_DALC,
    pallet_getById_DALC,
    pallet_add_DALC,
    pallet_edit_DALC,
    pallet_deleteById_DALC
} from "../DALC/pallets.dalc";
import { palletTipo_getById_DALC } from "../DALC/palletTipos.dalc";

export const getAll = async (req: Request, res: Response): Promise<Response> => {
    const pallets = await pallets_getAll_DALC();
    return res.json(require("lsi-util-node/API").getFormatedResponse(pallets));
};

export const getById = async (req: Request, res: Response): Promise<Response> => {
    const pallet = await pallet_getById_DALC(parseInt(req.params.id));
    if (pallet) {
        return res.json(require("lsi-util-node/API").getFormatedResponse(pallet));
    }
    return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Pallet inexistente"));
};

export const create = async (req: Request, res: Response): Promise<Response> => {
    const { PalletTipoId, VolumenOcupadoCm3 = 0, PesoOcupadoKg = 0 } = req.body;
    const tipo = await palletTipo_getById_DALC(PalletTipoId);
    if (!tipo) {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Tipo de pallet inexistente"));
    }
    if (VolumenOcupadoCm3 > tipo.CapacidadVolumenCm3 || PesoOcupadoKg > tipo.CapacidadPesoKg) {
        return res.status(400).json(require("lsi-util-node/API").getFormatedResponse("", "Capacidad excedida"));
    }
    const result = await pallet_add_DALC(req.body);
    return res.json(require("lsi-util-node/API").getFormatedResponse(result));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);
    const pallet = await pallet_getById_DALC(id);
    if (!pallet) {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Pallet inexistente"));
    }
    const palletTipoId = req.body.PalletTipoId ?? pallet.PalletTipoId;
    const tipo = await palletTipo_getById_DALC(palletTipoId);
    if (!tipo) {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Tipo de pallet inexistente"));
    }
    const volumen = req.body.VolumenOcupadoCm3 ?? pallet.VolumenOcupadoCm3;
    const peso = req.body.PesoOcupadoKg ?? pallet.PesoOcupadoKg;
    if (volumen > tipo.CapacidadVolumenCm3 || peso > tipo.CapacidadPesoKg) {
        return res.status(400).json(require("lsi-util-node/API").getFormatedResponse("", "Capacidad excedida"));
    }
    const result = await pallet_edit_DALC(req.body, id);
    return res.json(require("lsi-util-node/API").getFormatedResponse(result));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
    await pallet_deleteById_DALC(parseInt(req.params.id));
    return res.json(require("lsi-util-node/API").getFormatedResponse("OK"));
};
