import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import { horizontalScale, scaleFontSize, verticalScale } from '../../../assets/styles/scaling';

const RememberMe = ({handleRememberMeChange,rememberMe}) => {
    // console.log(rememberMe)
  return (
    <View style={styles.container}>
      <CheckBox
        title="Remember Me"
        value={rememberMe}
        tintColors={"#9e9e9e"}
        onChange={handleRememberMeChange}
      />
      <Pressable onPress={handleRememberMeChange}><Text style={styles.Text}>Remember Me</Text></Pressable> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:"row",
    marginTop:verticalScale(20),
    gap:horizontalScale(10)
  },
  Text:{
    color:"#9e9e9e",
    fontSize:scaleFontSize(15)

  }
});

export default RememberMe;
