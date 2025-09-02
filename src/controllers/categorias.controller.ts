import { Request, Response } from "express";
import {
    categorias_getAll_DALC,
    categoria_getById_DALC,
    categoria_add_DALC,
    categoria_edit_DALC,
    categoria_deleteById_DALC
} from "../DALC/categorias.dalc";

export const getAll = async (req: Request, res: Response): Promise<Response> => {
    const categorias = await categorias_getAll_DALC();
    if (categorias != null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse(categorias));
    } else {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Error al obtener Categorías"));
    }
};

export const getById = async (req: Request, res: Response): Promise<Response> => {
    const result = await categoria_getById_DALC(parseInt(req.params.id));
    if (result) {
        return res.json(require("lsi-util-node/API").getFormatedResponse(result));
    } else {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Categoría inexistente"));
    }
};

export const create = async (req: Request, res: Response): Promise<Response> => {
    const result = await categoria_add_DALC(req.body);
    return res.json(require("lsi-util-node/API").getFormatedResponse(result));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
    const idCategoria = parseInt(req.params.id);
    const categoria = await categoria_getById_DALC(idCategoria);
    if (categoria) {
        const result = await categoria_edit_DALC(req.body, idCategoria);
        return res.json(require("lsi-util-node/API").getFormatedResponse(result));
    }
    return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Categoría inexistente"));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
    await categoria_deleteById_DALC(parseInt(req.params.id));
    return res.json(require("lsi-util-node/API").getFormatedResponse("OK"));
};
