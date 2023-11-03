import { View, Text } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Home from '../screens/Home';
import CheckInOut from '../screens/CheckInOut';
import Login from '../screens/Login';
import RequestTabPage from '../screens/RequestTabPage'
import AtdRequest from '../screens/RequestTabPage/AtdRequest';
import LeaveRequest from '../screens/RequestTabPage/LeaveRequest';
import OtRequest from '../screens/RequestTabPage/OtRequest';
import AttendanceRequestForm from '../screens/RequestTabPage/AtdRequest/AttendanceRequestForm';
import LeaveRequestForm from '../screens/RequestTabPage/LeaveRequest/LeaveRequestForm';


const RequestTab = createMaterialTopTabNavigator()

const Stack = createStackNavigator();
 

export const RequestTabNavigation = () => {
  return (
    <RequestTab.Navigator   screenOptions={{
      tabBarStyle: { backgroundColor: '#206aed'},
      tabBarActiveTintColor:"#ff3636",
      tabBarLabelStyle: { fontSize: 14,fontWeight:500},
      tabBarInactiveTintColor:"#fff",
      tabBarIndicatorStyle:{backgroundColor:"#ff3636"},
      tabBarPressColor:"#ddd",
      tabBarPressOpacity:false

    }}>
      <RequestTab.Screen name={'atd-req'} component={AtdRequest} options={{ tabBarLabel: 'Attandance' }} />
      <RequestTab.Screen name={'leaverequest'} component={LeaveRequest} options={{ tabBarLabel: 'Leave' }} />
      <RequestTab.Screen name={'otrequest'} component={OtRequest} options={{ tabBarLabel: 'OverTime' }}/>
    </RequestTab.Navigator>
  )
}


export const NonAuthenticated = () => {
  return (
    <Stack.Navigator
      initialRouteName={'login'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={'login'} component={Login} />
    </Stack.Navigator>
  );
};




export const Authenticated = () => {
  return (
    <Stack.Navigator
      initialRouteName={'home'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={'home'} component={Home} initialParams={{ showModal: false }} />
      <Stack.Screen
        name={'checkinout'}
        component={CheckInOut}
        options={{
          headerShown: true,
          title: 'Check In/Out',
          headerStyle: {
            backgroundColor: '#206aed',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name={'requesttabpage'}
        component={RequestTabPage}
        options={{
          headerShown: true,
          title: 'Request',
          headerStyle: {
            backgroundColor: '#206aed',
          },
          headerTintColor: '#fff',
        }}
      />
       <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="attendanceRequestForm" component={AttendanceRequestForm} />
        <Stack.Screen name="leaveRequestForm" component={LeaveRequestForm} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
