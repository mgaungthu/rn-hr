import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import ClockText from './components/ClockText';
import {useSelector, useDispatch} from 'react-redux';
import {
  checkInStatus,
  checkOutStatus,
} from '../../redux/reducers/CheckInOutStatus';
import {checkInOutApi} from '../../api';

import CustomModal from '../../components/CustomModel';
import MapView from './components/MapView';
import CheckInOutBtn from './components/CheckInOutBtn';
import styles from './styles';
import LoadingScreen from '../../components/LoadingScreen';
import {distance, getCompare} from '../../assets/utils';

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      alert('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

const CheckInOut = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [latLong, setLatLong] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(true);

  
  const [checkInOut, setCheckInOut] = useState(false);
  const {access_token, user_info} = useSelector(state => state.user);
  const {CheckIn} = useSelector(state => state.checkinout);

  const [formattedDate, setFormattedDate] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    // Function to get the formatted date
    const getFormattedDate = () => {
      const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      };

      const currentDate = new Date();
      return currentDate.toLocaleDateString('en-US', options);
    };

    // Set the initial formatted date
    setFormattedDate(getFormattedDate());

    setCheckInOut(
      getCompare(getCurrentTimeFormatted(), user_info.shift.cutoff_time),
    );

    const result = requestLocationPermission();

    if (result) getDeviceLocation();

    const timeout = setTimeout(() => {
      setModalVisible(false);
    }, 3000);

    return () => timeout;
  }, [isModalVisible]);

  const options = {
    saveToPhotos: false,
    mediaType: 'Photo',
    maxHeight: 800,
    maxWidth: 600,
  };

  const handleCheckInOut = () => {
    // Display a confirmation alert
    Alert.alert(
      'Confirmation',
      'Are you sure you want to check in/out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // User pressed OK, call the check-in/out function
            callCheckInOut(null);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const callCamera = async () => {

    if(isDisabled) { 
      alert("Open GPS to Check in/out")
      return false
    }

    if (!user_info.camera_allow) {
      handleCheckInOut();
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      launchCamera(options, response => {
        // console.log('Response = ', response);
        if (response.didCancel) {
          // console.log('User cancelled image picker');
        } else {
          setLoading(true);
          // console.log('response', JSON.stringify(response));
          callCheckInOut(response.assets[0]);
        }
      });
    }
  };

  const getCurrentTimeFormatted = () => {
    const currentDate = new Date();

    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  };

  const callCheckInOut = async imgUri => {
    const range = distance(
      user_info.location.latitude,
      user_info.location.longitude,
      latLong[1],
      latLong[0],
    );

    // console.log(range > 0.1)

   

    if (!user_info.location_allow && range > 0.03) {
      setLoading(false);
      setMessage('Out of Office`s location');
      setModalVisible(true);
      return;
    }

    if (!user_info.location_allow && !latLong.length) {
      setLoading(false);
      setMessage('Please open location services');
      setModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      response = await checkInOutApi(
        imgUri,
        latLong,
        access_token,
        user_info.userId,
        CheckIn.status,
        checkInOut,
      );
      if (response.status) {
        if (CheckIn.status || CheckInOut) {
          dispatch(checkOutStatus({time: response.time, status: true}));
        } else {
          dispatch(checkInStatus({time: response.time, status: true}));
        }
        setLoading(false);

        navigation.navigate('home', {
          showModal: response.status,
          message: response.message,
        });
      } else {
        setLoading(false);
        setMessage(response.message);
        setModalVisible(true);
      }
    } catch (error) {
      setLoading(false);
      setMessage('Internet Connection Error');
      setModalVisible(true);
    }
  };

  const getDeviceLocation = () => {
    Geolocation.requestAuthorization(
      () => {
        if (latLong.length === 0) {
          Geolocation.getCurrentPosition(
            position => {
              setLatLong([position.coords.longitude, position.coords.latitude]);
              setDisabled(false)
            },
            error => {
              // if (!user_info.location_allow) {
              // See error code charts below.
              alert('Please open gps to use map');
              // }
            },
          );
        } else {
          setLatLong([]);
        }
      },
      error => {
        console.log(error.code);
        alert('you cannot use geolocation');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <SafeAreaView>
      <View>
        <CustomModal
          title={message}
          isVisible={isModalVisible}
          jsonPath={require('../../assets/animations/error-check-mark.json')}
        />
      </View>
      <View style={styles.container}>
        {loading && <LoadingScreen />}
        <MapView latLong={latLong} getDeviceLocation={getDeviceLocation} />
        <View style={styles.secWrapper}>
          <View>
            <Text style={styles.checkIntext}>
              Check {CheckIn.status ? 'Out' : 'In'} Time
            </Text>
          </View>
          <View style={{marginVertical: 13}}>
            <ClockText />
          </View>
          <View>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={styles.shiftText}>Front Office Shift-A</Text>
          </View>

          <CheckInOutBtn
          isDisabled={isDisabled}
            callCamera={callCamera}
            CheckIn={CheckIn}
            checkInOut={checkInOut}
          />

          <View>
            <Text style={styles.shiftText}>Open gps to check in/out</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckInOut;
