<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Header from "./src/components/Header";
import Formulario from "./src/components/Formulario";
import Cotizacion from "./src/components/Cotizacion";

const App = () => {
  const [moneda, guardarMoneda] = useState("");
  const [criptomoneda, guardarCriptomoneda] = useState("");
  const [consultarAPI, guardarConsultarAPI] = useState(false);
  const [resultado, guardarResultado] = useState({});
  const [cargando, guardarCargando] = useState(false);
=======
import React, { useState, useEffect } from 'react';
import Formulario from './src/components/Formulario';
import Estadisticas from './src/components/Estadisticas';
import { getCryptoStats } from './src/api/cryptoService';
import { getCryptoHistory } from './src/api/getCryptoHistory';
import type { CryptoStats } from './src/Types/CryptoStats';
import type { HistoricalData } from './src/Types/CryptoStats';

const App = () => {
  const [moneda, guardarMoneda] = useState('');
  const [criptomoneda, guardarCriptomoneda] = useState('');
  const [consultarAPI, guardarConsultarAPI] = useState(false);
  const [resultado, guardarResultado] = useState<CryptoStats | null>(null);
  const [cargando, guardarCargando] = useState(false);
  const [historial, guardarHistorial] = useState<HistoricalData[] | null>(null);

  useEffect(() => {
    const obtenerEstadisticas = async () => {
      if (consultarAPI) {
        try {
          // consultar la api 
          // const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
          const resultado = await getCryptoStats(criptomoneda, moneda);
          const historial = await getCryptoHistory(criptomoneda, moneda);
          // const data = resultado.data.RAW[criptomoneda][moneda];
          // console.log("Datos de la API en App.tsx: ", resultado);
          guardarResultado(resultado);
          guardarHistorial(historial);
        } catch (error) {
          Alert.alert(
            'Error',
            'No se puden obtener las estadísticas. Favor de intentar más tarde',
            [{ text: 'Ok' }]
          )
        } finally {
          guardarCargando(false);
          guardarConsultarAPI(false);
        }
      }
    }
    obtenerEstadisticas();
  }, [consultarAPI]);

  return (
    <>
      <ScrollView style={styles.contenedor}>
        <Header />

import { StyleSheet, Image, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import Header from './src/components/Header';
import Formulario from './src/components/Formulario';
import Cotizacion from './src/components/Cotizacion';
import GraficoHistorico from './src/components/GraficoHistorico';
import type {alertaPrecio} from '../CryptoAppItses/src/types/alertas'

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

const App = () => {
  const [moneda, guardarMoneda] = useState('');
  const [criptomoneda, guardarCriptomoneda] = useState('');
  const [consultarAPI, guardarConsultarAPI] = useState(false);
  const [resultado, guardarResultado] = useState({});
  const [cargando, guardarCargando] = useState(false);

  const [alerta, setAlerta] = useState<alertaPrecio | null>(null);
  
  const formatearNumero = (valor: number) => {
    return new Intl.NumberFormat('es-Mx',{
        minimumFractionDigits: 1,
        maximumFractionDigits: 4,
    }).format(valor)
  }

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

import Simulador from "./src/components/Simulador/Simulador";


  const [ moneda, guardarMoneda ] = useState('');
  const [ criptomoneda, guardarCriptomoneda ] = useState('');
  const [ consultarAPI, guardarConsultarAPI ] = useState(false);
  const [ resultado, guardarResultado] = useState({});
  const [ cargando, guardarCargando] = useState(false);
  
  // NUEVOS ESTADOS para el gráfico
  const [ mostrarGrafico, setMostrarGrafico ] = useState(false);
  const [ criptomonedasList, setCriptomonedasList ] = useState<any[]>([]);

  const enviarNotificacionAlerta = async (alerta:alertaPrecio, precioActual:number) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Alerta de precio',
          body: `${alerta.criptomoneda} ha ${
            alerta.condicion === 'above' ? 'subido' : 'bajado'
          } a ${formatearNumero(precioActual)} ${alerta.moneda}`,
          data: { tipo: 'alerta_precio' },
        },
        trigger: null,
      });
    } catch (error) {
      console.log('Error al enviar notificación', error);
    }
  };
