import React from 'react';
import { Text, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';

// Definición simple de Props (minimo tipado)
interface HeaderProps {
    onOpenChart: () => void;
}


const Header = ({ onOpenChart }: HeaderProps) => (
    <View style={styles.headerContainer}>
        <Text style={styles.encabezado}>Criptomonedas</Text>
        <TouchableOpacity
            style={styles.btnGrafico}
            onPress={onOpenChart}
        >
            <Text style={styles.textBtnGrafico}>📈 Histórico</Text>
        </TouchableOpacity>
    </View>
 );

const styles = StyleSheet.create({
    headerContainer: {
        // Aseguramos que el contenedor tenga el mismo fondo y padding
        paddingTop: Platform.OS === 'ios' ? 50 : 10,
        backgroundColor: '#5E49E2',
        paddingBottom: 10,
        marginBottom: 30, // Mantiene el espaciado original
        // Añadimos Flexbox para alinear título y botón
        flexDirection: 'column',
        alignItems: 'center',
    },
    encabezado: {
        fontFamily: 'Lato-Black',
        textAlign: 'center',
        textTransform: 'uppercase',
        fontSize: 20,
        color: '#FFF',
        paddingHorizontal: 10,
    },
    btnGrafico: {
        backgroundColor: '#4032a3', // Un color similar pero diferente al fondo
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 5, // Espacio entre el título y el botón
    },
    textBtnGrafico: {
        color: '#FFF',
        fontFamily: 'Lato-Regular',
        fontSize: 16,
    }
})
 
export default Header;