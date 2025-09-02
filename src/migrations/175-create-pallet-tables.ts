import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePalletTables175 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "pallet_tipos",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "nombre", type: "varchar", length: "100" },
                { name: "capacidad_peso_kg", type: "float" },
                { name: "capacidad_volumen_cm3", type: "float" }
            ]
        }));

        await queryRunner.createTable(new Table({
            name: "pallets",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "codigo", type: "varchar", length: "50" },
                { name: "pallet_tipo_id", type: "int" },
                { name: "posicion_id", type: "int", isNullable: true },
                { name: "volumen_ocupado_cm3", type: "float", default: 0 },
                { name: "peso_ocupado_kg", type: "float", default: 0 },
                { name: "espacio_libre_volumen_cm3", type: "float", default: 0 },
                { name: "espacio_libre_peso_kg", type: "float", default: 0 }
            ]
        }));

        await queryRunner.createForeignKey("pallets", new TableForeignKey({
            columnNames: ["pallet_tipo_id"],
            referencedTableName: "pallet_tipos",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("pallets", new TableForeignKey({
            columnNames: ["posicion_id"],
            referencedTableName: "posiciones",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("pallets");
        await queryRunner.dropTable("pallet_tipos");
    }
}
