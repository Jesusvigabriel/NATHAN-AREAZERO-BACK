import {Request, Response} from "express"
import { getConnection } from "typeorm"
import {
    posiciones_getAll_DALC,
    posicion_getByNombre_DALC,
    posicion_getById_DALC,
    posicion_getContent_ByIdPosicion_DALC,
    posicion_vaciar_DALC,
    posiciones_getContenidos_byNombre_DALC,
    posicion_modify,
    posiciones_obtenerConPosicionadoNegativo,
    posicion_add,
    posicion_delete_DALC,
    posicion_getByIdProd_DALC,
    posicionAnterior_getByIdProd_DALC,
    posiciones_getByIdProd_DALC,
    detallePosicion_getByIdProd_DALC,
    fechaPos_edit_DALC,
    posicion_getContent_ByIdProducto_DALC,
    posicion_getOcupacion_DALC,
    getAllPosicionesByIdEmpresa_DALC,
    posiciones_getByIdProdAndLote_DALC,
    posiciones_getByLote_DALC,
    posiciones_getByLoteDetalle_DALC,
    posiciones_getAllByEmpresaConDetalle_DALC,
    posiciones_getAllByEmpresaConProductos_DALC,
    posiciones_getHeatmap_DALC
} from '../DALC/posiciones.dalc'
import { HistoricoPosiciones } from "../entities/HistoricoPosiciones"

export const getPosicionesConPosicionadoNegativo = async (req: Request, res: Response): Promise<Response> => {

    const result = await posiciones_obtenerConPosicionadoNegativo()
    if (result!=null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse(result))
    } else {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Error interno"))
    }
}

export const setPosicion = async (req: Request, res: Response): Promise<Response> => {
    const { capacidadPeso, capacidadVolumen, factorDesperdicio, categoriaPermitidaId } = req.body
    const api = require("lsi-util-node/API")

    if ([capacidadPeso, capacidadVolumen, factorDesperdicio].some((v: number) => v !== undefined && v < 0)) {
        return res.status(400).json(api.getFormatedResponse("", "Los valores no pueden ser negativos"))
    }

    if (categoriaPermitidaId !== undefined) {
        const categoria = await getConnection().query("SELECT Id FROM categorias WHERE Id = ?", [categoriaPermitidaId])
        if (categoria.length === 0) {
            return res.status(400).json(api.getFormatedResponse("", "Categoría inexistente"))
        }
    }

    const body: any = { ...req.body }
    if (capacidadPeso !== undefined) { body.CapacidadPesoKg = capacidadPeso; delete body.capacidadPeso }
    if (capacidadVolumen !== undefined) { body.CapacidadVolumenCm3 = capacidadVolumen; delete body.capacidadVolumen }
    if (factorDesperdicio !== undefined) { body.FactorDesperdicio = factorDesperdicio; delete body.factorDesperdicio }
    if (categoriaPermitidaId !== undefined) { body.CategoriaPermitidaId = categoriaPermitidaId; delete body.categoriaPermitidaId }

    const result = await posicion_modify(parseInt(req.params.id), body)
    if (result!=null) {
        return res.json(api.getFormatedResponse(result))
    } else {
        return res.status(404).json(api.getFormatedResponse("", "Error interno"))
    }
}

export const newPosicion = async (req: Request, res: Response): Promise<Response> => {
    const { nombre, capacidadPeso, capacidadVolumen, factorDesperdicio, categoriaPermitidaId } = req.body
    const api = require("lsi-util-node/API")

    if (!nombre) {
        return res.status(400).json(api.getFormatedResponse("", "Nombre requerido"))
    }

    if ([capacidadPeso, capacidadVolumen, factorDesperdicio].some((v: number) => v !== undefined && v < 0)) {
        return res.status(400).json(api.getFormatedResponse("", "Los valores no pueden ser negativos"))
    }

    if (categoriaPermitidaId !== undefined) {
        const categoria = await getConnection().query("SELECT Id FROM categorias WHERE Id = ?", [categoriaPermitidaId])
        if (categoria.length === 0) {
            return res.status(400).json(api.getFormatedResponse("", "Categoría inexistente"))
        }
    }

    const result = await posicion_add(nombre, capacidadPeso, capacidadVolumen, factorDesperdicio, categoriaPermitidaId)
    if (result.status) {
        return res.json(api.getFormatedResponse(result.detalle))
    } else {
        return res.status(404).json(api.getFormatedResponse("", result.detalle))
    }
}

