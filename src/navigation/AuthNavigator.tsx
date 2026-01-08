import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginForm } from "../screens/Login";
import { SignupForm } from "../screens/Register";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginForm}
      />
      <Stack.Screen
        name="Register"
        component={SignupForm}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
