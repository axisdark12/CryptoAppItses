import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const GraficoBitcoin = ({ cerrarModal }: any) => {
  const [historial, setHistorial] = useState<number[]>([]);
  const [fechas, setFechas] = useState<string[]>([]);
  const [precioReferencia, setPrecioReferencia] = useState('');
  const [precioY, setPrecioY] = useState<number | null>(null);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const url = 'https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30';
        const { data } = await axios.get(url);
        const precios = data.Data.Data.map((d: any) => d.close);
        const labels = data.Data.Data.map((d: any) => {
          const date = new Date(d.time * 1000);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        setHistorial(precios);
        setFechas(labels);
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

      {historial.length > 0 && (
        <LineChart
          data={{
            labels: fechas,
            datasets: [
              {
                data: historial,
                color: () => '#5E49E2',
                strokeWidth: 2,
              },
              ...(precioY
                ? [
                    {
                      data: Array(historial.length).fill(precioY),
                      color: () => 'red',
                      strokeWidth: 1.5,
                    },
                  ]
                : []),
            ],
          }}
          width={screenWidth}
          height={260}
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#FFF',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(94, 73, 226, ${opacity})`,
            labelColor: () => '#000',
            propsForDots: { r: '3', strokeWidth: '1', stroke: '#5E49E2' },
          }}
          bezier
          style={styles.grafica}
        />
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Precio de referencia:</Text>
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
    backgroundColor: '#FFF',
  },
  titulo: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Lato-Black',
    color: '#5E49E2',
    marginVertical: 10,
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
    backgroundColor: '#5E49E2',
    padding: 10,
    borderRadius: 8,
  },
  botonTexto: {
    color: '#FFF',
    fontFamily: 'Lato-Black',
  },
  botonCerrar: {
    backgroundColor: '#444',
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
