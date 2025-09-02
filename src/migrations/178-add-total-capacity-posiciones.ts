import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTotalCapacityPosiciones178 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("posiciones", "capacidad_peso_kg", "peso_disponible_kg");
        await queryRunner.renameColumn("posiciones", "capacidad_volumen_cm3", "volumen_disponible_cm3");

        await queryRunner.addColumn(
            "posiciones",
            new TableColumn({
                name: "capacidad_total_peso_kg",
                type: "float",
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            "posiciones",
            new TableColumn({
                name: "capacidad_total_volumen_cm3",
                type: "float",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("posiciones", "capacidad_total_volumen_cm3");
        await queryRunner.dropColumn("posiciones", "capacidad_total_peso_kg");
        await queryRunner.renameColumn("posiciones", "volumen_disponible_cm3", "capacidad_volumen_cm3");
        await queryRunner.renameColumn("posiciones", "peso_disponible_kg", "capacidad_peso_kg");
    }
}
