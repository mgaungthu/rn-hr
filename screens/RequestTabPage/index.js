import React from 'react'
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native'
import { RequestTabNavigation } from '../../navigation/MainNavigation'

const RequestTabPage = ({navigation}) => {
  return (
    <>
    <RequestTabNavigation/>
    
    <TouchableOpacity onPress={() => navigation.navigate('attendanceRequest')} style={styles.TouchableOpacityStyle}>
      <Text style={{color:"#000"}}>
          Hello
      </Text>
    </TouchableOpacity>
    </>
  )
}

export default RequestTabPage

const styles = StyleSheet.create({
  TouchableOpacityStyle: {
    //Here is the trick
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
},
});