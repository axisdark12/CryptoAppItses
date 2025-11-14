import React from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import type { CardProps } from '../Types/CryptoStats';

export default function Estadisticas({ stats, history }: CardProps) {
    const { imageUrl, price, changePct24h, changePctDay, changePctHour, high24h,
        low24h, volume24h, marketCap, supply, circulatingSupply, } = stats;

    const formatearNumero = (valor: number, decimales = 2) =>
        valor?.toLocaleString("es-MX", {
            minimumFractionDigits: decimales,
            maximumFractionDigits: decimales,
        });

    const colorCambio = (valor: number) => (valor >= 0 ? "#4CAF50" : "#F44336");

    const getChangePct = (dias: number) => {
        if (!history || history.length < dias) return 0;
        const precioPasado = history[history.length - dias]?.close;
        const cambio = ((price - precioPasado) / precioPasado) * 100;
        return cambio;
    };

    const cambio7d = getChangePct(7);
    const cambio30d = getChangePct(30);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titulo}> Estadisticas de Mercado</Text>
            <View style={styles.header}>
                <Image source={{ uri: imageUrl }} style={styles.icono} />
                <View>
                    <Text style={styles.precio}>${formatearNumero(price)}</Text>
                    <Text style={styles.subtitulo}>Precio actual</Text>
                </View>
            </View>

            <View style={styles.seccion}>
                <Text style={styles.seccionTitulo}>Rango y volumen (24h)</Text>
                <View style={styles.grid}>
                    <Text style={styles.texto}>Máx: ${formatearNumero(high24h)}</Text>
                    <Text style={styles.texto}>Mín: ${formatearNumero(low24h)}</Text>
                    <Text style={styles.texto}>Volumen: {formatearNumero(volume24h)}</Text>
                </View>
            </View>

            <View style={styles.divisor} />

            <View style={styles.seccion}>
                <Text style={styles.seccionTitulo}>Capitalización y oferta</Text>
                <Text style={styles.texto}>Market Cap: ${formatearNumero(marketCap)}</Text>
                <Text style={styles.texto}>Supply total: {formatearNumero(supply)}</Text>
                <Text style={styles.texto}>Circulante: {formatearNumero(circulatingSupply)}</Text>
            </View>

            <View style={styles.divisor} />

            <View style={styles.seccion}>
                <Text style={styles.seccionTitulo}>Cambio porcentual</Text>
                <View style={styles.grid}>
                    <Text style={[styles.texto, { color: colorCambio(changePctHour) }]}>Hora: {formatearNumero(changePctHour)}%</Text>
                    <Text style={[styles.texto, { color: colorCambio(changePctDay) }]}>Día: {formatearNumero(changePctDay)}%</Text>
                    <Text style={[styles.texto, { color: colorCambio(changePct24h) }]}>24h: {formatearNumero(changePct24h)}%</Text>
                    <Text style={[styles.texto, { color: colorCambio(cambio7d) }]}>7 días: {formatearNumero(cambio7d)}%</Text>
                    <Text style={[styles.texto, { color: colorCambio(cambio30d) }]}>30 días: {formatearNumero(cambio30d)}%</Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1E1E1E",
        borderRadius: 16,
        marginHorizontal: 16,
        padding: 16,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    titulo: {
        color: "#D1C4E9",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        gap: 8,
    },
    icono: {
        width: 50,
        height: 50,
        marginRight: 8,
    },
    precio: {
        color: "#A29BFE",
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitulo: {
        color: "#9E9E9E",
        fontSize: 13,
        textAlign: "center",
        fontStyle: "italic",
    },
    seccion: {
        marginTop: 8,
        marginBottom: 10,
    },
    seccionTitulo: {
        color: "#B388FF",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
    },
    texto: {
        color: "#EAEAEA",
        fontSize: 15,
        marginVertical: 2,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 8,
    },
    divisor: {
        borderBottomColor: "#444",
        borderBottomWidth: 1,
        marginVertical: 12,
    }
});