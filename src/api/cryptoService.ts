import axios from "axios";
import { CryptoStats } from "../Types/CryptoStats";

const API_KEY = "8c0cebec52d41ede999512e91a9db3f08f9571b2cb026ee2269ccbb65e3ca830";
const BASE_URL = "https://min-api.cryptocompare.com/data";

export const getCryptoStats = async (
    symbol: string,
    currency: string
): Promise<CryptoStats | null> => {
    try {
        const response = await axios.get(`${BASE_URL}/pricemultifull`, {
            params: {
                fsyms: symbol,
                tsyms: currency,
                api_key: API_KEY,
            }
        });
        if (!response.data?.RAW?.[symbol]?.[currency]) {
            console.error("No se encontraron datos para:", symbol, currency);
            return null;
        }
        const data = response.data.RAW[symbol][currency];
        const stats: CryptoStats = {
            price: data.PRICE,
            changePctHour: data.CHANGEPCTHOUR,
            changePctDay: data.CHANGEPCTDAY,
            changePct24h: data.CHANGEPCT24HOUR,
            high24h: data.HIGH24HOUR,
            low24h: data.LOW24HOUR,
            open24h: data.OPEN24HOUR,
            volume24h: data.VOLUME24HOUR,
            volume24hTo: data.VOLUME24HOURTO,
            totalVolume24h: data.TOTALVOLUME24H,
            totalVolume24hTo: data.TOTALVOLUME24HTO,
            marketCap: data.MKTCAP,
            supply: data.SUPPLY,
            circulatingSupply: data.CIRCULATINGSUPPLY,
            median: data.MEDIAN,
            lastMarket: data.LASTMARKET,
            lastVolume: data.LASTVOLUME,
            lastVolumeTo: data.LASTVOLUMETO,
            imageUrl: `https://www.cryptocompare.com${data.IMAGEURL}`
        };
        return stats;
    } catch (error: any) {
        console.error("Error al obtener datos:", error.message || error);
        return null;
    }
}
