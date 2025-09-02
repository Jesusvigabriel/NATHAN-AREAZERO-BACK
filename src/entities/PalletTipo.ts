import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Pallet } from "./Pallet";

@Entity("pallet_tipos")
export class PalletTipo {
    @PrimaryGeneratedColumn({ name: "id" })
    Id: number;

    @Column({ name: "nombre" })
    Nombre: string;

    @Column({ name: "capacidad_peso_kg", type: "float" })
    CapacidadPesoKg: number;

    @Column({ name: "capacidad_volumen_cm3", type: "float" })
    CapacidadVolumenCm3: number;

    @OneToMany(() => Pallet, pallet => pallet.Tipo)
    Pallets: Pallet[];
}
