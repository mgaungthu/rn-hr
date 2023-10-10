import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Image,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';

const Home = ({navigation}) => {
  const [text, setText] = useState(0);

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ImageBackground
        source={require('../../assets/images/bg-wave.png')}
        resizeMode="cover"
        style={{height: 600, backgroundColor: '#fff'}}>
        <View style={styles.TopContainer}>
          <View style={styles.avatorBox}>
            <View style={styles.boxShadow}>
              <Image
                source={require('../../assets/images/circled_person_female.png')}
                style={styles.avator}
                resizeMode={'cover'}
              />
            </View>

            <View style={{height: 100, marginTop: 10}}>
              <Text style={{fontSize: 20, color: '#fff'}}>Aung Thu</Text>
              <Text style={{fontSize: 14, color: '#fff', marginTop: 12}}>
                Software Developer
              </Text>
              <Text style={{fontSize: 14, color: '#fff'}}>Technology</Text>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Image
              source={require('../../assets/images/bell.png')}
              style={{width: 56, height: 56}}
              resizeMode={'cover'}
            />
          </View>
        </View>
        <View style={styles.secWrapper}>
          <View>
            <Text style={{fontSize: 16, color: '#fff'}}>Office Shift</Text>
            <Text style={{fontSize: 14, color: '#fff'}}>
              Wednesday, 04 Oct 2023
            </Text>
          </View>

          <View style={styles.clockWrapper}>
            <View>
              <Text style={{fontSize: 20, color: '#fff'}}>Check In</Text>
              <Text style={styles.clockText}>8:45 AM</Text>
            </View>
            <View>
              <Text style={{fontSize: 20, color: '#fff'}}>Check Out</Text>
              <Text style={styles.clockText}>5:45 PM</Text>
            </View>
          </View>

          <View style={styles.boxWrapper}>
            <View style={styles.box}>
              <TouchableOpacity
                onPress={() => navigation.navigate('checkinout')}>
                <Image
                  source={require('../../assets/images/ic_alarm_clock.png')}
                  style={styles.boxImg}
                />
              </TouchableOpacity>
              <Text style={{fontSize: 18, color: '#fda1ba'}}>Check In/Out</Text>
            </View>
            <View style={styles.box}>
              <Image
                source={require('../../assets/images/ic_calendar_leave.png')}
                style={styles.boxImg}
              />
              <Text style={{fontSize: 18, color: '#fda1ba'}}>Request</Text>
            </View>
            <View style={styles.box}>
              <Image
                source={require('../../assets/images/ic_calendar_plus.png')}
                style={styles.boxImg}
              />
              <Text style={{fontSize: 18, color: '#fda1ba'}}>Attendance</Text>
            </View>
            <View style={styles.box}>
              <Image
                source={require('../../assets/images/ic_calendar_timeline.png')}
                style={styles.boxImg}
              />
              <Text style={{fontSize: 18, color: '#fda1ba'}}>Overtime</Text>
            </View>
            <View style={styles.box}>
              <Image
                source={require('../../assets/images/ic_calendar_edit.png')}
                style={styles.boxImg}
              />
              <Text style={{fontSize: 18, color: '#fda1ba'}}>Approval</Text>
            </View>
            <View style={styles.box}>
              <Image
                source={require('../../assets/images/ic_settings.png')}
                style={styles.boxImg}
              />
              <Text style={{fontSize: 18, color: '#fda1ba'}}>Settings</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Home;
