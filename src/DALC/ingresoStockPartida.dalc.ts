import { getRepository } from "typeorm"
import { Partida } from "../entities/Partida"
import { MovimientosStock } from "../entities/MovimientoStock"
import { producto_getByBarcodeAndEmpresa_DALC } from "./productos.dalc"
import { empresa_getById_DALC } from "./empresas.dalc"
import { createMovimientosStock_DALC } from "./movimientos.dalc"

export interface IngresoStockPartidaRequest {
    IdEmpresa: number;
    Barcode: string;
    NumeroPartida: string;
    Cantidad: number;
    Usuario: string;
    Fecha?: string;
}

export interface IngresoStockPartidaResponse {
    success?: boolean;
    error?: string;
    mensaje: string;
    accion?: 'PARTIDA_CREADA' | 'STOCK_ACTUALIZADO';
    partida?: {
        Id: number;
        Partida: string;
        Stock: number;
    };
    movimiento?: any;
}

/**
 * Función específica para ingreso de stock con partidas
 * Solo para empresas que usan partidas
 */
export const ingresoStockConPartida_DALC = async (body: any): Promise<IngresoStockPartidaResponse> => {
    const { IdEmpresa, Barcode, NumeroPartida, Cantidad, Usuario, Fecha, Comprobante } = body;
// Robustecer para aceptar comprobante en minúscula también
const comprobanteFinal = Comprobante || body.comprobante || null;
    
    try {
        console.log('[INGRESO STOCK PARTIDA] Payload recibido:', body);
        console.log(`[INGRESO STOCK PARTIDA] Iniciando proceso para empresa ${IdEmpresa}, partida ${NumeroPartida}, barcode ${Barcode}`);
        
        // 1. Validar que la empresa existe
        const empresa = await empresa_getById_DALC(IdEmpresa);
        if (!empresa) {
            console.log(`[INGRESO STOCK PARTIDA] Empresa ${IdEmpresa} no existe`);
            return { 
                error: "EMPRESA_NO_EXISTE", 
                mensaje: "La empresa especificada no existe" 
            };
        }
        
        console.log(`[INGRESO STOCK PARTIDA] Empresa ${empresa.Nombre} encontrada`);
        
        // 2. Validar que el producto existe para esta empresa
        // CAMBIO: Para ingreso de stock con partidas, el campo Barcode recibido es en realidad el CodeEmpresa del producto
        // Por lo tanto, buscamos por CodeEmpresa y no por barrcode
        const producto = await require('./productos.dalc').producto_getByCodeEmpresaAndEmpresa_DALC(Barcode, IdEmpresa);
        if (!producto) {
            console.log(`[INGRESO STOCK PARTIDA] Producto con codeEmpresa ${Barcode} no existe para empresa ${IdEmpresa}`);
            return { 
                error: "PRODUCTO_NO_EXISTE", 
                mensaje: `El producto con codeEmpresa ${Barcode} no existe para esta empresa` 
            };
        }
        console.log(`[INGRESO STOCK PARTIDA] Producto encontrado por codeEmpresa:`, producto?.Id, producto?.Nombre || producto?.Descripcion || producto);
        // FIN CAMBIO
        
        console.log(`[INGRESO STOCK PARTIDA] Producto ${producto.Nombre} encontrado (ID: ${producto.Id})`);
        
        // 3. Buscar si ya existe la partida
        let partida = await getRepository(Partida).findOne({
            where: { 
                IdProducto: producto.Id, 
                IdEmpresa: IdEmpresa, 
                Partida: NumeroPartida 
            }
        });

        // Buscar el barcode real del producto para grabar en movimiento
        const barcodeReal = producto.Barcode || producto.barrcode || producto.barcode;
        if (!barcodeReal) {
            return {
                error: "PRODUCTO_SIN_BARCODE",
                mensaje: `El producto con codeEmpresa ${Barcode} no tiene barcode definido en la base de datos.`
            };
        }
        
        let accion: 'PARTIDA_CREADA' | 'STOCK_ACTUALIZADO';
        
        if (!partida) {
            console.log(`[INGRESO STOCK PARTIDA] Partida ${NumeroPartida} no existe, creando nueva`);
            
            // 4. Crear nueva partida si no existe
            const nuevaPartida = new Partida();
            nuevaPartida.IdEmpresa = IdEmpresa;
            nuevaPartida.IdProducto = producto.Id;
            nuevaPartida.Partida = NumeroPartida;
            nuevaPartida.Stock = Cantidad;
            nuevaPartida.Fecha = Fecha ? new Date(Fecha) : new Date();
            nuevaPartida.Usuario = Usuario;
            
            partida = await getRepository(Partida).save(nuevaPartida);
            accion = "PARTIDA_CREADA";
            
            console.log(`[INGRESO STOCK PARTIDA] Partida creada con ID ${partida.Id}`);
        } else {
            console.log(`[INGRESO STOCK PARTIDA] Partida ${NumeroPartida} existe (ID: ${partida.Id}), actualizando stock`);
            
            // 5. Actualizar stock de partida existente
            const stockAnterior = partida.Stock;
            partida.Stock += Cantidad;
            await getRepository(Partida).save(partida);
            accion = "STOCK_ACTUALIZADO";
            
            console.log(`[INGRESO STOCK PARTIDA] Stock actualizado de ${stockAnterior} a ${partida.Stock}`);
        }
        
        // 6. Crear movimiento de stock
        const fechaMovimiento = Fecha ? new Date(Fecha) : new Date();
        // Usar comprobanteFinal si está presente, sino fallback
        const ordenFinal = comprobanteFinal && typeof comprobanteFinal === 'string' && comprobanteFinal.trim() !== ''
            ? comprobanteFinal.trim()
            : `INGRESO-PARTIDA-${Date.now()}`;
        console.log(`[INGRESO STOCK PARTIDA] Valor de Orden a grabar:`, ordenFinal);
        const movimientoData = {
            Orden: ordenFinal,
            IdProducto: partida.Id, // ID de la partida
            Unidades: Cantidad,
            Tipo: 0, // Ingreso
            IdEmpresa: IdEmpresa,
            Fecha: fechaMovimiento.toISOString().slice(0, 19).replace('T', ' '),
            codprod: barcodeReal, // Guardar el barcode real
            Usuario: Usuario
        };

        
        console.log(`[INGRESO STOCK PARTIDA] Datos a grabar en movimiento:`, movimientoData);
        const movimientoCreado = await createMovimientosStock_DALC(movimientoData);
        
        const mensaje = accion === "PARTIDA_CREADA" 
            ? `Partida ${NumeroPartida} creada exitosamente con stock inicial de ${Cantidad} unidades`
            : `Stock actualizado para partida ${NumeroPartida}. Nuevo stock total: ${partida.Stock} unidades`;
            
        console.log(`[INGRESO STOCK PARTIDA] Proceso completado exitosamente: ${mensaje}`);
        
        return {
            success: true,
            accion: accion,
            partida: {
                Id: partida.Id,
                Partida: partida.Partida,
                Stock: partida.Stock
            },
            movimiento: movimientoCreado,
            mensaje: mensaje
        };
        
    } catch (error) {
        console.error('[INGRESO STOCK PARTIDA] Error:', error);
        return { 
            error: "ERROR_INTERNO", 
            mensaje: "Error interno del servidor al procesar el ingreso de stock" 
        };
    }
};
