import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("zona_posicion")
export class ZonaPosicion {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({name: "zonaId"})
    ZonaId: number;

    @Column({name: "posicionId"})
    PosicionId: number;
}
