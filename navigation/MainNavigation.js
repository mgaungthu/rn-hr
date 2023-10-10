import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import CheckInOut from "../screens/CheckInOut";

const Stack = createStackNavigator();

const MainNavigation = () => {
   return (
     <Stack.Navigator initialRouteName={"home"} screenOptions={{ headerShown: false}} >
        <Stack.Screen name={"home"} component={Home} />
        <Stack.Screen name={"checkinout"} component={CheckInOut} options={{
            headerShown:true, title: "Check In/Out",
            headerStyle: {
            backgroundColor: '#206aed',
            },
            headerTintColor: '#fff'}}/>
    </Stack.Navigator>
   )
}

export default MainNavigation; 