import React, { useState } from 'react';
import { View, Text, Button , TouchableOpacity, StyleSheet} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { data, month } from '../../../../assets/utils';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../../assets/styles/scaling';

const DateRangePicker = ({handleStartDateChange,handleEndDateChange,showStartDatePicker,showStartDatePickerModal,showEndDatePickerModal,showEndDatePicker,startDate,endDate,totalDays}) => {
  

  const formatDate = (date) => {
    if (date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are zero-based
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } else {
      return 'Not selected';
    }
  };

  return (
    <View style={styles.dateBtnWrapper}>
      <View>
      
        {/* <Button title={formatDate(startDate)} onPress={showStartDatePickerModal} /> */}
        
        <View>
          <Text style={styles.labelText}>Start Date</Text>
          <TouchableOpacity onPress={showStartDatePickerModal} style={styles.dateBtn}>
            <Text style={styles.dateText}>{month[startDate.getMonth()]}</Text>
            <Text style={[styles.dateText, {fontWeight: '600'}]}>
              {startDate.getDate()}
            </Text>
          </TouchableOpacity>
        </View>

        {showStartDatePicker && (
          <RNDateTimePicker
            value={startDate || new Date()}
            mode="date"
            onChange={handleStartDateChange}
          />
        )}
      </View>

      <View>
       
        {/* <Button
          title={formatDate(endDate)}
          onPress={showEndDatePickerModal}
          disabled={!startDate}
        /> */}
         <View>
         <Text style={styles.labelText}>End Date</Text>
          <TouchableOpacity onPress={showEndDatePickerModal} style={styles.dateBtn}>
            <Text style={styles.dateText}>{month[endDate.getMonth()]}</Text>
            <Text style={[styles.dateText, {fontWeight: '600'}]}>
              {endDate.getDate()}
            </Text>
          </TouchableOpacity>
        </View>

        {showEndDatePicker && (
          <RNDateTimePicker
            value={endDate || new Date()}
            mode="date"
            minimumDate={startDate || new Date()}
            onChange={handleEndDateChange}
          />
        )}
      </View>

      <View>
      <Text style={styles.labelText}>Total Days</Text>
      <View style={[styles.dateBtn,{backgroundColor:"#daa7a7"}]}>
        <Text style={[styles.dateText, {fontWeight: '600',color:"white",fontSize:scaleFontSize(25)}]}>{totalDays}</Text>

        </View>
        </View>
    </View>
  );
};



export default DateRangePicker;

const styles = StyleSheet.create({
  dateBtnWrapper:{
    flexDirection:"row",
    justifyContent:"flex-start",
    gap:horizontalScale(20)
  },
  dateBtn: {
    width: 90,
    height:70,
    backgroundColor: '#eff4f2',
    paddingVertical: verticalScale(10),
    borderColor: '#b7bcc5',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: verticalScale(10),
    alignItems:"center",
    justifyContent:"center"
  },
  dateText: {
    color: '#000',
    textAlign: 'center',
    fontSize: scaleFontSize(16),
  },
  labelText: {
    color: '#9e9e9e',
    fontSize: scaleFontSize(14),
    marginTop: verticalScale(13),
  }
});
