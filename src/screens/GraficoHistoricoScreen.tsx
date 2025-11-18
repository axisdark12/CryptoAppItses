import React from 'react'
import GraficoHistorico from '../components/GraficoHistorico';
import { useCrypto } from '../components/Logic/CryptoHook';

export default function GraficoHistoricoScreen() {
    const { criptomonedasList, mostrarGrafico, setMostrarGrafico } = useCrypto();
    const handleCloseChart = () => setMostrarGrafico(false);

    return (
        <>
            <GraficoHistorico
                isVisible={mostrarGrafico}
                onClose={handleCloseChart}
                criptomonedas={criptomonedasList}
            />
        </>
    )
}