export const getContenidosDePosiciones_byNombres = async (req: Request, res: Response): Promise<Response> => {

    // console.log(req.params.posiciones);
    const posicionesRecibidas=req.params.posiciones.split(",")
    // console.log(posicionesRecibidas);
    // const posiciones=["001-01-01", "001-01-02"]
    const result = await posiciones_getContenidos_byNombre_DALC(posicionesRecibidas)
    if (result!=null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse(result))
    } else {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Error interno"))
    }
}

// export const getContenidosDePosiciones = async (req: Request, res: Response): Promise<Response> => {

//     const lsiValidators=require("lsi-util-node/validators")
//     const missingParameters=lsiValidators.requestParamsFilled(req.body, ["nombresPosiciones"])
//     if (missingParameters.length>0) {
//         return res.status(400).json(require("lsi-util-node/API").getFormatedResponse("", {missingParameters}))
//     }
//     const result = await posiciones_getContenidos_byNombre_DALC(req.body.nombresPosiciones)
//     if (result!=null) {
//         return res.json(require("lsi-util-node/API").getFormatedResponse(result))
//     } else {
//         return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Error interno"))
//     }
// }

export const vaciarPosicion = async (req: Request, res: Response): Promise <Response> => {
    const posicionAVaciar=await posicion_getById_DALC(parseInt(req.params.id))
    if (posicionAVaciar==null) {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Posición existente"))        
    }
    const results=await posicion_vaciar_DALC(parseInt(req.params.id))
    return res.json(require("lsi-util-node/API").getFormatedResponse({registrosEliminados: results.affected}))
}

export const eliminarPosicion = async (req: Request, res: Response): Promise <Response> => {
    const posicionAEliminar=await posicion_getById_DALC(parseInt(req.params.id))
    if (posicionAEliminar==null) {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Posición existente"))        
    }
    const results=await posicion_delete_DALC(parseInt(req.params.id))
    return res.json(require("lsi-util-node/API").getFormatedResponse(results))
}

export const getPosiciones = async (req: Request, res: Response): Promise <Response> => {
    const todasLasPosiciones = await posiciones_getAll_DALC()

    return res.json(require("lsi-util-node/API").getFormatedResponse(todasLasPosiciones))
}

export const getPosicionesPorNombre = async (req: Request, res: Response): Promise <Response> => {
    const unaPosicion = await posicion_getByNombre_DALC(req.params.nombre) 

    if (unaPosicion!=null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse(unaPosicion))
    } else {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Posición inexistente"))
    }
}

export const getByID = async (req: Request, res: Response): Promise <Response> => {
    const unaPosicion = await posicion_getById_DALC(parseInt(req.params.id))

    if (unaPosicion!=null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse(unaPosicion))
    } else {
        return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", "Posición inexistente"))
    }
}

export const getContentByID = async (req: Request, res: Response): Promise <Response> => {
    const results = await posicion_getContent_ByIdPosicion_DALC(parseInt(req.params.id))
    if (results==null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse("", "Id Posición inexistente"))
    }
    return res.json(require("lsi-util-node/API").getFormatedResponse(results))
}

export const getOcupacionById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const idPosicion = Number(req.params.id)
        if (isNaN(idPosicion)) {
            return res.status(400).json(
                require("lsi-util-node/API").getFormatedResponse("", "Parámetro id inválido")
            )
        }

        const idEmpresa = req.query.empresa
            ? Number(req.query.empresa)
            : undefined
        const zona = req.query.zona ? String(req.query.zona) : undefined

        const ocupacion = await posicion_getOcupacion_DALC(idPosicion, {
            idEmpresa,
            zona,
        })

        return res.json(
            require("lsi-util-node/API").getFormatedResponse(ocupacion)
        )
    } catch (err: any) {
        return res.status(500).json(
            require("lsi-util-node/API").getFormatedResponse(
                "",
                err.message || "Error interno"
            )
        )
    }
}

