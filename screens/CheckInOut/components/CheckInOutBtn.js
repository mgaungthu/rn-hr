import React from 'react';
import {TouchableOpacity, View, Image, Text} from 'react-native';
import styles from '../styles';
import { getCompare } from '../../../assets/utils';

const CheckInOutBtn = ({callCamera,CheckIn,checkInOut}) => {
  // console.log(checkInOut)
    
  if (CheckIn.status || checkInOut) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => callCamera()}>
        <View style={[styles.btnWrapper,{backgroundColor:"#aed581",borderRadius:100}]}>
          <Image
            source={require('../../../assets/images/cursor.png')}
            style={styles.checkInOutBtn}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => callCamera()}>
      <View style={styles.btnWrapper}>
        <Image
          source={require('../../../assets/images/cursor.png')}
          style={styles.checkInOutBtn}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CheckInOutBtn;
