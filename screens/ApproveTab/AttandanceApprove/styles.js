import { StyleSheet } from "react-native";
import {
    horizontalScale,
    scaleFontSize,
    verticalScale,
  } from '../../../assets/styles/scaling';

const styles = StyleSheet.create({
    scrollViewContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      padding: horizontalScale(18),
      borderTopColor: '#206aed',
      borderTopWidth: verticalScale(10),
      backgroundColor: '#fff',
    },
    dateBtn: {
      width: 100,
      backgroundColor: '#eff4f2',
      paddingVertical: verticalScale(25),
      borderColor: '#b7bcc5',
      borderWidth: verticalScale(1),
      borderRadius: horizontalScale(8),
      marginTop: verticalScale(10),
    },
    dateText: {
      color: '#000',
      textAlign: 'center',
      fontSize: scaleFontSize(18),
    },
    labelText: {
      color: '#9e9e9e',
      fontSize: scaleFontSize(16),
      marginTop: verticalScale(13),
    }
  });

  export default styles;