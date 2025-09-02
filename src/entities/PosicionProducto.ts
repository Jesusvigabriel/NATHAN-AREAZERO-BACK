import {Entity, Column, PrimaryGeneratedColumn} from "typeorm"

@Entity("pos_prod")

export class PosicionProducto {
    @PrimaryGeneratedColumn()
    Id: number

    @Column({name: "empresaId"})
    IdEmpresa: number

    @Column({name: "posicionId"})
    IdPosicion: number

    @Column({name: "productId"})
    IdProducto: number

    @Column()
    Unidades: number
    
    @Column()
    asigned: Date

    @Column()
    removed: Date

    @Column()
    Existe: number

    @Column({name: "lote"})
    Lote: string

    @Column({name: "embarque"})
    Embarque: string
    
    @Column({name: "usuarioNombre"})
    UsuarioNombre: string

    @Column({name: "volumenOcupadoCm3", type: "float", nullable: true})
    VolumenOcupadoCm3: number

    @Column({name: "pesoOcupadoKg", type: "float", nullable: true})
    PesoOcupadoKg: number
}