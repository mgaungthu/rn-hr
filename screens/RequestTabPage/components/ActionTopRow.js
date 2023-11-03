import React from 'react'
import { View, Text , Pressable, TouchableOpacity, StyleSheet} from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faXmark, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {
    horizontalScale,
    verticalScale,
    scaleFontSize
  } from '../../../assets/styles/scaling';

const ActionTopRow = ({handleFormSubmit,navigation,title}) => {
  return (
    <View style={styles.topRow}>

          <View style={styles.titleBox}>
            <Pressable onPress={() => navigation.goBack()}>
              <FontAwesomeIcon
                icon={faXmark}
                size={23}
                style={styles.icon}
              />
            </Pressable>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View>
            <TouchableOpacity onPress={handleFormSubmit}>
              <FontAwesomeIcon
                icon={faPaperPlane}
                size={25}
                style={[styles.icon]}
              />
            </TouchableOpacity>
          </View>
        </View>
  )
}

export default ActionTopRow


const styles = StyleSheet.create({
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
});