import React from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface AuthInputProps {
  iconName: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const AuthInput = ({ iconName, placeholder, value, onChangeText, secureTextEntry = false }: AuthInputProps) => {
  return (
    <View className="flex-row items-center bg-slate-800 rounded-lg p-4 mb-4 w-full">
      <Icon name={iconName} size={20} color="#94a3b8" />
      <TextInput
        className="flex-1 text-white text-lg ml-4"
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
};

export default AuthInput;