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
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: horizontalScale(10),
    },
    title: {
      color: '#000',
      fontSize: scaleFontSize(20),
      fontWeight: '500',
    },
    icon: {
      color: '#206aed',
      marginTop: verticalScale(2),
    },
    dateBtn: {
      width: horizontalScale(100),
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
    },
    dropdown: {
      height: verticalScale(50),
      borderBottomColor: 'gray',
      borderBottomWidth: verticalScale(0.5),
    },
    placeholderStyle: {
      fontSize: scaleFontSize(16),
      color: '#000',
    },
    selectedTextStyle: {
      fontSize: scaleFontSize(16),
      color: '#000',
    },
    checkBoxWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: verticalScale(15),
    },
    checkboxContainer: {
      flexDirection: 'row',
      marginBottom: verticalScale(10),
      width: '50%',
    },
    checkbox: {
      alignSelf: 'center',
    },
    label: {
      color: '#000',
      margin: horizontalScale(8),
    },
    input: {
      color: '#000',
      borderBottomWidth: verticalScale(1),
      borderBottomColor: '#9e9e9e',
      fontSize: scaleFontSize(16),
      marginTop: verticalScale(8),
    },
    btnWrapper:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginTop:verticalScale(25),
        alignItems:"center",
    },
    btnBox2:{
        flexDirection:"row",
        gap:10
    },
    btn: {
        backgroundColor:"red",
        borderRadius:5,
        alignItems:"center",
        justifyContent:"center"
    },
    btnText:{
        color:"#fff",
        paddingVertical:verticalScale(10), 
        paddingHorizontal:horizontalScale(20),  
    }
  });

  export default styles;