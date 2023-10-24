import React, {useEffect, useState} from 'react';
import {FlatList, View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {callAttendanceRequestList as callatdReq} from '../../../api';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../assets/styles/scaling';

const AtdRequest = () => {
  const {access_token} = useSelector(state => state.user);
  const [atData, setAtData] = useState([]);

  useEffect(() => {
    callAttendanceRequestList();
  },[]);

  const callAttendanceRequestList = async () => {
    const response = await callatdReq(access_token);
    setAtData(response.data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={atData}
        renderItem={({item}) => (
          <Item title={item.title} status={item.status} date={item.date} />
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const Item = ({title, status, date}) => (
  <View style={styles.item}>
    <View style={styles.rowWrapper}>
      <View
        style={[
          styles.statusCircle,
          {backgroundColor: status === 1 ? '#43A047' : "#a7e34d"},
        ]}>
        <Text style={styles.circleText}>{status === 1 ? 'A' : 'P'}</Text>
      </View>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </View>
  </View>
);

export default AtdRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#fff',
    padding: horizontalScale(12),
  },
  title: {
    fontSize: scaleFontSize(16),
    color: '#206aed',
  },
  dateText: {
    color: '#8bc34a',
  },
  statusCircle: {
    justifyContent: 'center',
    padding: horizontalScale(10),
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: verticalScale(13),
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
    justifyContent: 'flex-start',
  },
});
