import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const TASA_USD_MXN = 20;

const GraficoBitcoin = ({ cerrarModal }: any) => {
  const [historial, setHistorial] = useState<number[]>([]);
  const [fechas, setFechas] = useState<{ diaMostrado: string; mesMostrado: string }[]>([]);
  const [precioReferencia, setPrecioReferencia] = useState('');
  const [precioY, setPrecioY] = useState<number | null>(null);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const url =
          'https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=8';

        const { data } = await axios.get(url);

        const preciosUSD = data.Data.Data.map((d: any) => d.close);

        // Fechas separadas en día y mes
        const fechasProcesadas = data.Data.Data.map((d: any) => {
          const date = new Date(d.time * 1000);

          return {
            diaMostrado: String(date.getDate()),
            mesMostrado: date.toLocaleString('es-MX', { month: 'short' }), // ej "nov"
          };
        });

        // Convertir precios a MXN
        const preciosMXN = preciosUSD.map((p: number) => p * TASA_USD_MXN);

        // Formato elegante MXN
        const preciosFormateados = preciosMXN.map((p: number) =>
          Math.round(p)
        );

        setHistorial(preciosFormateados.slice(-15));
        setFechas(fechasProcesadas.slice(-15));

      } catch (error) {
        console.log('Error al obtener historial:', error);
      }
    };

    obtenerHistorial();
  }, []);

  const marcarPrecio = () => {
    const valor = parseFloat(precioReferencia);
    if (!isNaN(valor)) setPrecioY(valor);
  };

  const screenWidth = Dimensions.get('window').width - 20;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Bitcoin</Text>

      {/* Mes mostrado debajo */}
      {fechas.length > 0 && (
        <Text style={styles.mesTexto}>
          Mes: {fechas[0].mesMostrado.toUpperCase()}
        </Text>
      )}

      {historial.length > 0 && (
        <LineChart
          data={{
            labels: fechas.map((f) => f.diaMostrado),
            datasets: [
              {
                data: historial,
                color: () => '#03775cff',
                strokeWidth: 2,
              },
              ...(precioY
                ? [
                    {
                      data: Array(historial.length).fill(precioY),
                      color: () => 'blue',
                      strokeWidth: 2,
                    },
                  ]
                : []),
            ],
          }}
          width={screenWidth}
          height={260}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#ccd2d7e6',
            backgroundGradientTo: '#cdd2d7e6',
            decimalPlaces: 0,

            color: (opacity = 1) => `rgba(94, 73, 226, ${opacity})`,

            labelColor: () => '#000',

            propsForDots: {
              r: '3',
              strokeWidth: '1',
              stroke: '#d3e8d6ff',
            },
          }}
          bezier
          style={styles.grafica}
        />
      )}

      {/* Input referencia */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Precio de referencia (MXN):</Text>

        <TextInput
          placeholder="Ej. 150000"
          keyboardType="numeric"
          style={styles.input}
          value={precioReferencia}
          onChangeText={setPrecioReferencia}
        />

        <TouchableOpacity style={styles.boton} onPress={marcarPrecio}>
          <Text style={styles.botonTexto}>Marcar línea</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botonCerrar} onPress={cerrarModal}>
        <Text style={styles.cerrarTexto}>Cerrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Lato-Black',
    color: '#5E49E2',
    marginVertical: 10,
  },
  mesTexto: {
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
    fontFamily: 'Lato-Regular',
  },
  grafica: {
    marginVertical: 15,
    borderRadius: 10,
  },
  inputContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#5E49E2',
    borderRadius: 8,
    width: '80%',
    padding: 8,
    marginBottom: 10,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#161326ff',
    padding: 10,
    borderRadius: 8,
  },
  botonTexto: {
    color: '#FFF',
    fontFamily: 'Lato-Black',
  },
  botonCerrar: {
    backgroundColor: '#971717ff',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  cerrarTexto: {
    color: '#FFF',
    fontFamily: 'Lato-Black',
  },
});

export default GraficoBitcoin;
