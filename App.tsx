import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import Header from './src/components/Header';
import Formulario from './src/components/Formulario';
import Cotizacion from './src/components/Cotizacion';
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

  useEffect(() => {
    const cotizarCriptomoneda = async () => {
      if (consultarAPI) {
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

    cotizarCriptomoneda();
  }, [consultarAPI, criptomoneda, moneda]);

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
      <ScrollView>
        <Header />

        <Image
          style={styles.imagen}
          source={require('./assets/img/cryptomonedas.png')}
        />

        <View style={styles.contenido}>
          <Formulario
            moneda={moneda}
            criptomoneda={criptomoneda}
            guardarMoneda={guardarMoneda}
            guardarCriptomoneda={guardarCriptomoneda}
            guardarConsultarAPI={guardarConsultarAPI}
            guardarAlerta={setAlerta}
          />
        </View>

        <View style={{ marginTop: 40 }}>
          {componente}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  imagen: {
    width: '100%',
    height: 150,
    marginHorizontal: '2.5%',
  },
  contenido: {
    marginHorizontal: '2.5%',
  },
});

export default App;
