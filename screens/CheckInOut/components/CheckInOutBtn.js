import React from 'react';
import {TouchableOpacity, View, Image, Text} from 'react-native';
import styles from '../styles';
import {getCompare} from '../../../assets/utils';

const CheckInOutBtn = ({callCamera, CheckIn, checkInOut, isDisabled}) => {

  if (CheckIn.status || checkInOut) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => callCamera()}>
        <View
          style={[
            styles.btnWrapper,
            {backgroundColor: !isDisabled ? '#aed581' : '#d4f3b1', borderRadius: 100},
          ]}>
          <Image
            source={require('../../../assets/images/cursor.png')}
            style={styles.checkInOutBtn}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity  disabled={isDisabled} activeOpacity={0.7} onPress={() => callCamera()}>
      <View style={[styles.btnWrapper,{backgroundColor:!isDisabled ? '#206aed' : '#5e93f1'}]}>
        <Image
          source={require('../../../assets/images/cursor.png')}
          style={styles.checkInOutBtn}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CheckInOutBtn;
