import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddVolumenPesoPosicionMetricas177 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "posicion_metricas",
            new TableColumn({
                name: "volumenMovidoCm3",
                type: "float",
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            "posicion_metricas",
            new TableColumn({
                name: "pesoMovidoKg",
                type: "float",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("posicion_metricas", "pesoMovidoKg");
        await queryRunner.dropColumn("posicion_metricas", "volumenMovidoCm3");
    }
}
