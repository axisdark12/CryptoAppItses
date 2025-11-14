export type CryptoStats = {
    price: number;
    changePctHour: number;
    changePctDay: number;
    changePct24h: number;
    changePct7d?: number;
    changePct30d?: number;
    high24h: number;
    low24h: number;
    open24h?: number;
    volume24h: number;
    volume24hTo?: number;
    totalVolume24h?: number;
    totalVolume24hTo?: number;
    marketCap: number;
    supply: number;
    circulatingSupply: number;
    median?: number;
    lastMarket?: string;
    lastVolume?: number;
    lastVolumeTo?: number;
    imageUrl?: string;
}

export type HistoricalData = {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volumefrom: number;
    volumeto: number;
}

export type CardProps = {
    stats: CryptoStats;
    history?: HistoricalData[] | null;

}