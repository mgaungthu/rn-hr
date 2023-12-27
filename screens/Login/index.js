import React, {useEffect, useState, useRef} from 'react';
import {
  ImageBackground,
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {loginUserInfo, resetUser} from '../../redux/reducers/User';
import {LoginUser} from '../../api';
import Button from './components/Button';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../assets/styles/scaling';
import RememberMe from './components/RememberMe';

const Login = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(function () {
      setError('');
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error])

  useEffect(() => {
    loadRememberMe();
      loadCredentials();
  }, [])
  

  const input2Ref = useRef(null);

  const loadRememberMe = async () => {
    try {
      const rememberMeValue = await AsyncStorage.getItem('rememberMe');
      setRememberMe(rememberMeValue === 'true');
    } catch (error) {
      console.error('Error loading rememberMe value:', error);
    }
  };

  const loadCredentials = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedPassword = await AsyncStorage.getItem('password');

      setUserId(storedUsername || '');
      setPassword(storedPassword || '');
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  const handleRememberMeChange = async () => {
    setRememberMe(!rememberMe);

    // Save the rememberMe value to AsyncStorage
    try {
      await AsyncStorage.setItem('rememberMe', (!rememberMe).toString());
    } catch (error) {
      console.error('Error saving rememberMe value:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('../../assets/images/bg-wave.png')}
          resizeMode="cover"
          imageStyle={{
            height: 535,
          }}
          style={{backgroundColor: '#fff'}}>
          <View style={styles.container}>
            <Image
              source={require('../../assets/images/logo/tm_logo_slogan_white.png')}
              style={styles.logo}
              resizeMode={'contain'}
            />
            <Text style={styles.boxinfo}>Fill Below information to Log in</Text>
            <View style={styles.loginBox}>
              <Text style={styles.LogoTitle}>Login Account</Text>
              <View>
                <TextInput
                  style={styles.inputContainer}
                  placeholder="User ID"
                  value={userId}
                  placeholderTextColor={'#ddd'}
                  onChangeText={value => setUserId(value)}
                  returnKeyType="next"
                  onSubmitEditing={() => input2Ref.current.focus()}
                />
              </View>

              <View>
                <TextInput
                  ref={input2Ref}
                  secureTextEntry
                  style={styles.inputContainer}
                  placeholder="Password"
                  value={password}
                  placeholderTextColor={'#ddd'}
                  onChangeText={value => setPassword(value)}
                  returnKeyType="done"
                />
              </View>

              {error.length > 0 && <Text style={styles.error}>{error}</Text>}

              <View style={{marginTop: 20, alignItems: 'center'}}>
                <Button
                  loading={loading}
                  onPress={async () => {
                    try {
                      setLoading(true);
                      const {status, message, data} = await LoginUser({
                        employee_id: userId,
                        password: password,
                      });
                      if (!status) {
                        dispatch(resetUser());
                        setLoading(false);
                        setError(message);
                      } else {
                        if (rememberMe) {
                          try {
                            await AsyncStorage.setItem('username', userId);
                            await AsyncStorage.setItem('password', password);
                          } catch (error) {
                            console.error('Error saving credentials:', error);
                          }
                        } else {
                          await AsyncStorage.removeItem('username');
                          await AsyncStorage.removeItem('password');
                        }
                        setLoading(false);
                        // console.log(data.userinfo.data.user_info+ " , " +data.userinfo.data.access_token);
                        dispatch(loginUserInfo(data.userinfo.data));

                        navigation.navigate('home');
                        // console.log("here")
                      }
                    } catch (error) {
                      console.log(error);
                      setLoading(false);
                      alert('Internet Connection Error');
                    }
                  }}
                />
              </View>
            </View>

            <RememberMe handleRememberMeChange={handleRememberMeChange} rememberMe={rememberMe} />
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: verticalScale(30),
    // marginTop:100
  },
  logo: {
    width: 310,
    height: 260,
    alignSelf: 'center',
  },
  boxinfo: {
    color: '#fff',
    fontSize: scaleFontSize(18),
    textAlign: 'center',
    marginVertical: verticalScale(18),
  },
  loginBox: {
    backgroundColor: '#fff',
    padding: horizontalScale(25),
    paddingTop: verticalScale(40),
    borderRadius: horizontalScale(15),
    elevation: 10,
  },
  LogoTitle: {
    color: '#000',
    fontSize: 18,
    alignSelf: 'center',
    marginBottom: verticalScale(18),
  },
  inputContainer: {
    color: '#000',
    height: 50,
    marginBottom: verticalScale(18),
    borderBottomWidth: 1,
    borderColor: '#9e9e9e',
  },
  buttonContainer: {
    backgroundColor: '#206aed',
    width: 120,
    height: 50,
    justifyContent: 'center',
    elevation: 3,
    borderRadius: horizontalScale(3),
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: scaleFontSize(16),
    textTransform: 'uppercase',
  },
  error: {
    fontSize: scaleFontSize(16),
    textAlign: 'center',
    color: '#FF0000',
  },
});
