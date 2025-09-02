import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("zonas")
export class Zona {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({name: "descripcion"})
    Descripcion: string;

    @Column({name: "color", nullable: true})
    Color?: string;
    @Column({name: "umbral_ocupacion", type: "float", nullable: true})
    UmbralOcupacion?: number;

    @Column({name: "umbral_sobrepeso", type: "float", nullable: true})
    UmbralSobrepeso?: number;

    @Column({name: "umbral_falta_stock", type: "int", nullable: true})
    UmbralFaltaStock?: number;
}