export const getAllPosicionesByIdEmpresa = async (req: Request, res: Response): Promise <Response> => {
    const results = await getAllPosicionesByIdEmpresa_DALC(parseInt(req.params.idEmpresa))
    if (results==null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse("", "Id Posición inexistente"))
    }
    return res.json(require("lsi-util-node/API").getFormatedResponse(results))
}

export const editFechaPos_Prod = async (req: Request, res: Response): Promise <Response> => {
    
    
    const result = await fechaPos_edit_DALC(Number(req.params.id), new Date(req.params.fecha))

    return res.json(require("lsi-util-node/API").getFormatedResponse(result))
   

}

export const getPosicionByIdProducto = async (req: Request, res: Response): Promise <Response> => {
    
    const pos_prod = await posicion_getByIdProd_DALC(parseInt(req.params.idProducto),parseInt(req.params.idEmpresa))
    if (pos_prod==null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse("", "El producto no esta posicionado"))
    }else{
       const  results = await posicion_getById_DALC(pos_prod.IdPosicion)
       if(results)
       {
        return res.json(require("lsi-util-node/API").getFormatedResponse(results))
       }else
       {
        return res.json(require("lsi-util-node/API").getFormatedResponse("", "Posición Inexistente"))
       }
       
    }
    
    
}

export const getPosicionesByIdProducto = async (req: Request, res: Response): Promise <Response> => {
    
    const pos_prod = await posiciones_getByIdProd_DALC(parseInt(req.params.idProducto),parseInt(req.params.idEmpresa))
    if (pos_prod==null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse("", "El producto no esta posicionado"))
    }else{
       
        return res.json(require("lsi-util-node/API").getFormatedResponse(pos_prod))    
    } 
}

export const getPosicionesByIdProductoAndLote = async (req: Request, res: Response): Promise <Response> => {
    
    const pos_prod = await posiciones_getByIdProdAndLote_DALC(parseInt(req.params.idProducto),parseInt(req.params.idEmpresa), req.params.lote)
    if (pos_prod==null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse("", "El producto no esta posicionado"))
    }else{
       
        return res.json(require("lsi-util-node/API").getFormatedResponse(pos_prod))    
    } 
}

export const getPosicionesByLote = async (req: Request, res: Response): Promise <Response> => {
    
    const pos_prod = await posiciones_getByLote_DALC(parseInt(req.params.idEmpresa), req.params.lote)
    if (pos_prod==null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse("", "El producto no esta posicionado"))
    }else{
       
        return res.json(require("lsi-util-node/API").getFormatedResponse(pos_prod))    
    } 
}

export const getPosicionesByLoteDetalle = async (req: Request, res: Response): Promise <Response> => {
    
    const pos_prod = await posiciones_getByLoteDetalle_DALC(parseInt(req.params.idEmpresa))
    if (pos_prod==null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse("", "El producto no esta posicionado"))
    }else{
       
        return res.json(require("lsi-util-node/API").getFormatedResponse(pos_prod))    
    } 
}

export const getDetallePosicionesProductoByIdProducto = async (req: Request, res: Response): Promise <Response> => {
    const pos_prod = await posicion_getContent_ByIdProducto_DALC(Number(req.params.idProducto))
    if (pos_prod==null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse("", "El producto no esta posicionado"))
    }else{
       
        return res.json(require("lsi-util-node/API").getFormatedResponse(pos_prod))    
    } 
}

export const getDetallePosicionByIdProducto = async (req: Request, res: Response): Promise <Response> => {
    
    const pos_prod = await detallePosicion_getByIdProd_DALC(parseInt(req.params.idProducto),parseInt(req.params.idEmpresa))
    if (pos_prod==null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse("", "El producto no tiene detalle de posiciones"))
    }else{
       
        return res.json(require("lsi-util-node/API").getFormatedResponse(pos_prod))
       
       
    }
    
    
}





