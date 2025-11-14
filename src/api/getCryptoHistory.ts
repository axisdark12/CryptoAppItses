import axios from "axios";
import { HistoricalData } from "../Types/CryptoStats";

const API_KEY = "8c0cebec52d41ede999512e91a9db3f08f9571b2cb026ee2269ccbb65e3ca830";
const BASE_URL = "https://min-api.cryptocompare.com/data";

export const getCryptoHistory = async (
    symbol: string,
    currency: string
): Promise<HistoricalData[] | null> => {
    try {
        const response = await axios.get(`${BASE_URL}/v2/histoday`, {
            params: {
                fsym: symbol,
                tsym: currency,
                limit: 30,
                api_key: API_KEY,
            }
        });
        const data = response.data?.Data?.Data;
        if (!data || !Array.isArray(data)) {
            console.error("No se encontraron datos históricos para:", symbol, currency);
            return null;
        }
        const history: HistoricalData[] = data.map((d: any) => ({
            time: d.time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            volumefrom: d.volumefrom,
            volumeto: d.volumeto,
        }));
        return history;
    } catch (error: any) {
        console.error("Error al obtener datos:", error.message || error);
        return null;
    }
}