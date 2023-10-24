import React from 'react'
import {TouchableOpacity, StyleSheet} from 'react-native'
import { RequestTabNavigation } from '../../navigation/MainNavigation'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

const RequestTabPage = ({navigation}) => {
  return (
    <>
    <RequestTabNavigation/>
    
    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('attendanceRequest')} style={styles.TouchableOpacityStyle}>
        <FontAwesomeIcon size={20} icon={faAdd} style={styles.font} />
    </TouchableOpacity>
    </>
  )
}

export default RequestTabPage

const styles = StyleSheet.create({
  TouchableOpacityStyle: {
    //Here is the trick
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor:"red",
    borderRadius:100,
    elevation:1
},
font:{
  color:"#fff"
}
});