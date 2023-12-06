// Settings.js

import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '../../redux/reducers/User'; // Assuming you have a userSlice
import { resetApprove } from '../../redux/reducers/attendanceList';
import { resetLeaveApprove } from '../../redux/reducers/leaveList';
import { resetcheckInOutStatus } from '../../redux/reducers/CheckInOutStatus';

const Settings = ({ navigation }) => {
  const dispatch = useDispatch();

  const {user_info} = useSelector(state => state.user)

  const handleLogout = () => {
    // Display a confirmation alert
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Dispatch the resetUser action to clear user state
            dispatch(resetUser())
            dispatch(resetApprove())
            dispatch(resetLeaveApprove())
            dispatch(resetcheckInOutStatus())
            // You can also perform additional logout actions here (e.g., navigate to login screen)
            navigation.navigate('login'); // Replace 'Login' with the name of your login screen
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back {user_info.name}!</Text>
      <Text style={[styles.title,{fontSize:16}]}>Your ID`s {user_info.userId}!</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Background color for the entire page
  },
  title: {
    fontSize: 21,
    marginBottom: 20,
    color: '#333', // Text color for the title
  },
  logoutButton: {
    width: 150,
    height: 50,
    borderRadius: 25, // Make it a rounded rectangle
    backgroundColor: '#206aed', // Customize the background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white', // Customize the text color
  },
});

export default Settings;
