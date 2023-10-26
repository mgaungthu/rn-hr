import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import LottieView from 'lottie-react-native';
import { horizontalScale, scaleFontSize, verticalScale } from '../../assets/styles/scaling';

const CustomModal = ({title, jsonPath, isVisible}) => {


  return (
    <View style={styles.modalContainer}>
      <Modal animationType="fade" transparent={true} visible={isVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.animationContainer}>
              <LottieView source={jsonPath} style={{width:45,height:45}} loop={false} autoPlay />
            </View>
            <Text style={styles.textStyle}>{title}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  modalView: {
    flexDirection: 'row',
    alignItems:"center",
    justifyContent:'flex-start',
    top: verticalScale(100),
    width: '85%',
    height: 50,
    backgroundColor: 'black',
    borderRadius: 8,
  },
  animationContainer:{
   paddingLeft: horizontalScale(10)
  },    
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: scaleFontSize(16),
    marginLeft: horizontalScale(20),
  },
});

export default CustomModal;
