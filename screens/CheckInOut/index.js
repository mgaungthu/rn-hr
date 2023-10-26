import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import ClockText from './components/ClockText';
import {useSelector, useDispatch} from 'react-redux';
import {checkInStatus,checkOutStatus} from '../../redux/reducers/CheckInOutStatus';
import {checkInOutApi} from '../../api';

import CustomModal from '../../components/CustomModel';
import MapView from './components/MapView';
import CheckInOutBtn from './components/CheckInOutBtn';
import styles from './styles';
import LoadingScreen from '../../components/LoadingScreen';


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
  const {access_token, user_info} = useSelector(state => state.user);
  const {CheckIn} = useSelector(state => state.checkinout);


  const dispatch = useDispatch();

  useEffect(() => {
    const result = requestLocationPermission();

    result.then(res => {
      // console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            // console.log(position);
            setLatLong([position.coords.longitude, position.coords.latitude]);
          },
          error => {
            // See error code charts below.
            alert(error.message);
          },
        );
      }
    });

    setTimeout(() => {
      setModalVisible(false);
    }, 3000);
  }, [isModalVisible]);

  const options = {
    saveToPhotos: false,
    mediaType: 'Photo',
    maxHeight: 800,
    maxWidth: 600,
  };

  const callCamera = async () => {
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

  const callCheckInOut = async imgUri => {

    try {
      response = await checkInOutApi(
        imgUri,
        latLong,
        access_token,
        user_info.userId,
        CheckIn.status
      );
      if (response.status) {
        if(CheckIn.status){
          dispatch(checkOutStatus({time:response.time,status:true}));
        }else {
          
          dispatch(checkInStatus({time:response.time,status:true})); 
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
        setMessage("Internet Connection Error");
        setModalVisible(true);
    }

   
  };

  const getDeviceLocation = () => {
    Geolocation.requestAuthorization(
      success => {
        if (latLong.length === 0) {
          Geolocation.getCurrentPosition(position => {
            setLatLong([position.coords.longitude, position.coords.latitude]);
          });
        } else {
          setLatLong([]);
        }
      },
      error => {
        alert('you cannot use geolocation');
      },
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
        <MapView
          latLong={latLong}
          getDeviceLocation={getDeviceLocation}
        />
        <View style={styles.secWrapper}>
          <View>
            <Text style={styles.checkIntext}>Check {CheckIn.status ? "out" : "in"} Time</Text>
          </View>
          <View style={{marginVertical: 13}}>
            <ClockText />
          </View>
          <View>
            <Text style={styles.dateText}>Tuesday, 10 Oct 2023</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={styles.shiftText}>Front Office Shift-A</Text>
          </View>

          <CheckInOutBtn callCamera={callCamera} CheckIn={CheckIn}/>

          <View>
            <Text style={styles.shiftText}>Open gps to check in/out</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckInOut;