//Obtengo las posiciones Anteriores
export const getPosicionAnteriorByIdProducto = async (req: Request, res: Response): Promise <Response> => {
    let pos_prod :any = {}
    let posiciones = []
    let results:any = []
   
       pos_prod = await posicionAnterior_getByIdProd_DALC(parseInt(req.params.idProducto),parseInt(req.params.idEmpresa))
     
    if (pos_prod==null) {
        return res.json(require("lsi-util-node/API").getFormatedResponse("", "El producto no tiene posiciones anteriores"))
    }else{
         for(const pos of pos_prod){
             results = await posicion_getById_DALC(pos.IdPosicion)
            posiciones.push({Nombre:results.Nombre, Fecha:pos.Fecha.toLocaleDateString(), Unidades: pos.Unidades} )
         }   
       
        return res.json(require("lsi-util-node/API").getFormatedResponse(posiciones))
           
    }
     
    
}


/**
 * Controlador: obtiene, para una empresa, el detalle de posiciones por producto
 * @route   GET /apiv3/posiciones/getAllByEmpresaConDetalle/:idEmpresa
 */
export const getPosicionesConDetalleByEmpresa = async (req: Request, res: Response): Promise<Response> => {
    try {
        // parseamos y validamos el parámetro
        const idEmpresa = Number(req.params.idEmpresa);
        if (isNaN(idEmpresa)) {
            return res.status(400).json(
                require('lsi-util-node/API').getFormatedResponse(
                    '', 
                    'Parámetro idEmpresa inválido'
                )
            );
        }
        const zona = req.query.zona ? String(req.query.zona) : undefined;
        // llamamos al DALC que agrupa por producto y posición
        const detalle = await posiciones_getAllByEmpresaConDetalle_DALC(idEmpresa, zona);
        return res.json(
            require('lsi-util-node/API').getFormatedResponse(detalle)
        );
    } catch (err: any) {
        // manejamos error genérico
        return res
            .status(500)
            .json(
                require('lsi-util-node/API').getFormatedResponse(
                    '', 
                    err.message || 'Error interno'
                )
            );
    }

    
};

// ...
/**
 * Controlador: obtiene todas las posiciones para la empresa, con productos y cantidades
 * @route GET /apiv3/posiciones/getAllByEmpresaConProductos/:idEmpresa
 */
export const getAllByEmpresaConProductos = async (req: Request, res: Response): Promise<Response> => {
    try {
        const idEmpresa = Number(req.params.idEmpresa);
        if (isNaN(idEmpresa)) {
            return res.status(400).json(
                require('lsi-util-node/API').getFormatedResponse('', 'Parámetro idEmpresa inválido')
            );
        }
        const zona = req.query.zona ? String(req.query.zona) : undefined;
        const data = await posiciones_getAllByEmpresaConProductos_DALC(idEmpresa, zona);
        return res.json(require('lsi-util-node/API').getFormatedResponse(data));
    } catch (err: any) {
        return res.status(500).json(
            require('lsi-util-node/API').getFormatedResponse('', err.message || 'Error interno')
        );
    }
};

export const getHeatmap = async (req: Request, res: Response): Promise<Response> => {
    const api = require('lsi-util-node/API')
    const idEmpresa = Number(req.query.empresa)
    const periodo = req.query.periodo as string
    const zona = req.query.zona ? String(req.query.zona) : undefined

    if (isNaN(idEmpresa) || !periodo) {
        return res.status(400).json(api.getFormatedResponse('', 'Parámetros inválidos'))
    }

    try {
        const data = await posiciones_getHeatmap_DALC(idEmpresa, periodo, zona)
        return res.json(api.getFormatedResponse(data))
    } catch (err: any) {
        return res.status(500).json(api.getFormatedResponse('', err.message || 'Error interno'))
    }
}



