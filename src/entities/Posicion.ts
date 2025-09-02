import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany} from "typeorm"
import { Categoria } from "./Categoria"
import { Pallet } from "./Pallet"

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

    @Column({name: "capacidad_total_peso_kg", type: "float", nullable: true})
    CapacidadTotalPesoKg: number

    @Column({name: "capacidad_total_volumen_cm3", type: "float", nullable: true})
    CapacidadTotalVolumenCm3: number

    @Column({name: "peso_disponible_kg", type: "float", nullable: true})
    PesoDisponibleKg: number

    @Column({name: "volumen_disponible_cm3", type: "float", nullable: true})
    VolumenDisponibleCm3: number

    @Column({name: "factor_desperdicio", type: "float", nullable: true})
    FactorDesperdicio: number

    @Column({name: "categoria_permitida_id", type: "int", nullable: true})
    CategoriaPermitidaId: number

    @Column({name: "coord_x", type: "int", nullable: true})
    CoordX: number

    @Column({name: "coord_y", type: "int", nullable: true})
    CoordY: number

    @ManyToOne(() => Categoria, categoria => categoria.Posiciones, {nullable: true})
    @JoinColumn({name: "categoria_permitida_id"})
    CategoriaPermitida?: Categoria

    @OneToMany(() => Pallet, pallet => pallet.Posicion)
    Pallets?: Pallet[]
}
