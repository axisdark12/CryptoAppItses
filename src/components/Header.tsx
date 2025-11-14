import React from 'react';
import { Text, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';

const Header = () => (
    <Text style={styles.encabezados}>Criptomonedas</Text>
);

const styles = StyleSheet.create({
    encabezados: {
        paddingTop: Platform.OS === 'ios' ? 60 : 10, 
        fontFamily: 'Lato-Black',
        backgroundColor: '#2d2660ff',
        paddingBottom: 10,
        marginBottom: 30,
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
        backgroundColor: '#4032a3', 
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 5, 
    },
    textBtnGrafico: {
        color: '#FFF',
        fontFamily: 'Lato-Regular',
        fontSize: 16,
    }
})

export default Header;