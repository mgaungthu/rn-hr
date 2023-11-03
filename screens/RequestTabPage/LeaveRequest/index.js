import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigationState} from '@react-navigation/native';
import {callLeaveHistoryListApi} from '../../../api';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../assets/styles/scaling';
import CustomModal from '../../../components/CustomModel';
import LoadingScreen from '../../../components/LoadingScreen';
import FloatActionBtn from '../components/FloatActionBtn';

const LeaveRequest = ({route, navigation, navigation: {setParams}, state}) => {
  const [atData, setAtData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const {access_token} = useSelector(state => state.user);

  const navigationState = useNavigationState(state => state);

  const activeTabRoute = navigationState.routes[navigationState.index];

  const activeTabName = activeTabRoute ? activeTabRoute.name : null;

  useEffect(() => {
    setLoading(true);
    callLeaveHistoryList();
    if (route.params?.showModal) {
      setMessage(route.params?.message);
      setParams({showModal: false});
      toggleModal();
    }

    return () => {
      callLeaveHistoryList();
      toggleModal();
    };
  }, [route.params?.showModal]);

  const toggleModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 3000);
  };

  const callLeaveHistoryList = () => {
    callLeaveHistoryListApi(access_token)
      .then(response => {
        setAtData(response.data);
      })
      .catch(() => alert('Internet Connection Error'))
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomModal
        title={message}
        isVisible={isModalVisible}
        jsonPath={require('../../../assets/animations/success-checkmark.json')}
      />
      <FlatList
        data={atData}
        renderItem={({item}) => (
          <Item
            title={item.leave_name}
            from_date={item.from_date}
            to_date={item.to_date}
            id={item.id}
            leave_id={item.leave_id}
            totalDay={item.total_day}
            leave_type_name={item.leave_type_name}
            navigation={navigation}
            statusbyManager={item.statusby_manager}
          />
        )}
        keyExtractor={item => item.id}
      />
      {loading && <LoadingScreen />}

      <FloatActionBtn activeTabName={activeTabName} navigation={navigation} />
    </SafeAreaView>
  );
};

const Item = ({title, status, from_date,to_date,totalDay,leave_type_name,id,leave_id, navigation, statusbyManager}) => (
  <View style={styles.item}>
    <TouchableOpacity
      disabled={statusbyManager == 0 || null ? false : true}
      onPress={() =>
        navigation.navigate('leaveRequestForm', {leave_id:leave_id,id: id, isEdit: true})
      }>
      <View style={styles.rowWrapper}>
        <View style={styles.leftBox}>
          <View
            style={[
              styles.statusCircle,
              {backgroundColor: statusbyManager === 1 ? '#43A047' : '#a7e34d'},
            ]}>
            <Text style={styles.circleText}>{statusbyManager === 1 ? 'A' : 'P'}</Text>
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.dateText}>{from_date} - {to_date}</Text>
          </View>
        </View>

        <View style={styles.rightBox}>
        <Text style={[styles.title,{fontSize:scaleFontSize(12),color:"#000"}]}>{`(Total Day - ${totalDay}) ${leave_type_name}`}</Text>
        </View> 

      </View>
    </TouchableOpacity>
  </View>
);

export default LeaveRequest;

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
    fontSize: scaleFontSize(14),
    color: '#206aed',
  },
  dateText: {
    fontSize: scaleFontSize(12),
    color: '#8bc34a',
  },
  statusCircle: {
    alignItems:"center",
    justifyContent: 'center',
    // padding: horizontalScale(10),
    width: 45,
    height: 45,
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
  },
  leftBox:{
    flexDirection:"row",
    alignItems: 'center',
  }
});
