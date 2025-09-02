export interface IZona {
    Id: number;
    Descripcion: string;
    Color?: string;
}

export interface IZonaPosicion {
    Id: number;
    ZonaId: number;
    PosicionId: number;
}
