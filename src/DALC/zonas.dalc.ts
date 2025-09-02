import { getRepository } from "typeorm";
import { Zona } from "../entities/Zona";
import { ZonaPosicion } from "../entities/ZonaPosicion";

export const zonas_getAll_DALC = async () => {
    return getRepository(Zona).find();
};

export const zona_setPosiciones_DALC = async (idZona: number, idsPosiciones: number[]) => {
    const repo = getRepository(ZonaPosicion);
    await repo.delete({ ZonaId: idZona });
    const nuevos = idsPosiciones.map(idPosicion => repo.create({ ZonaId: idZona, PosicionId: idPosicion }));
    return repo.save(nuevos);
};
