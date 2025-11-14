import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Header from './src/components/Header';
import Formulario from './src/components/Formulario';
import Cotizacion from './src/components/Cotizacion';
import BotonGrafica from './src/Mis-Archivos-Ang/BotonGrafica';

const App = () => {
  const [moneda, guardarMoneda] = useState('');
  const [criptomoneda, guardarCriptomoneda] = useState('');
  const [consultarAPI, guardarConsultarAPI] = useState(false);
  const [resultado, guardarResultado] = useState({});
  const [cargando, guardarCargando] = useState(false);

  useEffect(() => {
    const cotizarCriptomoneda = async () => {
      if (consultarAPI) {
        try {
          const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
          const resultado = await axios.get(url);

          guardarCargando(true);

          // Simula carga
          setTimeout(() => {
            guardarResultado(resultado.data.DISPLAY[criptomoneda][moneda]);
            guardarConsultarAPI(false);
            guardarCargando(false);
          }, 3000);
        } catch (error) {
          console.error('Error al consultar la API:', error);
        }
      }
    };
    cotizarCriptomoneda();
  }, [consultarAPI]);

  const componente = cargando ? (
    <ActivityIndicator size="large" color="#5E49E2" />
  ) : (
    <Cotizacion resultado={resultado} />
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Botón flotante para abrir el modal del gráfico */}
      <BotonGrafica />

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
          />
        </View>

        <View style={{ marginTop: 40 }}>{componente}</View>
      </ScrollView>
    </View>
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
