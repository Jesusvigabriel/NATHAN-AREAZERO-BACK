import {Request, Response} from "express"

import {
  get_guiasFotos_getByIdGuia_DALC
} from '../DALC/guiasFotos.dalc'

export const get_fotosByGuia = async (req: Request, res: Response): Promise<Response> => {

  const response=await get_guiasFotos_getByIdGuia_DALC(parseInt(req.params.IdGuia))
  return res.json(require("lsi-util-node/API").getFormatedResponse(response))
}

export const get_fotosUrlsByGuia = async (req: Request, res: Response): Promise<Response> => {
  try {
    const idGuia = parseInt(req.params.IdGuia)
    const fotosData = await get_guiasFotos_getByIdGuia_DALC(idGuia)
    
    // Construir las URLs de S3 para cada foto
    const fotosUrls = fotosData.map((foto: any) => ({
      Id: foto.Id,
      IdGuia: foto.IdGuia,
      Hash: foto.Hash,
      Url: `https://a54-choferes-fotos-documentacion-entrega.s3.amazonaws.com/a54_cfde_${foto.IdGuia}_${foto.Hash}`
    }))
    
    return res.json(require("lsi-util-node/API").getFormatedResponse(fotosUrls))
  } catch (error) {
    return res.json(require("lsi-util-node/API").getFormatedResponse([], [error]))
  }
}
