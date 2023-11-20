import React from 'react';
import {StyleSheet, Text, TouchableOpacity,ActivityIndicator} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
} from '../../../assets/styles/scaling';

const Button = ({onPress,loading}) => {
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      activeOpacity={0.7}
      onPress={() => onPress()}>
      <Text style={styles.btnText}> Sign IN </Text>
     {loading && <ActivityIndicator size={15}/>} 
    </TouchableOpacity>
  );
};

export default Button;


const styles = StyleSheet.create({
    buttonContainer: {
      backgroundColor: '#206aed',
      width: 120,
      height: 50,
      flexDirection:"row",
      alignItems:"center",
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
  