import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePosicionMetricas174 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "posicion_metricas",
            columns: [
                { name: "Id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "empresaId", type: "int" },
                { name: "posicionId", type: "int" },
                { name: "unidades", type: "int" },
                { name: "accion", type: "varchar", length: "10" },
                { name: "fecha", type: "timestamp", default: "CURRENT_TIMESTAMP" }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("posicion_metricas");
    }
}
