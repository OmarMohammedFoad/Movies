import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AuthInput from "../components/AuthInput";
import LoadingIndicator from "../components/LoadingIndicator";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { loginUser } from "../store/authState";
import { AppDispatch, RootState } from "../store/store";

type LoginNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { loading } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<LoginNavigationProp>();

  if (loading) {
    return (
      <LoadingIndicator />
    )
  } else {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center items-center bg-slate-900 px-4">
            <Text className="text-white text-4xl font-bold mb-2">
              Welcome Back!
            </Text>

            <View className="w-full">
              <AuthInput
                iconName="envelope"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />

              <AuthInput
                iconName="lock"
                placeholder="Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />

              <TouchableOpacity
                onPress={() => dispatch(loginUser({ email, newPassword }))}
                className="bg-indigo-600 p-4 rounded-lg items-center mt-4"
              >
                <Text className="text-white font-bold text-lg">Login</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="text-slate-400 text-lg mb-8">
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    );
  };

}
