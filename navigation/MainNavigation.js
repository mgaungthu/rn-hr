import {Button, Text, View, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Home from '../screens/Home';
import CheckInOut from '../screens/CheckInOut';
import Login from '../screens/Login';
import RequestTabPage from '../screens/RequestTabPage';
import AtdRequest from '../screens/RequestTabPage/AtdRequest';
import LeaveRequest from '../screens/RequestTabPage/LeaveRequest';
import OtRequest from '../screens/RequestTabPage/OtRequest';
import AttendanceRequestForm from '../screens/RequestTabPage/AtdRequest/AttendanceRequestForm';
import LeaveRequestForm from '../screens/RequestTabPage/LeaveRequest/LeaveRequestForm';
import AttendanceList from '../screens/AttendanceList';
import Settings from '../screens/Settings';
import { useSelector } from 'react-redux';


const RequestTab = createMaterialTopTabNavigator();

const Stack = createStackNavigator();

const styles = {
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#206aed',
    padding: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
  },
  tabText: {
    fontWeight: 'bold',
    color:"#ddd"
  },
  activeTab: {
    backgroundColor: 'orange',
  },
  activeTabText: {
    color: '#206aed',
  },
};

const CustomTabBar = ({ state, descriptors, navigation }) => {

  const unapprovedRequestsCount = useSelector((state) => state.attendance.unapprovedCount);
  const unapprovedLeaveCount = useSelector((state) => state.leave.unapprovedCount);
  const {user_info} = useSelector(state=> state.user);


  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabItem,
              { backgroundColor: isFocused ? 'orange' : 'transparent' },
              isFocused && styles.activeTab,
            ]}
          >
            <Text style={[styles.tabText, isFocused && styles.activeTabText]}>
              {label} 
              {route.name === 'atd-req' && unapprovedRequestsCount > 0 && user_info.approved_person === 1 && (
                <Text style={styles.countText}> ({unapprovedRequestsCount})</Text>
              ) 
              } 
              {route.name === 'leaverequest' && unapprovedLeaveCount > 0 && user_info.approved_person === 1 && (
                <Text style={styles.countText}> ({unapprovedLeaveCount})</Text>
              ) 
              }  
              </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const RequestTabNavigation = () => {
  return (
    <RequestTab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarStyle: {backgroundColor: '#206aed'},
        tabBarActiveTintColor: '#ff3636',
        tabBarLabelStyle: {fontSize: 14, fontWeight: 500},
        tabBarInactiveTintColor: '#fff',
        tabBarIndicatorStyle: {backgroundColor: '#ff3636'},
        tabBarPressColor: '#ddd',
        tabBarPressOpacity: false,
      }}>
      <RequestTab.Screen
        name={'atd-req'}
        component={AtdRequest}
        options={{tabBarLabel: 'Attandance'}}
      />
      <RequestTab.Screen
        name={'leaverequest'}
        component={LeaveRequest}
        options={{tabBarLabel: 'Leave'}}
      />
      <RequestTab.Screen
        name={'otrequest'}
        component={OtRequest}
        options={{tabBarLabel: 'Overtime'}}
      />
    </RequestTab.Navigator>
  );
};

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
      <Stack.Screen
        name={'home'}
        component={Home}
        initialParams={{showModal: false}}
      />
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
        name={'attendancelist'}
        component={AttendanceList}
        options={{
          headerShown: true,
          title: 'Attendance',
          headerStyle: {
            backgroundColor: '#206aed',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name={'settings'}
        component={Settings}
        options={{
          headerShown: true,
          title: 'Settings',
          headerStyle: {
            backgroundColor: '#206aed',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name={'requesttabpage'}
        component={RequestTabPage}
        options={({ navigation, route }) => ({
          headerShown: true,
          title: 'Request',
          headerStyle: {
            backgroundColor: '#206aed',
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <Button title="Update count" />
          ),
          
        })}
      />
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen
          name="attendanceRequestForm"
          component={AttendanceRequestForm}
        />
        <Stack.Screen name="leaveRequestForm" component={LeaveRequestForm} />
      </Stack.Group>
    </Stack.Navigator>
  );   
};
 