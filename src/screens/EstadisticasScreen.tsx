import React from 'react'
import Estadisticas from '../components/Estadisticas';
import { useCrypto } from '../components/Logic/CryptoHook';
import { View, Text, StyleSheet } from 'react-native';

export default function EstadisticasScreen() {
    const { stats, historial } = useCrypto();
    const noData = !stats || !historial || historial.length === 0;
    return (
        <View style={styles.container}>
            {noData ? (
                <View style={styles.messageContainer}>
                    <Text style={styles.title}>Sin datos disponibles</Text>
                    <Text style={styles.subtitle}>
                        Desde la pestaña <Text style={styles.highlight}>'Home' </Text> 
                        selecciona una moneda y criptomoneda, luego pulsa
                        <Text style={styles.highlight}> "Guardar"</Text> para ver las estadísticas aquí.
                    </Text>
                </View>
            ) : (
                <Estadisticas stats={stats} history={historial} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        padding: 20,
        justifyContent: 'center',
    },
    messageContainer: {
        backgroundColor: '#333232ff',
        padding: 25,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#4c31fbff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#D1C4E9',
        textAlign: 'center',
        lineHeight: 22,
    },
    highlight: {
        color: '#7864fcff',
        fontWeight: '700'
    }
});