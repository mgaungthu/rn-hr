import React, {useEffect, useState, useRef} from 'react';
import {TouchableOpacity, StyleSheet, Animated, Easing, TouchableHighlight} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAdd} from '@fortawesome/free-solid-svg-icons';

const FloatActionBtn = ({navigation, activeTabName}) => {
  
  const [routeName, SetRouteName] = useState('attendanceRequestForm');
  const zoomAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    startZoomInAnimation()
    if (activeTabName) {
      SetRouteName(
        activeTabName === 'atd-req'
          ? 'attendanceRequestForm'
          : 'leaveRequestForm',
      );
      zoomAnim.setValue(0.1);
      fadeAnim.setValue(0.2);
      startZoomInAnimation();
    }
  }, [activeTabName,zoomAnim]);


  const startZoomInAnimation = () => {
    const zoomInAnimation = Animated.timing(zoomAnim, {
      toValue: 1,
      duration: 500, // Adjust the duration as needed
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

    const fadeInAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

    Animated.parallel([zoomInAnimation, fadeInAnimation]).start();  

  };


  return (
    <TouchableHighlight
    onPress={() => navigation.navigate(routeName)}
    >
    <Animated.View
      style={{
        ...styles.TouchableOpacityStyle,
        transform: [{ scale: zoomAnim }],
        opacity: fadeAnim,
      }}>

        <FontAwesomeIcon size={20} icon={faAdd} style={styles.font} />
    </Animated.View>
    </TouchableHighlight>
  );
};

export default FloatActionBtn;

const styles = StyleSheet.create({
  TouchableOpacityStyle: {
    //Here is the trick
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: 'red',
    borderRadius: 100,
    elevation: 2,
  },
  font: {
    color: '#fff',
  },
});
