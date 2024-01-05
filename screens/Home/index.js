import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  ImageBackground,
  Image,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {scaleFontSize, verticalScale} from '../../assets/styles/scaling';
import CustomModal from '../../components/CustomModel';
import CheckInOutTimeBox from './components/CheckInOutTimeBox';
import {
  callCheckInOutInfo as InfoApi,
  callAttendanceRequestAll,
  callCheckInOutList,
  callLeaveHistoryAll,
} from '../../api';
import {
  AddAttendanceList,
  checkInStatus,
  checkOutStatus,
  resetcheckInOutStatus,
} from '../../redux/reducers/CheckInOutStatus';
import {getFormattedDate} from '../../assets/utils';
import {resetApprove, setAttendanceRequests} from '../../redux/reducers/attendanceList';
import {resetLeaveApprove, setLeaveRequests} from '../../redux/reducers/leaveList';
import LoadingScreen from '../../components/LoadingScreen';
import { resetUser } from '../../redux/reducers/User';

const Home = ({route, navigation, navigation: {setParams}}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const {access_token, user_info} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const {name, photo, designation, department, approved_person} = user_info;
  const {CheckIn, CheckOut} = useSelector(state => state.checkinout);
  const unapprovedRequestsCount = useSelector(
    state => state.attendance.unapprovedCount,
  );
  const unapprovedLeaveCount = useSelector(
    state => state.leave.unapprovedCount,
  );

  // const access_token = user.access_token;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    timeout = setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    return () => {
      timeout.clearTimeout()
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      callCheckInOutInfo();
      if (user_info.approved_person) {
        callAttendanceApprovedList();
        callLeaveApproveList();
      }
    }, []),
  );

  const getFormattedDateMemoized = useMemo(() => getFormattedDate(), []);
  

  useEffect(() => {
    // toggleModal();

    // console.log("home "+isModalVisible)
    // const listener = navigation.addListener('focus', () => {
    //   if (route.params?.showModal) {
    //     setParams({showModal: false});

    //   }
    // });

    // return () => {
    //   listener;
    // };
    // if(refreshing){
    // }
    setLoading(true);
    // console.log(refreshing)
    getCheckInOutList();
    if (refreshing) {
      callCheckInOutInfo();
      getCheckInOutList();
      if (user_info.approved_person) {
        callAttendanceApprovedList();
        callLeaveApproveList();
      }
    }
    if (route.params?.showModal) {
      setMessage(route.params?.message);
      setParams({showModal: false});
      setParams({message: ''});
      toggleModal();
    }
  }, [route.params?.showModal, refreshing]);

  const callCheckInOutInfo = async () => {
    const response = await InfoApi(access_token);
    if (response.status && response.data) {
      const {check_in_time, check_out_time} = response.data;
      dispatch(
        checkInStatus({
          time: check_in_time || '00:00',
          status: check_in_time ? true : false,
        }),
      );
      dispatch(
        checkOutStatus({
          time: check_out_time || '00:00',
          status: check_out_time ? true : false,
        }),
      );
    } else {
      if (response.data === 401) {
        Alert.alert(
          'Please login again',
          'Your session has expired. Please log in again.',
          [
            {
              text: 'OK',
              onPress: () => {
                dispatch(resetUser());
                dispatch(resetApprove());
                dispatch(resetLeaveApprove());
                dispatch(resetcheckInOutStatus());
                navigation.navigate('login'); 
              },
            },
          ],
        );
      } else {
        // dispatch(checkInStatus({time: '00:00', status: false}));
        // dispatch(checkOutStatus({time: '00:00', status: false}));
        alert("Network conntection error")
      }
    }
  };

  const getCheckInOutList = () => {
    callCheckInOutList(access_token)
      .then(response => {
        dispatch(AddAttendanceList(response.data));
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const callAttendanceApprovedList = () => {
    callAttendanceRequestAll(access_token)
      .then(response => {
        if (response.status && response.data.length > 0) {
          dispatch(setAttendanceRequests(response.data));
        }
      })
      .catch(error => {
        alert('Internet Connection Error');
      });
  };

  const callLeaveApproveList = () => {
    callLeaveHistoryAll(access_token)
      .then(response => {
        if (response.status) {
          dispatch(setLeaveRequests(response.data));
        }
      })
      .catch(error => {
        // console.log(error)
        alert('Internet Connection Error');
      });
  };

  const toggleModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 3000);
  };

  const adjustFontSize = inputString => {
    if (inputString.length > 12) {
      // If the string is over 12 characters, set a smaller font size
      return {fontSize: scaleFontSize(14)};
    } else {
      // If the string is 12 characters or fewer, use the default font size
      return {fontSize: scaleFontSize(20)};
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ImageBackground
          source={require('../../assets/images/bg-wave.png')}
          resizeMode="cover"
          imageStyle={{
            height: 535,
          }}
          style={{backgroundColor: '#fff'}}>
          <View style={{flex: 1}}>
            <View style={styles.TopContainer}>
              <View style={styles.avatorBox}>
                <View style={styles.boxShadow}>
                  <Image
                    source={{
                      uri: `https://soloversion.com/uploads/employee/${photo}`,
                    }}
                    style={styles.avator}
                    resizeMode={'cover'}
                  />
                </View>

                <View>
                  <CustomModal
                    title={message}
                    isVisible={isModalVisible}
                    jsonPath={require('../../assets/animations/success-checkmark.json')}
                  />
                </View>

                <View style={{height: 100, marginTop: verticalScale(10)}}>
                  <Text style={[styles.nameText, adjustFontSize(name)]}>
                    {name}
                  </Text>
                  <Text
                    style={{
                      fontSize: scaleFontSize(14),
                      color: '#fff',
                      marginTop: verticalScale(12),
                    }}>
                    {designation.name}
                  </Text>
                  <Text
                    style={{
                      fontSize:
                        department.name.length > 20
                          ? scaleFontSize(12)
                          : scaleFontSize(14),
                      color: '#fff',
                      width: 160,
                    }}>
                    {department.name}
                    {/* Commercial - Customer Care wadwd */}
                  </Text>
                </View>
              </View>
              <View style={{marginTop: verticalScale(10)}}>
                <Image
                  source={require('../../assets/images/bell.png')}
                  style={{width: 56, height: 56}}
                  resizeMode={'cover'}
                />
              </View>
            </View>
            <View style={styles.secWrapper}>
              <View style={styles.dateBox}>
                <Text style={{fontSize: scaleFontSize(16), color: '#fff'}}>
                  {user_info.shift.name}
                </Text>
                <Text style={{fontSize: scaleFontSize(14), color: '#fff'}}>
                  {getFormattedDateMemoized}
                </Text>
              </View>

              <CheckInOutTimeBox CheckIn={CheckIn} CheckOut={CheckOut} />

              <View style={styles.boxWrapper}>
                <TouchableOpacity
                  style={styles.box}
                  onPress={() => navigation.navigate('checkinout')}
                  activeOpacity={0.9}>
                  <Image
                    source={require('../../assets/images/ic_alarm_clock.png')}
                    style={styles.boxImg}
                  />
                  <Text style={{fontSize: scaleFontSize(18), color: '#fda1ba'}}>
                    Check In/Out
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.box}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('requesttabpage')}>
                  <Image
                    source={require('../../assets/images/ic_calendar_leave.png')}
                    style={styles.boxImg}
                  />
                  <Text style={{fontSize: scaleFontSize(18), color: '#fda1ba'}}>
                    Request
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.box}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('attendancelist')}>
                  <Image
                    source={require('../../assets/images/ic_calendar_plus.png')}
                    style={styles.boxImg}
                  />
                  <Text style={{fontSize: scaleFontSize(18), color: '#fda1ba'}}>
                    Attendance
                  </Text>
                  {loading && (
                    <ActivityIndicator
                      color={'#206aed'}
                      size={12}
                      style={{position: 'absolute', top: 10, right: 10}}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.box} activeOpacity={0.9}>
                  <Image
                    source={require('../../assets/images/ic_calendar_timeline.png')}
                    style={styles.boxImg}
                  />
                  <Text style={{fontSize: scaleFontSize(18), color: '#fda1ba'}}>
                    Overtime
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.box}
                  activeOpacity={0.9}
                  onPress={() =>
                    approved_person === 1 &&
                    navigation.navigate('requesttabpage')
                  }>
                  {user_info.approved_person === 1 && (
                    <View style={styles.countBox}>
                      <Text style={styles.countText}>
                        {unapprovedRequestsCount + unapprovedLeaveCount}
                      </Text>
                    </View>
                  )}

                  <Image
                    source={require('../../assets/images/ic_calendar_edit.png')}
                    style={styles.boxImg}
                  />
                  <Text style={{fontSize: scaleFontSize(18), color: '#fda1ba'}}>
                    Approval
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.box}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('settings')}>
                  <Image
                    source={require('../../assets/images/ic_settings.png')}
                    style={styles.boxImg}
                  />
                  <Text style={{fontSize: scaleFontSize(18), color: '#fda1ba'}}>
                    Settings
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
