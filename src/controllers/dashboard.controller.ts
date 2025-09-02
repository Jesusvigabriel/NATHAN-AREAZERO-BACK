import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Posicion } from "../entities/Posicion";
import { PosicionMetrica } from "../entities/PosicionMetrica";
import { EmpresaConfiguracion } from "../entities/EmpresaConfiguracion";
import { posicion_getOcupacion_DALC } from "../DALC/posiciones.dalc";

export const getDashboard = async (req: Request, res: Response): Promise<Response> => {
    const api = require('lsi-util-node/API');
    const idEmpresa = Number(req.params.idEmpresa);
    const zona = req.query.zona ? String(req.query.zona) : undefined;

    if (isNaN(idEmpresa)) {
        return res.status(400).json(api.getFormatedResponse('', 'Parámetro inválido'));
    }

    const posiciones = await getRepository(Posicion).find();
    const config = await getRepository(EmpresaConfiguracion).findOne({ where: { IdEmpresa: idEmpresa } as any });
    const umbralOcup = config?.UmbralOcupacion ?? 0;
    const umbralPeso = config?.UmbralSobrepeso ?? 0;

    let totalPct = 0;
    let count = 0;
    const criticas: any[] = [];

    for (const pos of posiciones) {
        const ocup = await posicion_getOcupacion_DALC(pos.Id, { idEmpresa, zona });
        const pct = pos.CapacidadTotalVolumenCm3 ? ocup.VolumenOcupadoCm3 / pos.CapacidadTotalVolumenCm3 : 0;
        totalPct += pct;
        count++;
        const pctPeso = pos.CapacidadTotalPesoKg ? ocup.PesoOcupadoKg / pos.CapacidadTotalPesoKg : 0;
        if ((umbralOcup && pct > umbralOcup) || (umbralPeso && pctPeso > umbralPeso)) {
            criticas.push({ Id: pos.Id, Nombre: pos.Nombre, Ocupacion: pct });
        }
    }

    const rotacionRows = await getRepository(PosicionMetrica)
        .createQueryBuilder('pm')
        .select('pm.posicionId', 'posicionId')
        .addSelect('SUM(pm.unidades)', 'mov')
        .addSelect('SUM(pm.volumenMovidoCm3)', 'volumen')
        .addSelect('SUM(pm.pesoMovidoKg)', 'peso')
        .where('pm.empresaId = :idEmpresa', { idEmpresa })
        .groupBy('pm.posicionId')
        .getRawMany();
    const rotacionPromedio = rotacionRows.reduce((a, r) => a + Number(r.mov), 0) / (rotacionRows.length || 1);
    const volumenMovidoPromedio = rotacionRows.reduce((a, r) => a + Number(r.volumen), 0) / (rotacionRows.length || 1);
    const pesoMovidoPromedio = rotacionRows.reduce((a, r) => a + Number(r.peso), 0) / (rotacionRows.length || 1);

    const data = {
        ocupacionPromedio: count ? totalPct / count : 0,
        ocupacionLibrePromedio: count ? 1 - totalPct / count : 0,
        rotacionPromedio,
        volumenMovidoPromedio,
        pesoMovidoPromedio,
        posicionesCriticas: criticas
    };
    return res.json(api.getFormatedResponse(data));
};
