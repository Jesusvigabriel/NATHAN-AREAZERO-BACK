import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCoordinatesPosiciones177 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "posiciones",
            new TableColumn({
                name: "coord_x",
                type: "int",
                isNullable: true,
            })
        );
        await queryRunner.addColumn(
            "posiciones",
            new TableColumn({
                name: "coord_y",
                type: "int",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("posiciones", "coord_y");
        await queryRunner.dropColumn("posiciones", "coord_x");
    }
}
