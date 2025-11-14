import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ResultadoSimulacion {
  montoInvertido: number;
  precioCompra: number;
  precioActual: number;
  criptoComprada: number;
  valorActual: number;
  ganancia: number;
  roi: number;
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

const ResultadoSimulador = ({ resultado }: { resultado: ResultadoSimulacion | null }) => {
  if (!resultado || Object.keys(resultado).length === 0) {
    return null;
  }

  const {
    montoInvertido,
    valorActual,
    ganancia,
    roi,
  } = resultado;


  const esGanancia = ganancia >= 0;

  return (

    <View style={[styles.card, esGanancia ? styles.borderGanancia : styles.borderPerdida]}>
      
      <Text style={styles.titulo}>Resultado de la simulacion</Text>
      <Text style={styles.textoBase}>Invertiste:</Text>
      <Text style={styles.valorInvertido}>{formatCurrency(montoInvertido)}</Text>
      
      <Text style={styles.textoBase}>Hoy tendrias:</Text>
      <Text style={styles.valorActual}>{formatCurrency(valorActual)}</Text>
      <View style={[styles.kpiBox, esGanancia ? styles.bgGanancia : styles.bgPerdida]}>
        <Text style={styles.kpiLabel}>Ganancia o Perdida</Text>
        <Text style={styles.kpiValor}>{formatCurrency(ganancia)}</Text>
        <Text style={styles.kpiROI}>({roi.toFixed(2)}%)</Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 25, 
    marginTop: 20,
    marginHorizontal: 2,
    borderLeftWidth: 10, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },

  borderGanancia: {
    borderColor: '#28a745', 
  },
  borderPerdida: {
    borderColor: '#dc3545', 
  },
  titulo: {
    fontFamily: 'Lato-Black',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333', 
  },
  textoBase: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    color: '#666', 
    textAlign: 'center',
    marginTop: 10,
  },
  valorInvertido: {
    fontFamily: 'Lato-Regular',
    fontSize: 28,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  valorActual: {
    fontFamily: 'Lato-Black',
    fontSize: 40, 
    color: '#000',
    textAlign: 'center',
    marginBottom: 25,
  },
  kpiBox: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  bgGanancia: {
    backgroundColor: '#E9F9EE', 
    borderColor: 'rgba(40, 167, 69, 0.3)', 
    borderWidth: 1,
  },
  bgPerdida: {
    backgroundColor: '#FDEEED', 
    borderColor: 'rgba(220, 53, 69, 0.3)', 
    borderWidth: 1,
  },
  kpiLabel: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    color: '#444',
  },
  kpiValor: {
    fontFamily: 'Lato-Black',
    fontSize: 32,
    color: '#000',
    marginTop: 5,
  },
  kpiROI: {
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    color: '#333',
    marginTop: 5,
  }
});

export default ResultadoSimulador;