import { getRepository } from "typeorm";
import { PalletTipo } from "../entities/PalletTipo";

export const palletTipos_getAll_DALC = async () => {
    return await getRepository(PalletTipo).find();
};

export const palletTipo_getById_DALC = async (id: number) => {
    return await getRepository(PalletTipo).findOne({ where: { Id: id } });
};

export const palletTipo_add_DALC = async (body: Partial<PalletTipo>) => {
    const repo = getRepository(PalletTipo);
    const nuevo = repo.create(body);
    return await repo.save(nuevo);
};

export const palletTipo_edit_DALC = async (body: Partial<PalletTipo>, id: number) => {
    const repo = getRepository(PalletTipo);
    await repo.update(id, body);
    return await repo.findOne({ where: { Id: id } });
};

export const palletTipo_deleteById_DALC = async (id: number) => {
    await getRepository(PalletTipo)
        .createQueryBuilder()
        .delete()
        .from("pallet_tipos")
        .where("Id = :id", { id })
        .execute();
    return;
};
