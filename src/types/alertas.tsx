export type alertaPrecio = {
    moneda: string,
    criptomoneda: string;
    precioObjetivo: number;
    condicion: 'above' | 'below'
}


export type criptoItem = {
    CoinInfo: {
        Id: string;
        Name: string;
        FullName: string;
    }
}