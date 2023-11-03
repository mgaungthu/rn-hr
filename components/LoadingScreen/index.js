// LoadingIndicator.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.font}>Loading..!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    zIndex:1000,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  font:{
    color:"#fff",
    marginTop:10
  }
});

export default LoadingScreen;
