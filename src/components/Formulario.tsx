import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

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