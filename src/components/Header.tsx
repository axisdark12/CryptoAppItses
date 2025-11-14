import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';

const Header = () => (
    <Text style={styles.encabezado}>Criptomonedas</Text>
);

const styles = StyleSheet.create({
    encabezado: {
        paddingTop: Platform.OS === 'ios' ? 60 : 10, 
        fontFamily: 'Lato-Black',
        backgroundColor: '#2d2660ff',
        paddingBottom: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
        fontSize: 20,
        color: '#FFF',
        marginBottom: 30
    }
})

export default Header;