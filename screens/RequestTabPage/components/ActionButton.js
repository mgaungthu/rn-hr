import React from 'react'
import {View,TouchableOpacity, StyleSheet, Text} from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    horizontalScale,
    verticalScale,
    scaleFontSize
  } from '../../../assets/styles/scaling';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const ActionButton = ({user_info,editParams,showConfirmDialog}) => {



  return (
    <>
    {user_info.approved_person === 1 && editParams.isEdit == true ? (
            
        <View  style={styles.btnWrapper}>
          <View>
            <TouchableOpacity  onPress={() => showConfirmDialog('delete')} style={[styles.btn,{width:50,height:50,borderRadius:100}]}>
              <FontAwesomeIcon icon={faTrashCan} style={styles.btnText}/>
            </TouchableOpacity>
          </View>
          <View style={styles.btnBox2}>
          {/* <TouchableOpacity style={[styles.btn,{backgroundColor:"#a7e34d"}]}>
            <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => showConfirmDialog('approve')} style={[styles.btn,{backgroundColor:"#206aed"}]}>
            <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      ) : (editParams.isEdit == true &&
        
        <View  style={styles.btnWrapper}>
          <View>
            <TouchableOpacity onPress={() => showConfirmDialog('delete')} style={[styles.btn,{paddingVertical:verticalScale(10),borderRadius:100}]}>
              <FontAwesomeIcon icon={faTrashCan} style={styles.btnText}/>
            </TouchableOpacity>
          </View>
        </View>
        
      ) }
      </>
  )
}

export default ActionButton


const styles = StyleSheet.create({
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