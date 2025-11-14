import React, { useState } from 'react';
import { Modal, TouchableOpacity, View, StyleSheet } from 'react-native';
// @ts-ignore: no declaration file for react-native-vector-icons/MaterialCommunityIcons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GraficoBitcoin from './GraficoBitcoin';

const BotonGrafica = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.boton}
        onPress={() => setModalVisible(true)}
      >
        {/* Ícono de gráfico ascendente */}
        <Icon name="chart-line" size={28} color="#FFF" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <GraficoBitcoin cerrarModal={() => setModalVisible(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 10,
  },
  boton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5E49E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
});

export default BotonGrafica;
