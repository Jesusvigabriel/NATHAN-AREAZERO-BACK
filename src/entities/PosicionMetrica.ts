import {Entity, Column, PrimaryGeneratedColumn} from "typeorm"

@Entity("posicion_metricas")
export class PosicionMetrica {
    @PrimaryGeneratedColumn()
    Id: number

    @Column({ name: "empresaId" })
    IdEmpresa: number

    @Column({ name: "posicionId" })
    IdPosicion: number

    @Column()
    Unidades: number

    @Column()
    Accion: string

    @Column({ name: "volumenMovidoCm3", type: "float", nullable: true })
    VolumenMovidoCm3: number

    @Column({ name: "pesoMovidoKg", type: "float", nullable: true })
    PesoMovidoKg: number

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    Fecha: Date
}
