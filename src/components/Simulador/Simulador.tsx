import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import FormularioSimulador from './FormularioSimulador';
import ResultadoSimulador from './ResultadoSimulador';

const Simulador = () => {
// estadps para el formulario 
    const [moneda, guardarMoneda] = useState(''); 
    const [criptomoneda, guardarCriptomoneda] = useState('');
    const [monto, guardarMonto] = useState('');
    const [fecha, guardarFecha] = useState(new Date(Date.now() - 86400000 * 365)); 
// estados para la logica
    const [consultarSimulador, guardarConsultarSimulador] = useState(false);
    const [resultadoSimulador, guardarResultadoSimulador] = useState(null);
    const [cargandoSimulador, guardarCargandoSimulador] = useState(false);

    useEffect(() => {
        const simularInversion = async () => {
            if (consultarSimulador) {
                guardarCargandoSimulador(true);
                guardarResultadoSimulador(null);

                try {
                    // Precio del historico 
                    const timestamp = Math.floor(fecha.getTime() / 1000);
                    const urlHist = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${criptomoneda}&tsyms=${moneda}&ts=${timestamp}`;

                    // precio actual 
                    const urlActual = `https://min-api.cryptocompare.com/data/price?fsym=${criptomoneda}&tsyms=${moneda}`;

                    const [resHist, resActual] = await Promise.all([
                        axios.get(urlHist),
                        axios.get(urlActual),
                    ]);

                    const precioCompra = resHist.data[criptomoneda][moneda];
                    const precioActual = resActual.data[moneda];
                    const montoNum = parseFloat(monto);

                    const criptoComprada = montoNum / precioCompra;
                    const valorActual = criptoComprada * precioActual;
                    const ganancia = valorActual - montoNum;
                    const roi = (ganancia / montoNum) * 100;

                    const simulacion = {
                        montoInvertido: montoNum,
                        precioCompra,
                        precioActual,
                        criptoComprada,
                        valorActual,
                        ganancia,
                        roi,
                    };

                    setTimeout(() => {
                        guardarResultadoSimulador(simulacion as any);
                        guardarConsultarSimulador(false);
                        guardarCargandoSimulador(false);
                    }, 1000);

                } catch (error) {
                    mostrarAlerta('Error al simular');
                    guardarCargandoSimulador(false);
                    guardarConsultarSimulador(false);
                }
            }
        };
        simularInversion();
    }, [consultarSimulador]);

    const mostrarAlerta = (mensaje: string) => {
        Alert.alert('Error', mensaje, [{ text: 'OK' }]);
    };

    const componenteSimulador = cargandoSimulador ? <ActivityIndicator size="large" color="#F0B90B" /> : <ResultadoSimulador resultado={resultadoSimulador} />

    return (
        <View>
            <FormularioSimulador
                moneda={moneda}
                criptomoneda={criptomoneda}
                monto={monto}
                fecha={fecha}
                guardarMoneda={guardarMoneda}
                guardarCriptomoneda={guardarCriptomoneda}
                guardarMonto={guardarMonto}
                guardarFecha={guardarFecha}
                guardarConsultarSimulador={guardarConsultarSimulador}
            />
           
            <View style={{ marginTop: 20 }}>
                {componenteSimulador}
            </View>
        </View>
    );
};

export default Simulador;