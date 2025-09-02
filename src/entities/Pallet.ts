import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { PalletTipo } from "./PalletTipo";
import { Posicion } from "./Posicion";

@Entity("pallets")
export class Pallet {
    @PrimaryGeneratedColumn({ name: "id" })
    Id: number;

    @Column({ name: "codigo" })
    Codigo: string;

    @Column({ name: "pallet_tipo_id" })
    PalletTipoId: number;

    @ManyToOne(() => PalletTipo, tipo => tipo.Pallets)
    @JoinColumn({ name: "pallet_tipo_id" })
    Tipo: PalletTipo;

    @Column({ name: "posicion_id", nullable: true })
    PosicionId: number;

    @ManyToOne(() => Posicion, posicion => posicion.Pallets, { nullable: true })
    @JoinColumn({ name: "posicion_id" })
    Posicion?: Posicion;

    @Column({ name: "volumen_ocupado_cm3", type: "float", default: 0 })
    VolumenOcupadoCm3: number;

    @Column({ name: "peso_ocupado_kg", type: "float", default: 0 })
    PesoOcupadoKg: number;

    @Column({ name: "espacio_libre_volumen_cm3", type: "float", default: 0 })
    EspacioLibreVolumenCm3: number;

    @Column({ name: "espacio_libre_peso_kg", type: "float", default: 0 })
    EspacioLibrePesoKg: number;
}
