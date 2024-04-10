import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import { scaleFontSize, verticalScale, horizontalScale } from '../../../assets/styles/scaling';

const TypeCheckBox = ({checkBoxData,handleCheckboxChange,checkedItem,title}) => {
  return (
    <View>
    <Text style={styles.labelText}>{title}</Text>
    <View style={styles.checkBoxWrapper}>
            {checkBoxData.map((item, index) => (
              <View key={item.id} style={styles.checkboxContainer}>
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleCheckboxChange(item.id)}
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  activeOpacity={0.7}>
                  <CheckBox
                    tintColors="#5a5a5a"
                    onFillColor="#5a5a5a"
                    boxType="square"
                    value={item.id === checkedItem}
                    onValueChange={() => handleCheckboxChange(item.id)}
                  />
                  <Text style={styles.label}>{item.Label}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
    </View>
  )
}

export default TypeCheckBox


const styles = StyleSheet.create({
  labelText: {
    color: '#9e9e9e',
    fontSize: scaleFontSize(16),
    marginTop: verticalScale(13),
  },
  checkBoxWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: verticalScale(15),
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(5),
    width: '50%',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    color: '#000',
    margin: horizontalScale(8),
  },
});