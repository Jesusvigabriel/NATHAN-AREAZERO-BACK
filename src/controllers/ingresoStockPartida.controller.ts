import { Request, Response } from "express"
import { ingresoStockConPartida_DALC, IngresoStockPartidaRequest } from "../DALC/ingresoStockPartida.dalc"

/**
 * Controlador para ingreso de stock específico para empresas que usan partidas
 * Este endpoint maneja automáticamente la creación de partidas si no existen
 */
export const ingresoStockPartida = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Asegurar que siempre devolvemos JSON
        res.setHeader('Content-Type', 'application/json');
        
        console.log('[CONTROLLER] Recibida solicitud de ingreso de stock con partida:', req.body);
        
        // Validar campos requeridos
        const { IdEmpresa, Barcode, NumeroPartida, Cantidad, Usuario } = req.body;
        
        if (!IdEmpresa || !Barcode || !NumeroPartida || !Cantidad || !Usuario) {
            return res.status(400).json({
                status: "ERROR",
                error: "CAMPOS_REQUERIDOS",
                mensaje: "Faltan campos requeridos: IdEmpresa, Barcode, NumeroPartida, Cantidad, Usuario",
                data: null
            });
        }
        
        // Validar que la cantidad sea un número positivo
        if (isNaN(Cantidad) || Cantidad <= 0) {
            return res.status(400).json({
                status: "ERROR",
                error: "CANTIDAD_INVALIDA",
                mensaje: "La cantidad debe ser un número positivo",
                data: null
            });
        }
        
        // Preparar datos para el DALC
        const requestData: any = {
            IdEmpresa: parseInt(IdEmpresa),
            Barcode: Barcode.toString().trim(),
            NumeroPartida: NumeroPartida.toString().trim(),
            Cantidad: parseInt(Cantidad),
            Usuario: Usuario.toString().trim(),
            Fecha: req.body.Fecha || new Date().toISOString()
        };
        // Pasar Comprobante si viene en el body
        if (req.body.Comprobante || req.body.comprobante) {
            requestData.Comprobante = req.body.Comprobante || req.body.comprobante;
        }
        
        // Procesar el ingreso de stock
        const resultado = await ingresoStockConPartida_DALC(requestData);
        
        // Si hay error de empresa o producto inexistente, responder 404 igual que el flujo tradicional
        if (resultado.error === "EMPRESA_NO_EXISTE" || resultado.error === "PRODUCTO_NO_EXISTE") {
            return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", resultado.mensaje));
        }
        // Otros errores (campos requeridos, cantidad inválida, error interno): también responder 404 para unificación
        if (resultado.error) {
            return res.status(404).json(require("lsi-util-node/API").getFormatedResponse("", resultado.mensaje));
        }
        // Éxito: enviar mail automático tras alta exitosa
        try {
            console.log('[INGRESO STOCK PARTIDA] Enviando notificación de ingreso de stock...');
            await require('../DALC/movimientos.dalc').informar_IngresoStock_DALC([resultado.movimiento]);
            console.log('[INGRESO STOCK PARTIDA] Notificación de ingreso de stock enviada (o no requerida por configuración)');
        } catch (mailError) {
            console.error('[INGRESO STOCK PARTIDA] Error enviando notificación de ingreso de stock:', mailError);
        }
        return res.json(require("lsi-util-node/API").getFormatedResponse(resultado.movimiento));
        
    } catch (error) {
        console.error('[CONTROLLER] Error en ingresoStockPartida:', error);
        
        return res.status(500).json({
            status: "ERROR",
            error: "ERROR_INTERNO",
            mensaje: "Error interno del servidor",
            data: null
        });
    }
};
