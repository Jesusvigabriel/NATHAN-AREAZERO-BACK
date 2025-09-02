import {Entity, Column, PrimaryGeneratedColumn} from "typeorm"

@Entity("posiciones")

export class Posicion {
    @PrimaryGeneratedColumn()
    Id: number

    @Column({name: "descripcion"})
    Nombre: string

    @Column({name: "fecha_inventario"})
    FechaInventario: string

    @Column({name: "usuario_inventario"})
    UsuarioInventario: string

    @Column({name: "capacidad_peso_kg", type: "float", nullable: true})
    CapacidadPesoKg: number

    @Column({name: "capacidad_volumen_cm3", type: "float", nullable: true})
    CapacidadVolumenCm3: number

    @Column({name: "factor_desperdicio", type: "float", nullable: true})
    FactorDesperdicio: number

    @Column({name: "categoria_permitida_id", type: "int", nullable: true})
    CategoriaPermitidaId: number
}
