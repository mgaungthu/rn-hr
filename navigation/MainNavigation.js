import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import CheckInOut from '../screens/CheckInOut';
import Login from '../screens/Login';

const Stack = createStackNavigator();

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
      <Stack.Screen name={'home'} component={Home} />
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
    </Stack.Navigator>
  );
};
