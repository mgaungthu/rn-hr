import React, { useState, useEffect} from 'react';
import {View, Text,StyleSheet, Pressable, PermissionsAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import {faPaperclip, faCamera} from '@fortawesome/free-solid-svg-icons';
import { scaleFontSize } from '../../../../assets/styles/scaling';

const Attachment = ({setAttachment,attachment}) => {

  const  [imgName,setImgName]  = useState(attachment)

  useEffect(() => {
    setImgName(attachment)
  }, [attachment])
  

  const options = {
    saveToPhotos: false,
    mediaType: 'Photo',
    maxHeight: 800,
    maxWidth: 600,
  };

    const handleAttachmentPress = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            launchImageLibrary(options, response => {
              // console.log('Response = ', response);
              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else {
                // console.log(response.assets[0])
                setAttachment(response.assets[0])
              }
            });
          }   
    }
    
      const handleCameraPress = async () => {
        // Implement logic for camera press
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            launchCamera(options, response => {
              // console.log('Response = ', response);
              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else {
                // console.log(response.assets[0])
                setAttachment(response.assets[0])
              }
            });
          }   
      };

      function truncateImageName(imageName, charactersToKeep) {
        // console.log(imageName)
        // Check if the original name is shorter than or equal to the specified limit
        if (imageName.length <= charactersToKeep) {
          return imageName;
        }
      
        // Keep the first n characters
        const truncatedName = imageName.substring(0, charactersToKeep);
      
        // Extract the file extension
        const fileExtension = imageName.substring(imageName.lastIndexOf('.'));
      
        // Append the file extension to the truncated name
        return `${truncatedName}${fileExtension}`;
      }
      

      

  return (
    <View style={styles.iconContainer}>
        <View>
            {attachment?.fileName || imgName ? (
                <Text style={styles.imgName}>{truncateImageName(attachment?.fileName || imgName,19)}</Text>
            ) : ( <Text style={styles.imgName}>Please Select attachment</Text>)}
        </View>
       <View style={styles.btnContainer}>
        <Pressable onPress={handleAttachmentPress} style={styles.iconWrapper}>
            <FontAwesomeIcon icon={faPaperclip} size={24} color="#fff" />
        </Pressable>

        <Pressable onPress={handleCameraPress} style={styles.iconWrapper}>
            <FontAwesomeIcon icon={faCamera} size={24} color="#fff" />
        </Pressable>
       </View>
     
    </View>
  );
};

export default Attachment;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:"center",
    gap: 15,
    marginTop: 15,
  },
  btnContainer:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap:15
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#26a69a',
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 10,
  },
  imgName:{
    fontSize:scaleFontSize(16),
    color:"#000",
    textAlign:"center"
  }
});
