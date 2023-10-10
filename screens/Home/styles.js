import {StyleSheet} from "react-native";


export default styles = StyleSheet.create({
  TopContainer: {
      flexDirection: 'row',
      marginTop: 10,
      margin: 10,
      gap: 10,
      justifyContent: 'space-between',
    },
    avatorBox: {
      flexDirection: 'row',
       gap: 15
    },
    secWrapper: {
      marginHorizontal: 40,
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
      borderRadius: 100,
      paddingTop: 5,
      elevation: 40,
      overflow: 'hidden',
    },
    clockWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 35,
      marginTop: 35,
    },
    clockText: {
      fontSize: 18,
      color: '#fff',
      marginTop: 10,
      color: '#fda1ba',
      paddingBottom: 5,
      borderBottomWidth: 2,
      borderBottomColor: '#fda1ba',
    },
    boxWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 18,
      marginTop: 50,
    },
    box: {
      backgroundColor: '#fff',
      width: '47%',
      alignItems: 'center',
      padding: 18,
      borderRadius: 10,
      elevation: 10,
    },
    boxImg: {
      width: 50,
      height: 50,
      marginBottom: 10,
    },
  });


  