import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  verticalScale,
  scaleFontSize,
  horizontalScale,
} from '../../../assets/styles/scaling';


const Datebox = ({CheckIn, CheckOut, reload}) => {

  // console.log(CheckIn)
  

  return (
    <View style={styles.clockWrapper}>
      <View>
        <Text style={{fontSize: scaleFontSize(20), color: '#fff'}}>
          Check In
        </Text>
        <Text style={styles.clockText}>{CheckIn.time}</Text>
      </View>
      <View>
        <Text style={{fontSize: scaleFontSize(20), color: '#fff'}}>
          Check Out
        </Text>
        <Text style={styles.clockText}>{CheckOut.time}</Text>
      </View>
    </View>
  );
};

export default Datebox;

const styles = StyleSheet.create({
  clockWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: horizontalScale(35),
  },
  clockText: {
    fontSize: scaleFontSize(18),
    color: '#fff',
    marginTop: 10,
    color: '#fda1ba',
    paddingBottom: verticalScale(5),
    borderBottomWidth: 2,
    borderBottomColor: '#fda1ba',
  },
});
