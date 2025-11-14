import React, { useState, useEffect } from 'react';
import { 
    Text, 
    View, 
    StyleSheet, 
    TouchableHighlight, 
    Alert, 
    TextInput, 
    Platform,
    Modal, 
    SafeAreaView, 
    Button 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const FormularioSimulador = ({
    moneda,
    criptomoneda,
    monto,
    fecha,
    guardarMoneda,
    guardarCriptomoneda,
    guardarMonto,
    guardarFecha,
    guardarConsultarSimulador
}: any) => {

    const [criptomonedas, guardarCriptomonedas] = useState([]);
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
            const resultado = await axios.get(url);
            guardarCriptomonedas(resultado.data.Data);
        };
        consultarAPI();
    }, []);

    const simularInversion = () => {
        if (moneda.trim() === '' || criptomoneda.trim() === '' || monto.trim() === '' || !fecha) {
            mostrarAlerta('Todos los campos son obligatorios');
            return;
        }
        if (isNaN(Number(monto))) {
            mostrarAlerta('La cantidad debe ser un numero');
            return;
        }
        guardarConsultarSimulador(true);
    };

    const onFechaChange = (event: any, selectedDate: Date | undefined) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        if (selectedDate) {
            guardarFecha(selectedDate);
        }
    };

    const mostrarCalendario = () => {
        setShowPicker(true);
    };
    
    const cerrarCalendario = () => {
        setShowPicker(false);
    };

    const mostrarAlerta = (mensaje: string) => {
        Alert.alert('Error...', mensaje, [{ text: 'OK' }]);
    };

    const renderDateTimePicker = () => (
        <DateTimePicker
            testID="dateTimePicker"
            value={fecha || new Date()}
            mode={'date'}
            display="default" 
            onChange={onFechaChange}
            maximumDate={new Date(Date.now() - 86400000)} // Ayer
            style={Platform.OS === 'ios' ? styles.datePickerIOS : {}}
        />
    );

    return (
        <View style={styles.card}>
            <Text style={styles.labelSimulador}>Simulador "Si Hubieras Invertido..."</Text>

            <Text style={styles.label}>1. Elige tu Moneda</Text>
            <View style={[
                styles.pickerContainer,
                moneda ? styles.pickerContainerSelected : null
            ]}>
                <Picker
                    selectedValue={moneda}
                    onValueChange={valor => guardarMoneda(valor)}
                    itemStyle={{ height: 120 }}
                >
                    <Picker.Item label="- Seleccione -" value="" />
                    <Picker.Item label="Dolar Estadounidense" value="USD" />
                    <Picker.Item label="Peso Mexicano" value="MXN" />
                    <Picker.Item label="Euro" value="EUR" />
                    <Picker.Item label="Libra Esterlina" value="GBP" />
                </Picker>
            </View>

            <Text style={styles.label}>2. Elige la Criptomoneda</Text>
            <View style={[
                styles.pickerContainer,
                criptomoneda ? styles.pickerContainerSelected : null
            ]}>
                <Picker
                    selectedValue={criptomoneda}
                    onValueChange={valor => guardarCriptomoneda(valor)}
                    itemStyle={{ height: 120 }}
                >
                    <Picker.Item label="- Seleccione -" value="" />
                    {criptomonedas.map((cripto: any) => (
                        <Picker.Item 
                            key={cripto.CoinInfo.Id} 
                            label={cripto.CoinInfo.FullName} 
                            value={cripto.CoinInfo.Name} 
                        />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>3. Monto a Invertir ({moneda || "?"})</Text>
            <TextInput
                style={styles.input}
                onChangeText={texto => guardarMonto(texto)}
                value={monto}
                keyboardType="numeric"
                placeholder="Ej. 1000"
                placeholderTextColor="#999"
            />

            <Text style={styles.label}>4. Fecha de Inversión</Text>
            <TouchableHighlight style={styles.btnFecha} onPress={mostrarCalendario} underlayColor="#E0E0E0">
                <Text style={styles.textoFecha}>
                    {fecha 
                        ? fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) 
                        : 'Seleccionar Fecha'}
                </Text>
            </TouchableHighlight>

            {showPicker && Platform.OS === 'android' && renderDateTimePicker()}

            {showPicker && Platform.OS === 'ios' && (
                <Modal animationType="slide" transparent={true} visible={showPicker}>
                    <View style={styles.modalContainerIOS}>
                        <SafeAreaView style={styles.modalViewIOS}>
                            {renderDateTimePicker()}
                            <Button title="OK" onPress={cerrarCalendario} />
                        </SafeAreaView>
                    </View>
                </Modal>
            )}

            <TouchableHighlight
                style={styles.btnSimular}
                onPress={() => simularInversion()}
                underlayColor="#0a58ca" 
            >
                <Text style={styles.textoSimular}>Simular Inversion</Text>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginTop: 40,
        marginHorizontal: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    labelSimulador: {
        fontFamily: 'Lato-Black',
        fontSize: 24,
        textAlign: 'center',
        color: '#5E49E2',
        marginBottom: 20,
    },
    label: {
        fontFamily: 'Lato-Black',
        fontSize: 18,
        textTransform: 'uppercase',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    pickerContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD',
        overflow: 'hidden',
    },
    pickerContainerSelected: {
        borderColor: '#0b6ef0ff',
        backgroundColor: '#E8F0FE',
        shadowColor: '#0b6ef0ff',
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    input: {
        height: 50,
        backgroundColor: '#F0F0F0',
        borderColor: '#DDD',
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 8,
        fontSize: 16,
        color: '#000',
    },
    btnFecha: {
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderColor: '#DDD',
        padding: 15,
        borderRadius: 8,
    },
    textoFecha: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Lato-Regular',
    },
    btnSimular: {
        backgroundColor: '#0b6ef0ff',
        padding: 15,
        marginTop: 25,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    textoSimular: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Lato-Black',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    modalContainerIOS: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)' 
    },
    modalViewIOS: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    datePickerIOS: {
        height: 200,
    }
});

export default FormularioSimulador;
