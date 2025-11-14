import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, Platform, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit'; 

// Tipado de datos
interface CryptoData {
    CoinInfo: {
        Id: string;
        FullName: string;
        Name: string;
    }
}
interface OHLCVPoint {
    time: number;
    close: number;
    high: number;
    low: number;
    open: number;
}
interface GraficoHistoricoProps {
    isVisible: boolean;
    onClose: () => void;
    criptomonedas: CryptoData[]; 
}

const screenWidth = Dimensions.get("window").width;

const GraficoHistorico = ({ isVisible, onClose, criptomonedas }: GraficoHistoricoProps) => {

    const [selectedCripto, setSelectedCripto] = useState('');
    const [historicalData, setHistoricalData] = useState<OHLCVPoint[]>([]);
    const [loading, setLoading] = useState(false);

    // Inicializar la selección de la criptomoneda
    useEffect(() => {
        if (criptomonedas.length > 0 && !selectedCripto) {
            setSelectedCripto(criptomonedas[0].CoinInfo.Name); 
        }
    }, [criptomonedas]);

    // Lógica para obtener los datos históricos reales
    useEffect(() => {
        const fetchHistoricalData = async () => {
            if (!selectedCripto) return; 
            setLoading(true);
            try {
                // Endpoint de datos horarios con límite 23 (24 puntos)
                const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${selectedCripto}&tsym=USD&limit=23`;
                const response = await axios.get(url);

                if (response.data.Data && response.data.Data.Data) {
                    setHistoricalData(response.data.Data.Data);
                } else {
                    Alert.alert('Error', 'No se pudieron obtener datos históricos.');
                    setHistoricalData([]);
                }
            } catch (error) {
                Alert.alert('Error API', 'Ocurrió un error al consultar la API histórica.');
                setHistoricalData([]);
            } finally {
                setLoading(false);
            }
        };

        if (isVisible) {
            fetchHistoricalData();
        }
    }, [selectedCripto, isVisible]); 

    // Función para procesar los datos para el LineChart (usando el precio de cierre)
    const getChartData = () => {
        if (historicalData.length === 0) {
            return {
                labels: [],
                datasets: [{ data: [0] }],
            };
        }

        const closes = historicalData.map(d => d.close);
        // Etiquetas: Usamos la hora local para formatear el eje X 
        const times = historicalData.map(d => new Date(d.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        const labelsToShow = times.filter((_, index) => index % 4 === 0);
        
        return {
            labels: labelsToShow,
            datasets: [{
                data: closes,
                color: (opacity = 1) => `rgba(94, 73, 226, ${opacity})`, 
                strokeWidth: 2 
            }],
        };
    };

    const chartData = getChartData();
    
    // Obtener los datos del último punto (el más reciente) para la vista OHLCV
    const lastDataPoint = historicalData.length > 0 ? historicalData[historicalData.length - 1] : null;


    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <ScrollView>
                    <Text style={styles.modalTitle}>📈 Histórico de Precios (24h)</Text>
                    
                    {/* Selector de Criptomoneda */}
                    <Text style={styles.label}>SELECCIONAR CRIPTOMONEDA (VS USD)</Text>
                    
                    <View style={styles.pickerWrapper}> 
                        <Picker
                            selectedValue={selectedCripto}
                            onValueChange={(itemValue) => setSelectedCripto(itemValue)}
                            itemStyle={styles.pickerItem}
                            style={styles.pickerStyle}
                        >
                            {criptomonedas.length > 0 ? criptomonedas.map(cripto => (
                                <Picker.Item 
                                    key={cripto.CoinInfo.Id} 
                                    label={`${cripto.CoinInfo.FullName} (${cripto.CoinInfo.Name})`} 
                                    value={cripto.CoinInfo.Name} 
                                />
                            )) : (<Picker.Item label="Cargando..." value="" />)}
                        </Picker>
                    </View>

                    {/* Contenedor del Gráfico */}
                    <View style={styles.chartContainer}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#5E49E2" style={{ marginTop: 100, marginBottom: 100 }} />
                        ) : (
                             historicalData.length > 0 ? (
                                <View>
                                    <Text style={styles.chartTitle}>Precio de Cierre por Hora</Text>
                                    
                                    <LineChart
                                        data={chartData}
                                        width={screenWidth * 0.9} 
                                        height={220}
                                        chartConfig={{
                                            backgroundColor: '#ffffff',
                                            backgroundGradientFrom: '#ffffff',
                                            backgroundGradientTo: '#ffffff',
                                            decimalPlaces: 2, 
                                            color: (opacity = 1) => `rgba(94, 73, 226, ${opacity})`, 
                                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: { borderRadius: 16 },
                                            propsForDots: { r: "3", strokeWidth: "1", stroke: "#5E49E2" }
                                        }}
                                        bezier 
                                        style={{ marginVertical: 8, borderRadius: 16 }}
                                    />
                                    
                                    {/* Vista de Detalles OHLCV */}
                                    {lastDataPoint && (
                                        <View style={styles.ohlcvContainer}>
                                            <Text style={styles.ohlcvText}>**Última Vela (OHLCV):**</Text>
                                            <Text style={styles.ohlcvDetail}>Apertura (Open): 
                                                <Text style={styles.ohlcvValue}> ${lastDataPoint.open.toFixed(2)}</Text>
                                            </Text>
                                            <Text style={styles.ohlcvDetail}>Alto (High): 
                                                <Text style={styles.ohlcvValue}> ${lastDataPoint.high.toFixed(2)}</Text>
                                            </Text>
                                            <Text style={styles.ohlcvDetail}>Bajo (Low): 
                                                <Text style={styles.ohlcvValue}> ${lastDataPoint.low.toFixed(2)}</Text>
                                            </Text>
                                            <Text style={styles.ohlcvDetail}>Cierre (Close): 
                                                <Text style={styles.ohlcvValue}> ${lastDataPoint.close.toFixed(2)}</Text>
                                            </Text>
                                        </View>
                                    )}

                                    <Text style={styles.infoText}>Granularidad: Horaria (Muestra Precio de Cierre OHLCV)</Text>
                                </View>
                            ) : (
                                <Text style={styles.noDataText}>Seleccione una criptomoneda para cargar el historial, o no hay datos disponibles.</Text>
                            )
                        )}
                    </View>
                    
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.textCloseButton}>CERRAR MODAL</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: 'Lato-Black',
        color: '#5E49E2',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontFamily: 'Lato-Black',
        textTransform: 'uppercase',
        fontSize: 18,
        marginVertical: 10,
    },
    pickerWrapper: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        overflow: 'hidden',
    },
    pickerStyle: {
        height: Platform.OS === 'ios' ? 120 : 50,
        width: '100%',
        backgroundColor: 'transparent',
    },
    pickerItem: {
        height: 120,
    },
    chartContainer: {
        marginTop: 20,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 5,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    chartTitle: {
        fontSize: 16,
        fontFamily: 'Lato-Black',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 5,
    },
    infoText: {
        fontSize: 14,
        fontFamily: 'Lato-Regular',
        textAlign: 'center',
        color: '#666',
        marginBottom: 10,
    },
    noDataText: {
        textAlign: 'center',
        fontFamily: 'Lato-Regular',
        marginVertical: 20,
    },
    closeButton: {
        backgroundColor: '#333',
        padding: 15,
        marginTop: 30,
        borderRadius: 8,
        marginBottom: 50,
    },
    textCloseButton: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Lato-Black',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    // Nuevos estilos para la vista OHLCV
    ohlcvContainer: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        width: '100%',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#eee'
    },
    ohlcvText: {
        fontFamily: 'Lato-Black',
        fontSize: 14,
        marginBottom: 5
    },
    ohlcvDetail: {
        fontFamily: 'Lato-Regular',
        fontSize: 14,
        color: '#333'
    },
    ohlcvValue: {
        fontFamily: 'Lato-Black',
        color: '#5E49E2'
    }
});

export default GraficoHistorico;