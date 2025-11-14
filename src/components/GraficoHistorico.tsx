import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, Platform, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
// Importamos los componentes de WAGMI Charts
import { CandlestickChart } from 'react-native-wagmi-charts'; 

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
// Tipado de datos para WAGMI (requiere timestamp en milisegundos)
interface WagmiCandle {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
}
interface GraficoHistoricoProps {
    isVisible: boolean;
    onClose: () => void;
    criptomonedas: CryptoData[]; 
}

const screenWidth = Dimensions.get("window").width;
const CHART_HEIGHT = 250;

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

    // Función para formatear los datos al formato requerido por WAGMI (timestamp en milisegundos)
    const getWagmiChartData = (): WagmiCandle[] => {
        if (historicalData.length === 0) return [];
        
        return historicalData.map((d) => ({
            // Multiplicamos por 1000 para pasar de segundos a milisegundos
            timestamp: d.time * 1000, 
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
        }));
    };

    const wagmiChartData = getWagmiChartData();
    
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
                    <Text style={styles.modalTitle}>🕯️ Gráfico de Velas WAGMI (24h)</Text>
                    
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
                             wagmiChartData.length > 0 ? (
                                <View style={{ width: screenWidth * 0.9, height: CHART_HEIGHT }}>
                                    <Text style={styles.chartTitle}>Gráfico de Velas Horarias</Text>
                                    
                                    {/* Implementación del Gráfico de Velas de WAGMI */}
                                    <CandlestickChart.Provider data={wagmiChartData}>
                                        <CandlestickChart height={CHART_HEIGHT}>
                                            <CandlestickChart.Candles />
                                        </CandlestickChart>
                                        {/* No implementamos ejes ni cursores interactivos para mantener la simplicidad */}
                                    </CandlestickChart.Provider>
                                    
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

                                    <Text style={styles.infoText}>Granularidad: Horaria (WAGMI Charts)</Text>
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
    // ... (Styles se mantienen igual)
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