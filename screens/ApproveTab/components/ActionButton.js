import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  horizontalScale,
  verticalScale,
  scaleFontSize,
} from '../../../assets/styles/scaling';
import {faTrashCan} from '@fortawesome/free-regular-svg-icons';

const ActionButton = ({showConfirmDialog}) => {
  return (
    <>
      <View style={styles.btnWrapper}>
        <View></View>
        <View style={styles.btnBox2}>
          <TouchableOpacity
            onPress={() => showConfirmDialog('approve')}
            style={[styles.btn, {backgroundColor: '#206aed'}]}>
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(25),
    alignItems: 'center',
  },
  btnBox2: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
  },
});
