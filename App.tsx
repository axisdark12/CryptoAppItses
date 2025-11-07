import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Header from './src/components/Header'
import Formulario from './src/components/Formulario';
import Cotizacion from './src/components/Cotizacion';
import GraficoHistorico from './src/components/GraficoHistorico'; // <--- 1. Importar el nuevo componente

const App  = () => {

  const [ moneda, guardarMoneda ] = useState('');
  const [ criptomoneda, guardarCriptomoneda ] = useState('');
  const [ consultarAPI, guardarConsultarAPI ] = useState(false);
  const [ resultado, guardarResultado] = useState({});
  const [ cargando, guardarCargando] = useState(false);
  const [ mostrarGrafico, setMostrarGrafico ] = useState(false);
  const [ criptomonedasList, setCriptomonedasList ] = useState<any[]>([]); // Se usará en pasos posteriores

  useEffect(() => {
    const cotizarCriptomoneda = async () => {
      if(consultarAPI) {
          // consultar la api para obtener la cotización
          const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
          const resultado = await axios.get(url);

          // console.log(resultado.data.DISPLAY[criptomoneda][moneda] );
          guardarCargando(true);

          // Ocultar el spinner y mostrar el resultado
          setTimeout(() => {
              guardarResultado(resultado.data.DISPLAY[criptomoneda][moneda] );
              guardarConsultarAPI(false);
              guardarCargando(false);
              
          }, 3000);
      }
    }
    cotizarCriptomoneda();
  }, [consultarAPI]);
  const handleOpenChart = () => setMostrarGrafico(true);
  const handleCloseChart = () => setMostrarGrafico(false);

  // mostrar el spinner o el resultado
  const componente = cargando ? <ActivityIndicator size="large" color="#5E49E2" /> : <Cotizacion  resultado={resultado} />

  return (
    <>
    <ScrollView>
        <Header onOpenChart={handleOpenChart} />

        <Image
          style={styles.imagen}
          source={ require('./assets/img/cryptomonedas.png') }
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
        <View style={{ marginTop: 40 }}>
          {componente}
        </View>
   
      </ScrollView>
      
      {/* AGREGAR EL COMPONENTE GRÁFICO (Modal) */}
      <GraficoHistorico 
        isVisible={mostrarGrafico}
        onClose={handleCloseChart}
        criptomonedas={criptomonedasList} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  imagen: {
    width: '100%',
    height: 150,
    marginHorizontal: '2.5%'
  },
  contenido: {
    marginHorizontal: '2.5%'
  }
});

export default App;
