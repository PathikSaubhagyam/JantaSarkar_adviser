import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import Login from '../screens/authscreens/Login';
// import SignUp from '../screens/authscreens/SignUp';
import SignUp from '../screens/authscreens/SignUp';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();

  useEffect(() => {}, []);
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
