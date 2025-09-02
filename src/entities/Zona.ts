import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("zonas")
export class Zona {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({name: "descripcion"})
    Descripcion: string;

    @Column({name: "color", nullable: true})
    Color?: string;
}
