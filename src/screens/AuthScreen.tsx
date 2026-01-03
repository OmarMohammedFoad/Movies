import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthInput from '../components/AuthInput';
import LoadingIndicator from '../components/LoadingIndicator';
import { loginUser, signUpUser } from '../store/authState';
import { AppDispatch, RootState } from '../store/store';

// --- Login Form Component ---
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { user, error, loading } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>();

  if (loading) {
    return (<LoadingIndicator />
    )
  }
  return (
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
      <TouchableOpacity className="bg-indigo-600 p-4 rounded-lg items-center mt-4">
        <Text onPress={() => dispatch(loginUser({ email, newPassword }))} className="text-white font-bold text-lg">Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Signup Form Component ---
const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {
    loading
  } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>();
  if (loading) {
    return (<LoadingIndicator />
    )
  }
  return (
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
      <TouchableOpacity className="bg-indigo-600 p-4 rounded-lg items-center mt-4">
        <Text onPress={() => dispatch(signUpUser({ email, newPassword, displayName }))} className="text-white font-bold text-lg">Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};


// --- Main AuthScreen Component ---
const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-white text-4xl font-bold mb-2">
          {isLogin ? 'Welcome Back!' : 'Get Started'}
        </Text>
        <Text className="text-slate-400 text-lg mb-8">
          {isLogin ? 'Login to continue' : 'Create an account to begin'}
        </Text>

        {isLogin ? <LoginForm /> : <SignupForm />}

        <View className="flex-row mt-8">
          <Text className="text-slate-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
          </Text>
          <Pressable onPress={() => setIsLogin(!isLogin)}>
            <Text className="text-indigo-400 font-semibold">
              {isLogin ? 'Sign Up' : 'Login'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
