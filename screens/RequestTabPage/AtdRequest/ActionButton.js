import React from 'react'
import {View,TouchableOpacity, Alert} from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import styles from './style'
import {
    horizontalScale,
    verticalScale,
  } from '../../../assets/styles/scaling';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const ActionButton = ({user_info,editParams}) => {

    const showConfirmDialog = () => {
        return Alert.alert(
          "Are your sure?",
          "Are you sure you want to remove this beautiful box?",
          [
            // The "Yes" button
            {
              text: "Yes",
              onPress: () => {
                console.log("ok")
              },
            },
            // The "No" button
            // Does nothing but dismiss the dialog when tapped
            {
              text: "No",
            },
          ]
        );
      };


  return (
    <>
    {user_info.approved_person === 1 && editParams.isEdit == true ? (
            
        <View  style={styles.btnWrapper}>
          <View>
            <TouchableOpacity style={[styles.btn,{width:50,height:50,borderRadius:100}]}>
              <FontAwesomeIcon icon={faTrashCan} style={styles.btnText}/>
            </TouchableOpacity>
          </View>
          <View style={styles.btnBox2}>
          <TouchableOpacity style={[styles.btn,{backgroundColor:"#a7e34d"}]}>
            <Text style={styles.btnText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn,{backgroundColor:"#206aed"}]}>
            <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      ) : (editParams.isEdit == true &&
        
        <View  style={styles.btnWrapper}>
          <View>
            <TouchableOpacity onPress={() => showConfirmDialog()} style={[styles.btn,{paddingVertical:verticalScale(10),borderRadius:100}]}>
              <FontAwesomeIcon icon={faTrashCan} style={styles.btnText}/>
            </TouchableOpacity>
          </View>
        </View>
        
      ) }
      </>
  )
}

export default ActionButton