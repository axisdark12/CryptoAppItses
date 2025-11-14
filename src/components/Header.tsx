import React from 'react';
import { Text, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';

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
        paddingTop: Platform.OS === 'ios' ? 50 : 10,
        backgroundColor: '#5E49E2',
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