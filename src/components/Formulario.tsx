import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Alert,
  TextInput
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import type { criptoItem } from '../Types/alertas';

const Formulario = ({
  moneda,
  criptomoneda,
  guardarMoneda,
  guardarCriptomoneda,
  guardarConsultarAPI,
  guardarAlerta
}: any) => {

  const [criptomonedas, guardarCriptomonedas] = useState<criptoItem[]>([]);
  const [precioObjetivo, setPrecioObjetivo] = useState('');
  const [condicion, setCondicion] = useState('above'); // above / below

  // ================================
  // CARGA DE TOP 10 CRIPTOMONEDAS
  // ================================
  useEffect(() => {
    const consultarAPI = async () => {
      try {
        const url =
          'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
        const resultado = await axios.get(url);

        guardarCriptomonedas(resultado.data.Data || []);
      } catch (error) {
        console.log('Error al obtener criptomonedas', error);
        Alert.alert('Error', 'No se pudieron cargar las criptomonedas.');
      }
    };
    consultarAPI();
  }, []);

  // ================================
  // UTILIDADES
  // ================================
  const mostrarAlerta = (
    titulo = 'Error...',
    mensaje = 'Ambos campos son obligatorios'
  ) => {
    Alert.alert(titulo, mensaje, [{ text: 'OK' }]);
  };

  const formatearNumero = (valor: number) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 4
    }).format(valor);
  };

  // ================================
  // COTIZAR PRECIO
  // ================================
  const cotizarPrecio = () => {
    if (moneda.trim() === '' || criptomoneda.trim() === '') {
      mostrarAlerta();
      return;
    }
    guardarConsultarAPI(true);
  };

  // ================================
  // CREAR ALERTA
  // ================================
  const crearAlerta = () => {
    if (
      moneda.trim() === '' ||
      criptomoneda.trim() === '' ||
      precioObjetivo.trim() === ''
    ) {
      mostrarAlerta(
        'Error...',
        'Moneda, criptomoneda y precio objetivo son obligatorios'
      );
      return;
    }

    const precioNumero = parseFloat(precioObjetivo);

    if (isNaN(precioNumero) || precioNumero <= 0) {
      mostrarAlerta('Error...', 'Ingresa un precio objetivo válido');
      return;
    }

    guardarAlerta({
      moneda,
      criptomoneda,
      precioObjetivo: precioNumero,
      condicion
    });

    Alert.alert(
      'Alerta creada',
      `Te avisaremos cuando ${criptomoneda} ${
        condicion === 'above' ? 'suba a' : 'baje a'
      } ${formatearNumero(precioNumero)} ${moneda}`
    );
  };

  // ================================
  // UI (UNIFICADO Y LIMPIO)
  // ================================
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Selecciona tu moneda y criptomoneda</Text>

      {/* Selección MONEDA */}
      <Text style={styles.label}>Moneda</Text>
      <Picker
        selectedValue={moneda}
        onValueChange={guardarMoneda}
        style={styles.picker}
        itemStyle={{ height: 120 }}
      >
        <Picker.Item label="-" value="" />
        <Picker.Item label="Dólar (USD)" value="USD" />
        <Picker.Item label="Peso (MXN)" value="MXN" />
        <Picker.Item label="Euro (EUR)" value="EUR" />
        <Picker.Item label="Libra (GBP)" value="GBP" />
      </Picker>

      {/* Selección CRIPTO */}
      <Text style={styles.label}>Criptomoneda</Text>
      <Picker
        selectedValue={criptomoneda}
        onValueChange={guardarCriptomoneda}
        style={styles.picker}
        itemStyle={{ height: 120 }}
      >
        <Picker.Item label="-" value="" />
        {criptomonedas.map((cripto: any) => (
          <Picker.Item
            key={cripto.CoinInfo?.Id}
            label={cripto.CoinInfo?.FullName}
            value={cripto.CoinInfo?.Name}
          />
        ))}
      </Picker>

      {/* ALERTA DE PRECIO */}
      <Text style={styles.label}>Alerta de precio</Text>

      <Text style={styles.label2}>Precio objetivo</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="Ej. 1500"
        placeholderTextColor="#888"
        value={precioObjetivo}
        onChangeText={setPrecioObjetivo}
        style={styles.input}
      />

      <Text style={styles.label2}>Condición</Text>
      <Picker
        selectedValue={condicion}
        onValueChange={valor => setCondicion(valor)}
        style={styles.picker}
        itemStyle={{ height: 120 }}
      >
        <Picker.Item label="Cuando SUBA a ese precio" value="above" />
        <Picker.Item label="Cuando BAJE a ese precio" value="below" />
      </Picker>

      {/* Botón crear alerta */}
      <TouchableHighlight style={styles.btnAlerta} onPress={crearAlerta}>
        <Text style={styles.textoBoton}>Crear alerta</Text>
      </TouchableHighlight>

      {/* Botón cotizar */}
      <TouchableHighlight style={styles.btnCotizar} onPress={cotizarPrecio}>
        <Text style={styles.textoBoton}>Ver estadísticas</Text>
      </TouchableHighlight>
    </View>
  );
};

// ================================
// ESTILOS COMBINADOS / LIMPIOS
// ================================
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4
  },
  titulo: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  label: {
    color: '#BBB',
    fontSize: 18,
    textTransform: 'uppercase',
    marginTop: 20
  },
  label2: {
    color: '#DDD',
    fontSize: 14,
    marginTop: 10
  },
  picker: {
    backgroundColor: '#6d6a6ac4',
    borderRadius: 8,
    marginTop: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
    color: '#FFF',
    backgroundColor: '#333',
    marginTop: 5
  },
  btnCotizar: {
    backgroundColor: '#2d2660ff',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20
  },
  btnAlerta: {
    backgroundColor: '#3D2CC5',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20
  },
  textoBoton: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
});

export default Formulario;
