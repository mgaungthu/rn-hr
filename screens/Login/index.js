import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {loginUserInfo, resetUser} from '../../redux/reducers/User';
import {LoginUser} from '../../api';
import Button from './components/Button';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../assets/styles/scaling';

const Login = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {}, []);

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
                  placeholderTextColor={'#ddd'}
                  onChangeText={value => setUserId(value)}
                />
              </View>

              <View>
                <TextInput
                  secureTextEntry
                  style={styles.inputContainer}
                  placeholder="Password"
                  placeholderTextColor={'#ddd'}
                  onChangeText={value => setPassword(value)}
                />
              </View>

              {error.length > 0 && <Text style={styles.error}>{error}</Text>}

              <View style={{marginTop: 20, alignItems: 'center'}}>
                <Button
                  onPress={async () => {
                    const {status, message, data} = await LoginUser({
                      employee_id: userId,
                      password: password,
                    });
                    if (!status) {
                      setError(message);
                      dispatch(resetUser());
                    } else {
                      // console.log(data.userinfo.data.user_info+ " , " +data.userinfo.data.access_token);
                      dispatch(loginUserInfo(data.userinfo.data));

                      navigation.navigate('home');
                    }

                    // dispatch(resetUser());
                    // navigation.navigate('home');
                  }}
                />
              </View>
            </View>
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
