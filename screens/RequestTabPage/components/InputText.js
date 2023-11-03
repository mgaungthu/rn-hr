import React from 'react'
import {View, Text, TextInput, StyleSheet, Keyboard} from 'react-native'
import { scaleFontSize, horizontalScale, verticalScale } from '../../../assets/styles/scaling'

const InputText = ({reason,setReason}) => {

  const textInputRef = React.useRef(null);

  React.useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // Remove focus from TextInput when the keyboard is dismissed
        textInputRef.current?.blur();
      }
    );

    // Clean up the event listener
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View>
        <Text style={[styles.labelText]}>
            Reason
          </Text>
          <TextInput
          ref={textInputRef}
            style={styles.input}
            placeholder="Please write your reason"
            placeholderTextColor="#9e9e9e"
            value={reason}
            onChangeText={text => setReason(text)}
          />
    </View>
  )
}

export default InputText


const styles = StyleSheet.create({
    labelText: {
        color: '#9e9e9e',
        fontSize: scaleFontSize(16),
        marginTop: verticalScale(6),
      },
      label: {
        color: '#000',
        margin: horizontalScale(8),
      },
      input: {
        color: '#000',
        borderBottomWidth: verticalScale(1),
        borderBottomColor: '#9e9e9e',
        fontSize: scaleFontSize(16),
        marginTop: verticalScale(5),
      },
})