import React, {useEffect, useState} from 'react';
import {FlatList, View, Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import { useNavigationState } from '@react-navigation/native';
import {callAttendanceRequestList as callatdReq} from '../../../api';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../../assets/styles/scaling';
import CustomModal from '../../../components/CustomModel';
import LoadingScreen from '../../../components/LoadingScreen';
import FloatActionBtn from '../components/FloatActionBtn';

const AtdRequest = ({route,navigation, navigation: {setParams},state} ) => {
  const [atData, setAtData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {access_token} = useSelector(state => state.user);


  const navigationState = useNavigationState(state => state);


  const activeTabRoute = navigationState.routes[navigationState.index];

  
  const activeTabName = activeTabRoute ? activeTabRoute.name : null;



  useEffect(() => {
    
    setLoading(true);
    callAttendanceRequestList();
    if (route.params?.showModal) {
      setMessage(route.params?.message);
      setParams({showModal: false});
      toggleModal()
    }

    return () =>{
      callAttendanceRequestList()
      toggleModal(); 
    }
    
  },[route.params?.showModal]);


  const toggleModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 3000);
  };

  const callAttendanceRequestList = () => {
     callatdReq(access_token).then(
      (response) => {
        setAtData(response.data)
      }
     ).catch(
      () => alert("Internet Connection Error")
      
     )
     .finally(
      () => setLoading(false)
     )
    
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
          <Item title={item.title} status={item.status} date={item.date} id={item.id} navigation={navigation} statusbyManager={item.statusby_manager} />
        )}
        keyExtractor={item => item.id}
      />
      {loading && <LoadingScreen />}

      <FloatActionBtn activeTabName={activeTabName} navigation={navigation}/>

    </SafeAreaView>
  );
};

const Item = ({title, status, date,id,navigation,statusbyManager}) => (
  <View style={styles.item}>
    <TouchableOpacity disabled={statusbyManager == 0 || null ? false : true} onPress={() => navigation.navigate('attendanceRequestForm', { id: id, isEdit:true })}>
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
    </TouchableOpacity>

    
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
    // padding: horizontalScale(10),
    width: 45,
    height: 45,
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
