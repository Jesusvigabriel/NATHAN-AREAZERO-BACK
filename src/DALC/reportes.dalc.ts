import { createQueryBuilder } from "typeorm"

export interface RotacionItem {
    IdProducto: number
    Entradas: number
    Salidas: number
    Movimientos: number
}

export const reporte_rotacion_DALC = async (idEmpresa: number, zona?: string): Promise<RotacionItem[]> => {
    const qbMov = createQueryBuilder("pos_prod", "pp")
        .select("pp.productId as IdProducto, SUM(IF(pp.existe=0, pp.unidades, 0)) as Entradas, SUM(IF(pp.existe=1, pp.unidades,0)) as Salidas")
        .where("pp.empresaId = :idEmpresa", { idEmpresa })

    if (zona) {
        qbMov.innerJoin("zona_posicion", "zp", "zp.posicionId = pp.posicionId")
        qbMov.innerJoin("zonas", "z", "z.id = zp.zonaId")
        qbMov.andWhere("z.descripcion = :zona", { zona })
    }

    const movimientos = await qbMov.groupBy("pp.productId").getRawMany()

    const qbHist = createQueryBuilder("historico_pos_prod", "hp")
        .select("hp.IdProducto as IdProducto, COUNT(*) as Movimientos")
        .where("hp.empresaId = :idEmpresa", { idEmpresa })

    if (zona) {
        qbHist.innerJoin("zona_posicion", "zp", "zp.posicionId = hp.IdPosicion")
        qbHist.innerJoin("zonas", "z", "z.id = zp.zonaId")
        qbHist.andWhere("z.descripcion = :zona", { zona })
    }

    const historicos = await qbHist.groupBy("hp.IdProducto").getRawMany()

    const map: Record<number, RotacionItem> = {}
    for (const m of movimientos) {
        map[m.IdProducto] = { IdProducto: m.IdProducto, Entradas: Number(m.Entradas), Salidas: Number(m.Salidas), Movimientos: 0 }
    }
    for (const h of historicos) {
        if (!map[h.IdProducto]) {
            map[h.IdProducto] = { IdProducto: h.IdProducto, Entradas: 0, Salidas: 0, Movimientos: Number(h.Movimientos) }
        } else {
            map[h.IdProducto].Movimientos = Number(h.Movimientos)
        }
    }
    return Object.values(map)
}
