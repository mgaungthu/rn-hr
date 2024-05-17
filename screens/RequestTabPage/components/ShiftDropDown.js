import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {View, Text, StyleSheet} from 'react-native';
import {verticalScale, scaleFontSize} from '../../../assets/styles/scaling';

const ShiftDropDown = ({
  setSelectedOfficeShift,
  selectedOfficeShift,
  data,
  labelText,
}) => {
  return (
    <View>
      <Text style={styles.labelText}>Office Shift</Text>
      <Dropdown
        mode="modal"
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={{color: '#000', fontSize: scaleFontSize(14)}}
        containerStyle={{
          width: 280,
        }}
        activeColor={'#ccc'}
        data={data}
        maxHeight={verticalScale(300)}
        labelField="label"
        valueField="value"
        placeholder={data[selectedOfficeShift - 1]?.label || labelText}
        searchPlaceholder="Search..."
        value={selectedOfficeShift}
        onChange={item => {
          setSelectedOfficeShift(item.value);
        }}
      />
    </View>
  );
};

export default ShiftDropDown;

const styles = StyleSheet.create({
  labelText: {
    color: '#9e9e9e',
    fontSize: scaleFontSize(16),
    marginTop: verticalScale(13),
  },
  dropdown: {
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: scaleFontSize(14),
    color: '#000',
  },
  selectedTextStyle: {
    fontSize: scaleFontSize(14),
    color: '#000',
  },
});
