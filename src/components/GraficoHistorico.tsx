import React from 'react';
import { StyleSheet, Text, View, Modal, Button, ScrollView, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; 

// Definición de Props para evitar errores de TypeScript
interface GraficoHistoricoProps {
    isVisible: boolean;
    onClose: () => void;
    criptomonedas: any[]; 
}

const GraficoHistorico = ({ isVisible, onClose, criptomonedas }: GraficoHistoricoProps) => {

    // Necesario para el LineChart, aunque lo usaremos en el siguiente paso
    const screenWidth = Dimensions.get("window").width; 

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <ScrollView>
                    <Text style={styles.modalTitle}>📊 Vista Histórica del Mercado</Text>
                    
                    <Text style={styles.placeholderText}>
                        Lógica de selector y datos históricos por hora (24h) van aquí.
                    </Text>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.textCloseButton}>Cerrar Modal</Text>
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
    placeholderText: {
        fontSize: 16,
        fontFamily: 'Lato-Regular',
        textAlign: 'center',
        marginVertical: 40,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 8
    },
    // Estilos del botón de cierre (usamos TouchableOpacity para mejor control)
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
    }
});

export default GraficoHistorico;