>>>>>>> 81c1c2ebf0d119ecdbf31bfd3e64cee7317e6f60

  useEffect(() => {
    const cotizarCriptomoneda = async () => {
      if (consultarAPI) {
<<<<<<< HEAD
        // consultar la api para obtener la cotizacion
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
        const resultado = await axios.get(url);

        // console.log(resultado.data.DISPLAY[criptomoneda][moneda] );
        guardarCargando(true);

        // Ocultar el spinner y mostrar el resultado
        setTimeout(() => {
          guardarResultado(resultado.data.DISPLAY[criptomoneda][moneda]);
          guardarConsultarAPI(false);
          guardarCargando(false);
        }, 3000);
      }
    };
=======
        try {
          const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
          const respuesta = await axios.get(url);

          guardarCargando(true);

          setTimeout(() => {
            const datos = respuesta.data.DISPLAY?.[criptomoneda]?.[moneda];
            if (datos) {
              guardarResultado(datos);
            } else {
              console.log('No se encontraron datos');
            }
            guardarConsultarAPI(false);
            guardarCargando(false);
          }, 3000);
        } catch (error) {
          console.log('Error al cotizar', error);
          guardarConsultarAPI(false);
          guardarCargando(false);
          Alert.alert('Error', 'Error al obtener la cotización.');
        }
      }
    };

>>>>>>> 81c1c2ebf0d119ecdbf31bfd3e64cee7317e6f60
    cotizarCriptomoneda();
  }, [consultarAPI]);

  // mostrar el spinner o el resultado
  const componente = cargando ? (
    <ActivityIndicator size="large" color="#5E49E2" />
  ) : (
    <Cotizacion resultado={resultado} />
  );

  return (
    <>
<<<<<<< HEAD
=======
    <ScrollView>
        <Header onOpenChart={handleOpenChart} />
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
            `${alerta.criptomoneda} ha ${
              alerta.condicion === 'above' ? 'subido' : 'bajado'
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

  const componente = cargando ? (
    <ActivityIndicator size="large" color="#5E49E2" />
  ) : (
    <Cotizacion resultado={resultado} />
  );

  return (
    <>
>>>>>>> 81c1c2ebf0d119ecdbf31bfd3e64cee7317e6f60
      <ScrollView>
        <Header />

        <Image
          style={styles.imagen}
<<<<<<< HEAD
          source={require("./assets/img/cryptomonedas.png")}
        />

        <View style={styles.contenido}>
=======
          source={require('./assets/img/cryptomonedas.png')}
        />

        <View style={styles.contenido}>
            <Formulario 
              moneda={moneda}
              criptomoneda={criptomoneda}
              guardarMoneda={guardarMoneda}
              guardarCriptomoneda={guardarCriptomoneda}
              guardarConsultarAPI={guardarConsultarAPI}
              setCriptomonedasList={setCriptomonedasList} 
            />
>>>>>>> 81c1c2ebf0d119ecdbf31bfd3e64cee7317e6f60
          <Formulario
            moneda={moneda}
            criptomoneda={criptomoneda}
            guardarMoneda={guardarMoneda}
            guardarCriptomoneda={guardarCriptomoneda}
            guardarConsultarAPI={guardarConsultarAPI}
<<<<<<< HEAD
          />
        </View>
        <View style={{ marginTop: 40 }}>{componente}</View>
=======
            guardarAlerta={setAlerta}
          />
        </View>

        <View style={{ marginTop: 40 }}>
          {componente}
        </View>
>>>>>>> 81c1c2ebf0d119ecdbf31bfd3e64cee7317e6f60

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  imagen: {
    width: "100%",
    height: 150,
<<<<<<< HEAD
    marginHorizontal: "2.5%",
  },
  contenido: {
    marginHorizontal: "2.5%",
=======
    marginHorizontal: '2.5%',

  },
  contenido: {
    marginHorizontal: '2.5%',
>>>>>>> 81c1c2ebf0d119ecdbf31bfd3e64cee7317e6f60
  },
});

export default App;
