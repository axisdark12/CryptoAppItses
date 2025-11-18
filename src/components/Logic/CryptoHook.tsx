import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { getCryptoStats } from '../../api/cryptoService';
import { getCryptoHistory } from '../../api/getCryptoHistory';
import type { CryptoStats } from '../../Types/CryptoStats';
import type { HistoricalData } from '../../Types/CryptoStats';
import type { alertaPrecio } from '../../Types/alertas'
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export interface CryptoProps {
    moneda: string;
    criptomoneda: string;
    resultado: any;
    cargando: boolean;
    historial: HistoricalData[] | null;
    stats: CryptoStats | null;
    alerta: alertaPrecio | null;
    criptomonedasList: any[];
    mostrarGrafico: boolean;

    guardarMoneda: (v: string) => void;
    guardarCriptomoneda: (v: string) => void;
    guardarConsultarAPI: (v: boolean) => void;
    setAlerta: (v: alertaPrecio | null) => void;
    setCriptomonedasList: (v: any[]) => void;
    setMostrarGrafico: (v: boolean) => void;
};

const CryptoHook = createContext<CryptoProps | undefined>(undefined);
export const CryptoProvider = ({ children }: { children: React.ReactNode }) => {
    // ---------------------------
    // Estados globales
    // ---------------------------
    const [moneda, guardarMoneda] = useState('');
    const [criptomoneda, guardarCriptomoneda] = useState('');
    const [consultarAPI, guardarConsultarAPI] = useState(false);
    const [resultado, guardarResultado] = useState({});
    const [cargando, guardarCargando] = useState(false);
    const [historial, guardarHistorial] = useState<HistoricalData[] | null>(null);
    const [alerta, setAlerta] = useState<alertaPrecio | null>(null);
    const [mostrarGrafico, setMostrarGrafico] = useState(false);
    const [criptomonedasList, setCriptomonedasList] = useState<any[]>([]);
    const [stats, setStats] = useState<CryptoStats | null>(null);
    // ---------------------------
    // Funciones
    // ---------------------------
    const formatearNumero = (valor: number) =>
        new Intl.NumberFormat('es-MX', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 4,
        }).format(valor);

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true
        })
    });
    // ----------------------------
    // Estadisticas
    // ----------------------------
    useEffect(() => {
        const obtenerEstadisticas = async () => {
            if (!consultarAPI) return;

            try {
                const resultadoStats = await getCryptoStats(criptomoneda, moneda);
                const historialData = await getCryptoHistory(criptomoneda, moneda);

                setStats(resultadoStats);
                guardarHistorial(historialData);

            } catch (error) {
                console.log("Error al obtener estadísticas:", error);
            } finally {
                guardarCargando(false);
                guardarConsultarAPI(false);
            }
        };

        obtenerEstadisticas();
    }, [consultarAPI]);

    // ----------------------------
    // Cotización principal
    // ----------------------------
    useEffect(() => {
        const cotizarCriptomoneda = async () => {
            if (!consultarAPI) return;

            try {
                const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
                const respuesta = await axios.get(url);

                guardarCargando(true);

                setTimeout(() => {
                    const datos = respuesta.data.DISPLAY?.[criptomoneda]?.[moneda];
                    if (datos) guardarResultado(datos);

                    guardarCargando(false);
                    guardarConsultarAPI(false);

                }, 3000);

            } catch (error) {
                console.log("Error al cotizar:", error);
                guardarCargando(false);
                guardarConsultarAPI(false);
            }
        };

        cotizarCriptomoneda();
    }, [consultarAPI]);

    // -------------------------
    // Notificaciones
    // -------------------------
    useEffect(() => {
        const pedirPermisosNotificaciones = async () => {
            if (!Device.isDevice) {
                console.log('Las notificaciones solo funcionan en dispositivos fisicos');
                return;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert(
                    'Aviso',
                    'No se concedieron permisos de notificaciones'
                );
            }
        };

        pedirPermisosNotificaciones();
    }, []);

    const enviarNotificacionAlerta = async (alerta: alertaPrecio, precioActual: number) => {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Alerta de precio',
                    body: `${alerta.criptomoneda} ha ${alerta.condicion === 'above' ? 'subido' : 'bajado'
                        } a ${formatearNumero(precioActual)} ${alerta.moneda}`,
                    data: { tipo: 'alerta_precio' },
                },
                trigger: null,
            });
        } catch (error) {
            console.log('Error al enviar notificación', error);
        }
    };

    useEffect(() => {
        if (!alerta) return;

        const alertaActiva: alertaPrecio = alerta

        const intervalo = setInterval(async () => {
            try {
                const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${alerta.criptomoneda}&tsyms=${alerta.moneda}`;
                const respuesta = await axios.get(url);

                const datos = respuesta.data.DISPLAY?.[alerta.criptomoneda]?.[alerta.moneda];

                if (!datos || !datos.PRICE) {
                    console.log('No se pudieron obtener datos para la alerta');
                    return;
                }

                const precioTexto = datos.PRICE;
                const numeroLimpio = precioTexto.replace(/[^0-9.-]+/g, '');
                const precioActual = parseFloat(numeroLimpio);
                if (isNaN(precioActual)) {
                    console.log('No se pudo parsear el precio', precioTexto);
                    return;
                }

                const condicionCumplida =
                    (alerta.condicion === 'above' && precioActual >= alertaActiva.precioObjetivo) ||
                    (alerta.condicion === 'below' && precioActual <= alertaActiva.precioObjetivo);

                if (condicionCumplida) {
                    await enviarNotificacionAlerta(alerta, Number(precioActual.toFixed(2)));
                    Alert.alert(
                        'Alerta cumplida',
                        `${alerta.criptomoneda} ha ${alerta.condicion === 'above' ? 'subido' : 'bajado'
                        } al precio objetivo de ${formatearNumero(alerta.precioObjetivo)} ${alerta.moneda}`
                    );

                    setAlerta(null);
                }
            } catch (error) {
                console.log('Error comprobando alerta', error);
            }
        }, 60000);

        return () => clearInterval(intervalo);
    }, [alerta]);

    return (
        <CryptoHook.Provider
            value={{
                moneda,
                criptomoneda,
                resultado,
                cargando,
                historial,
                stats,
                alerta,
                criptomonedasList,
                mostrarGrafico,

                guardarMoneda,
                guardarCriptomoneda,
                guardarConsultarAPI,
                setAlerta,
                setCriptomonedasList,
                setMostrarGrafico,
            }}
        >
            {children}
        </CryptoHook.Provider>
    );
};

export const useCrypto = () => {
    const context = useContext(CryptoHook);

    if (!context) {
        throw new Error("useCrypto debe usarse dentro de un CryptoProvider");
    }

    return context;
};
