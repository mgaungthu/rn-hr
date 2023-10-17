import {StyleSheet} from "react-native";
import { horizontalScale, scaleFontSize, verticalScale } from '../../assets/styles/scaling';


export default styles = StyleSheet.create({
  TopContainer: {
      flexDirection: 'row',
      margin: verticalScale(10),
      gap: horizontalScale(10),
      justifyContent: 'space-between',
    },
    avatorBox: {
      flexDirection: 'row',
       gap: horizontalScale(15)
    },
    secWrapper: {
      marginHorizontal: horizontalScale(30),
      height: 100,
    },
    avator: {
      width: 100,
      height: 100,
    },
    boxShadow: {
      height: 100,
      width: 100,
      // shadowColor: '#000000',
      // shadowOffset: {width: -2, height: 4},
      // shadowOpacity: 0.2,
      // shadowRadius: 3,
      backgroundColor: '#ffffff',
      borderRadius: horizontalScale(100),
      paddingTop: verticalScale(5),
      elevation: 40,
      overflow: 'hidden',
    },
    clockWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: horizontalScale(35),
      marginTop: verticalScale(35),
    },
    clockText: {
      fontSize: scaleFontSize(18),
      color: '#fff',
      marginTop: 10,
      color: '#fda1ba',
      paddingBottom: verticalScale(5),
      borderBottomWidth: 2,
      borderBottomColor: '#fda1ba',
    },
    boxWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: horizontalScale(15),
      marginTop: verticalScale(40),
    },
    box: {
      backgroundColor: '#fff',
      width: '47%',
      alignItems: 'center',
      padding: horizontalScale(18),
      borderRadius: 10,
      elevation: 10,
    },
    boxImg: {
      width: 50,
      height: 50,
      marginBottom: verticalScale(10),
    },
  });


  