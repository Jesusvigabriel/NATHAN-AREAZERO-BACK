import { getRepository } from "typeorm";
import { Pallet } from "../entities/Pallet";
import { PalletTipo } from "../entities/PalletTipo";

export const pallets_getAll_DALC = async () => {
    return await getRepository(Pallet).find({ relations: ["Tipo"] });
};

export const pallet_getById_DALC = async (id: number) => {
    return await getRepository(Pallet).findOne(id, { relations: ["Tipo"] });
};

export const pallet_getByCodigo_DALC = async (codigo: string) => {
    return await getRepository(Pallet).findOne({ where: { Codigo: codigo }, relations: ["Tipo"] });
};

export const pallet_add_DALC = async (body: Partial<Pallet>) => {
    const repo = getRepository(Pallet);
    const tipo = await getRepository(PalletTipo).findOne(body.PalletTipoId);
    const nuevo = repo.create({
        Codigo: body.Codigo,
        PalletTipoId: body.PalletTipoId!,
        PosicionId: body.PosicionId,
        VolumenOcupadoCm3: body.VolumenOcupadoCm3 ?? 0,
        PesoOcupadoKg: body.PesoOcupadoKg ?? 0,
    });
    nuevo.EspacioLibreVolumenCm3 = (tipo?.CapacidadVolumenCm3 ?? 0) - (nuevo.VolumenOcupadoCm3 ?? 0);
    nuevo.EspacioLibrePesoKg = (tipo?.CapacidadPesoKg ?? 0) - (nuevo.PesoOcupadoKg ?? 0);
    const saved = await repo.save(nuevo);
    return await repo.findOne(saved.Id, { relations: ["Tipo"] });
};

export const pallet_edit_DALC = async (body: Partial<Pallet>, id: number) => {
    const repo = getRepository(Pallet);
    await repo.update(id, body);
    const pallet = await repo.findOne(id, { relations: ["Tipo"] });
    if (pallet) {
        const tipo = await getRepository(PalletTipo).findOne(pallet.PalletTipoId);
        pallet.EspacioLibreVolumenCm3 = (tipo?.CapacidadVolumenCm3 ?? 0) - (pallet.VolumenOcupadoCm3 ?? 0);
        pallet.EspacioLibrePesoKg = (tipo?.CapacidadPesoKg ?? 0) - (pallet.PesoOcupadoKg ?? 0);
        await repo.update(id, {
            EspacioLibreVolumenCm3: pallet.EspacioLibreVolumenCm3,
            EspacioLibrePesoKg: pallet.EspacioLibrePesoKg,
        });
    }
    return pallet;
};

export const pallet_deleteById_DALC = async (id: number) => {
    await getRepository(Pallet)
        .createQueryBuilder()
        .delete()
        .from("pallets")
        .where("Id = :id", { id })
        .execute();
    return;
};
