import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
} from '../../../assets/styles/scaling';

const Button = ({onPress}) => {
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      activeOpacity={0.7}
      onPress={() => onPress()}>
      <Text style={styles.btnText}> Sign IN </Text>
    </TouchableOpacity>
  );
};

export default Button;


const styles = StyleSheet.create({
    buttonContainer: {
      backgroundColor: '#206aed',
      width: 120,
      height: 50,
      justifyContent: 'center',
      elevation: 3,
      borderRadius: horizontalScale(3),
    },
    btnText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: scaleFontSize(16),
      textTransform: 'uppercase',
    },
  });
  