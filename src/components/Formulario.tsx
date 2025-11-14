import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
<<<<<<< HEAD

const Formulario = ({ moneda, criptomoneda, guardarMoneda, guardarCriptomoneda, guardarConsultarAPI }: any) => {

    const [criptomonedas, guardarCriptomonedas] = useState([]);

    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
            const resultado = await axios.get(url);
            guardarCriptomonedas(resultado.data.Data);
        }
        consultarAPI();
    }, []);

    // Almacena las selecciones del usuario
    const obtenerMoneda = (moneda: any) => {
        guardarMoneda(moneda)
    }
    const obtenerCriptomoneda = (cripto: any) => {
        guardarCriptomoneda(cripto)
    }

    const cotizarPrecio = () => {
        if (moneda.trim() === '' || criptomoneda.trim() === '') {
            mostrarAlerta();
            return;
        }
        guardarConsultarAPI(true)

    }

    const mostrarAlerta = () => {
        Alert.alert(
            'Error...',
            'Ambos campos son obligatorios',
            [
                { text: 'OK' }
            ]
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Selecciona tu moneda y criptomoneda</Text>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.label}>Moneda</Text>
                    <Picker
                        selectedValue={moneda}
                        onValueChange={obtenerMoneda}
                        style={styles.picker}
                    >
                        <Picker.Item label="-" value="" />
                        <Picker.Item label="Dólar (USD)" value="USD" />
                        <Picker.Item label="Peso (MXN)" value="MXN" />
                        <Picker.Item label="Euro (EUR)" value="EUR" />
                        <Picker.Item label="Libra (GBP)" value="GBP" />
                    </Picker>
                </View>

                <View style={styles.col}>
                    <Text style={styles.label}>Cripto</Text>
                    <Picker
                        selectedValue={criptomoneda}
                        onValueChange={obtenerCriptomoneda}
                        style={styles.picker}
                    >
                        <Picker.Item label="-" value="" />
                        {criptomonedas.map((cripto: any) => (
                            <Picker.Item
                                key={cripto.CoinInfo.Id}
                                label={cripto.CoinInfo.FullName}
                                value={cripto.CoinInfo.Name}
                            />
                        ))}
                    </Picker>
                </View>
            </View>

            <TouchableHighlight style={styles.btnCotizar} onPress={cotizarPrecio}>
                <Text style={styles.textoCotizar}>Ver Estadisticas</Text>
            </TouchableHighlight>
        </View>
    );
}

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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    col: {
        flex: 1,
        marginHorizontal: 4
    },
    label: {
        color: '#BBB',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 4
    },
    picker: {
        backgroundColor: '#6d6a6ac4',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: "bold",
    },
    btnCotizar: {
        backgroundColor: '#2d2660ff',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center'
    },
    textoCotizar: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
});

export default Formulario;
=======
import type {criptoItem} from '../types/alertas'


const Formulario = ({moneda, criptomoneda, guardarMoneda, guardarCriptomoneda, guardarConsultarAPI, guardarAlerta,}:any) => {
  const [criptomonedas, guardarCriptomonedas] = useState<criptoItem[]>([]);

  const [precioObjetivo, setPrecioObjetivo] = useState('');
  
  const [condicion, setCondicion] = useState('above'); 

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

  // Almacena las selecciones del usuario
  const obtenerMoneda = (monedaSeleccionada: string) => {
    guardarMoneda(monedaSeleccionada);
  };

  const obtenerCriptomoneda = (criptoSeleccionada: string) => {
    guardarCriptomoneda(criptoSeleccionada);
  };

  const mostrarAlerta = (
    titulo = 'Error...',
    mensaje = 'Ambos campos son obligatorios'
  ) => {
    Alert.alert(titulo, mensaje, [{ text: 'OK' }]);
  };

  const cotizarPrecio = () => {
    if (moneda.trim() === '' || criptomoneda.trim() === '') {
      mostrarAlerta();
      return;
    }

    guardarConsultarAPI(true);
  };

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
      mostrarAlerta('Error...', 'Ingresa un precio objetivo valido');
      return;
    }

    guardarAlerta({
      moneda,
      criptomoneda,
      precioObjetivo: precioNumero,
      condicion,
    });

    Alert.alert(
      'Alerta creada',
      `Te avisaremos cuando ${criptomoneda} ${
        condicion === 'above' ? 'suba a' : 'baje a'
      } ${formatearNumero(precioNumero)} ${moneda}`
    );
  };

    const formatearNumero = (valor: number) => {
    return new Intl.NumberFormat('es-Mx',{
        minimumFractionDigits: 1,
        maximumFractionDigits: 4,
    }).format(valor)
  }

  return (
    <View>
      <Text style={styles.label}>Moneda</Text>
      <Picker
        selectedValue={moneda}
        onValueChange={monedaSeleccionada => obtenerMoneda(monedaSeleccionada)}
        itemStyle={{ height: 120 }}
      >
        <Picker.Item label="- Seleccione -" value="" />
        <Picker.Item label="Dólar de Estados Unidos" value="USD" />
        <Picker.Item label="Peso Mexicano" value="MXN" />
        <Picker.Item label="Euro" value="EUR" />
        <Picker.Item label="Libra Esterlina" value="GBP" />
      </Picker>

      <Text style={styles.label}>Criptomoneda</Text>
      <Picker
        selectedValue={criptomoneda}
        onValueChange={criptoSeleccionada =>
          obtenerCriptomoneda(criptoSeleccionada)
        }
        itemStyle={{ height: 120 }}
      >
        <Picker.Item label="- Seleccione -" value="" />
        {criptomonedas.map(cripto => (
          <Picker.Item
            key={cripto.CoinInfo?.Id}
            label={cripto.CoinInfo?.FullName}
            value={cripto.CoinInfo?.Name}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Alerta de precio</Text>

      <Text style={styles.label2}>Precio objetivo</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="Ej. 1500"
        value={precioObjetivo}
        onChangeText={setPrecioObjetivo}
        style={styles.input}
      />

      <Text style={styles.label2}>Condición</Text>
      <Picker
        selectedValue={condicion}
        onValueChange={valor => setCondicion(valor)}
        itemStyle={{ height: 120 }}
      >
        <Picker.Item
          label="Cuando SUBA a ese precio"
          value="above"
        />
        <Picker.Item
          label="Cuando BAJE a ese precio"
          value="below"
        />
      </Picker>

      <TouchableHighlight
        style={styles.btnAlerta}
        onPress={crearAlerta}
      >
        <Text style={styles.textoCotizar}>Crear alerta</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.btnCotizar}
        onPress={cotizarPrecio}
      >
        <Text style={styles.textoCotizar}>Cotizar</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Lato-Black',
    textTransform: 'uppercase',
    fontSize: 22,
    marginVertical: 20,
  },
  label2: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
  },
  btnCotizar: {
    backgroundColor: '#5E49E2',
    padding: 10,
    marginTop: 20,
  },
  btnAlerta: {
    backgroundColor: '#3D2CC5',
    padding: 10,
    marginTop: 20,
  },
  textoCotizar: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Lato-Black',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default Formulario;
>>>>>>> main
