import React from 'react';
import {SafeAreaView, FlatList, View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../assets/styles/scaling';
import {convertDateFormat2, getDayName} from '../../assets/utils';

const AttendanceList = () => {
  const {AttendanceList} = useSelector(state => state.checkinout);
  let sortedOfficeShift


  if(AttendanceList?.length === 0) {
    return (
      <SafeAreaView style={{flex:1,justifyContent:'center',alignItems:'center'}}>
         <Text style={styles.title}>Please load data at home</Text>
      </SafeAreaView>
    )
  }

  if (AttendanceList) {
    // Create a new array before sorting to avoid modifying the original array
     sortedOfficeShift = [...AttendanceList].sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  
    // Now you can use sortedOfficeShift as the sorted array
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sortedOfficeShift}
        renderItem={({item}) => (
          <Item
            key={item.id}
            checkInTime={item.check_in_time}
            checkOutTime={item.check_out_time}
            date={item.date}
            timeInStatus={item.time_in_status}
            keyExtractor={item => item.id}
          />
        )}
      />
    </SafeAreaView>
  );
};




const Item = ({checkInTime, checkOutTime, date, timeInStatus}) => (
  <View style={styles.item}>
    
    <View style={[styles.rowWrapper,{backgroundColor: timeInStatus ? '#F6F1F1' : "#fff"}]}>
      <View>
        <View style={styles.leftBox}>
          <View style={[styles.statusCircle, {backgroundColor: timeInStatus ? '#A73121' : "#8EAC50"}]} />

          <View>
            <Text style={styles.title}>{getDayName(date)}</Text>
          </View>
        </View>
        <View>
          <Text style={[styles.title,{color:"#016A70"}]}> {convertDateFormat2(date)}</Text>
        </View>
      </View>

      <View style={styles.rightBox}>
        <Text style={[styles.title,{color:"#793FDF"}]}>Check in / Out</Text>
        <Text
          style={[
            styles.title,
            {fontSize: scaleFontSize(12), color: '#016A70'},
          ]}>{`${checkInTime || ''} - ${checkOutTime || ''}`}</Text>
      </View>
    </View>
  </View>
);

export default AttendanceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#fff',
  },
  title: {
    fontSize: scaleFontSize(16),
    color: '#D2DE32',
  },
  dateText: {
    fontSize: scaleFontSize(12),
    color: '#8bc34a',
  },
  statusCircle: {
    width: 15,
    height: 15,
    borderRadius: 100,
    marginRight: verticalScale(8),
  },
  circleText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '900',
  },
  rowWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: horizontalScale(12),
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
