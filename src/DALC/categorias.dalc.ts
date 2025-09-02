import { getRepository } from "typeorm";
import { Categoria } from "../entities/Categoria";

export const categorias_getAll_DALC = async () => {
    return await getRepository(Categoria).find();
};

export const categoria_getById_DALC = async (id: number) => {
    return await getRepository(Categoria).findOne({ where: { Id: id } });
};

export const categoria_add_DALC = async (body: Partial<Categoria>) => {
    const repo = getRepository(Categoria);
    const nueva = repo.create(body);
    return await repo.save(nueva);
};

export const categoria_edit_DALC = async (body: Partial<Categoria>, id: number) => {
    const repo = getRepository(Categoria);
    await repo.update(id, body);
    return await repo.findOne({ where: { Id: id } });
};

export const categoria_deleteById_DALC = async (id: number) => {
    await getRepository(Categoria)
        .createQueryBuilder()
        .delete()
        .from("categorias")
        .where("Id = :id", { id })
        .execute();
    return;
};
