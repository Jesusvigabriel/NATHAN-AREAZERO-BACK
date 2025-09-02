import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addAlertaConfig175 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("empresas_configuracion", [
            new TableColumn({ name: "umbral_ocupacion", type: "float", isNullable: true }),
            new TableColumn({ name: "umbral_sobrepeso", type: "float", isNullable: true }),
            new TableColumn({ name: "umbral_falta_stock", type: "int", isNullable: true })
        ]);
        await queryRunner.addColumns("zonas", [
            new TableColumn({ name: "umbral_ocupacion", type: "float", isNullable: true }),
            new TableColumn({ name: "umbral_sobrepeso", type: "float", isNullable: true }),
            new TableColumn({ name: "umbral_falta_stock", type: "int", isNullable: true })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("empresas_configuracion", "umbral_ocupacion");
        await queryRunner.dropColumn("empresas_configuracion", "umbral_sobrepeso");
        await queryRunner.dropColumn("empresas_configuracion", "umbral_falta_stock");
        await queryRunner.dropColumn("zonas", "umbral_ocupacion");
        await queryRunner.dropColumn("zonas", "umbral_sobrepeso");
        await queryRunner.dropColumn("zonas", "umbral_falta_stock");
    }
}
