import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AuthInput from "../components/AuthInput";
import LoadingIndicator from "../components/LoadingIndicator";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { signUpUser } from "../store/authState";
import { AppDispatch, RootState } from "../store/store";



type SignupNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation<SignupNavigationProp>();
  const {
    loading
  } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>();
  if (loading) {
    return (<LoadingIndicator />
    )
  }
  return (
    <View className="flex-1 bg-gray-900 justify-center items-center p-6">
      <Text className="text-white text-4xl font-bold mb-2">
        Get Started
      </Text>
      <View className="w-full">
        <AuthInput
          iconName="envelope"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <AuthInput
          iconName="envelope"
          placeholder="username"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <AuthInput
          iconName="lock"
          placeholder="Password"
          value={newPassword}
          onChangeText={setPassword}
          secureTextEntry
        />
        <AuthInput
          iconName="lock"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={() => dispatch(signUpUser({ email, newPassword, displayName }))} className="bg-indigo-600 p-4 rounded-lg items-center mt-4">
          <Text className="text-white font-bold text-lg">Create Account</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => {
        navigation.navigate('Login')
      }}>

        <Text className="text-slate-400 text-lg mb-8">
          Already have an account? Log In
        </Text>
      </TouchableOpacity>

    </View>
  );
};
