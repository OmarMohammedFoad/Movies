import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../screens/AuthScreen";


const stack = createNativeStackNavigator();


const AuthNavigator = () => {
  return (<stack.Navigator>
    <stack.Screen
      name="auth"
      component={AuthScreen}
      options={{ headerShown: false }}
    >

    </stack.Screen>
  </stack.Navigator>)
}


export default AuthNavigator;
