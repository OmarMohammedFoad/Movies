import React, { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginForm } from './Login';
import { SignupForm } from './Register';





const AuthScreen = () => {
  const [isLogin] = useState(true);

  return (
    <SafeAreaProvider >

      {isLogin ? <LoginForm /> : <SignupForm />}
    </SafeAreaProvider>
  );
};

export default AuthScreen;
