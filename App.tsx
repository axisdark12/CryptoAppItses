import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Header from './src/components/Header'
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

        <View style={styles.contenido}>
          <Formulario
            moneda={moneda}
            criptomoneda={criptomoneda}
            guardarMoneda={guardarMoneda}
            guardarCriptomoneda={guardarCriptomoneda}
            guardarConsultarAPI={guardarConsultarAPI}
          />
        </View>
        <View>
          {cargando && <ActivityIndicator size="large" color="#5E49E2" />}
          {!cargando && resultado && <Estadisticas stats={resultado} history={historial} />}
        </View>

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  contenedor:{
    backgroundColor: '#4d4c4cff'
  },
  contenido: {
    marginHorizontal: '2.5%'
  }
});

export default App;
