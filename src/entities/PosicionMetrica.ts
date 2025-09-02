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

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    Fecha: Date
}
