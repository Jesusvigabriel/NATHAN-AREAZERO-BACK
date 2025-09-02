import { createQueryBuilder } from "typeorm"

export interface RotacionItem {
    IdProducto: number
    Entradas: number
    Salidas: number
    Movimientos: number
}

export const reporte_rotacion_DALC = async (idEmpresa: number): Promise<RotacionItem[]> => {
    const movimientos = await createQueryBuilder("pos_prod", "pp")
        .select("pp.productId as IdProducto, SUM(IF(pp.existe=0, pp.unidades, 0)) as Entradas, SUM(IF(pp.existe=1, pp.unidades, 0)) as Salidas")
        .where("pp.empresaId = :idEmpresa", { idEmpresa })
        .groupBy("pp.productId")
        .getRawMany()

    const historicos = await createQueryBuilder("historico_pos_prod", "hp")
        .select("hp.IdProducto as IdProducto, COUNT(*) as Movimientos")
        .where("hp.empresaId = :idEmpresa", { idEmpresa })
        .groupBy("hp.IdProducto")
        .getRawMany()

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
