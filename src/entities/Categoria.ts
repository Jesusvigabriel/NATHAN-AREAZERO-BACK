import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Producto } from "./Producto"
import { Posicion } from "./Posicion"

@Entity("categorias")
export class Categoria {
    @PrimaryGeneratedColumn()
    Id: number

    @Column({name: "descripcion"})
    Descripcion: string

    @OneToMany(() => Producto, producto => producto.Categoria)
    Productos: Producto[]

    @OneToMany(() => Posicion, posicion => posicion.CategoriaPermitida)
    Posiciones: Posicion[]
}
