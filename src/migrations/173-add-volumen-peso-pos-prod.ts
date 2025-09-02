import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddVolumenPesoPosProd173 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "pos_prod",
            new TableColumn({
                name: "volumenOcupadoCm3",
                type: "float",
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            "pos_prod",
            new TableColumn({
                name: "pesoOcupadoKg",
                type: "float",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("pos_prod", "pesoOcupadoKg");
        await queryRunner.dropColumn("pos_prod", "volumenOcupadoCm3");
    }
}
