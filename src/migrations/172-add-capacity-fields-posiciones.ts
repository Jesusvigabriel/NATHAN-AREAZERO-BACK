import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCapacityFieldsPosiciones172 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "posiciones",
            new TableColumn({
                name: "capacidad_peso_kg",
                type: "float",
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            "posiciones",
            new TableColumn({
                name: "capacidad_volumen_cm3",
                type: "float",
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            "posiciones",
            new TableColumn({
                name: "factor_desperdicio",
                type: "float",
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            "posiciones",
            new TableColumn({
                name: "categoria_permitida_id",
                type: "int",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("posiciones", "categoria_permitida_id");
        await queryRunner.dropColumn("posiciones", "factor_desperdicio");
        await queryRunner.dropColumn("posiciones", "capacidad_volumen_cm3");
        await queryRunner.dropColumn("posiciones", "capacidad_peso_kg");
    }
}
