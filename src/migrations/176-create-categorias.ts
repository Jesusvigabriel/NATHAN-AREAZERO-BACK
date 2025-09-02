import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCategorias176 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "categorias",
            columns: [
                { name: "Id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "descripcion", type: "varchar", length: "100" }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("categorias");
    }
}
