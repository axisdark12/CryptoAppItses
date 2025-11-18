import React from 'react'
import { StyleSheet, Image, View, ScrollView} from 'react-native';
import Header from '../components/Header';
import Formulario from '../components/Formulario';
import { useCrypto } from '../components/Logic/CryptoHook';

export default function HomeScreen() {
    const {
        moneda,
        criptomoneda,
        guardarMoneda,
        guardarCriptomoneda,
        guardarConsultarAPI,
        setAlerta,
        setCriptomonedasList,
        setMostrarGrafico } = useCrypto();
    const handleOpenChart = () => setMostrarGrafico(true);

    return (
        <ScrollView style={styles.contenedor}>
            <Header onOpenChart={handleOpenChart} />

            <Image
                style={styles.imagen}
                source={require('../../assets/img/cryptomonedas.png')}
            />

            <View>
                <Formulario
                    moneda={moneda}
                    criptomoneda={criptomoneda}
                    guardarMoneda={guardarMoneda}
                    guardarCriptomoneda={guardarCriptomoneda}
                    guardarConsultarAPI={guardarConsultarAPI}
                    guardarAlerta={setAlerta}
                    setCriptomonedasList={setCriptomonedasList} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: '#4d4c4cff'
    },
    imagen: {
        width: "100%",
        height: 130,
        marginHorizontal: '2.5%',

    }
});