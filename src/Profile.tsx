import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { account } from "./lib/appwrite";
import {
  IUserCredential,
  logoutUser,
  updateProfileImage,
  updateUserProfile,
} from "./store/authState";
import { AppDispatch, RootState } from "./store/store";

const ProfileSetupScreen = () => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(
    user?.photoURL || null
  );

  const logout = () => {
    dispatch(logoutUser()).unwrap().catch(console.error);
  };

  const handleEditProfile = async () => {
    const payload: IUserCredential = {
      email: user?.email || "",
      oldPassword,
      displayName: username,
      newPassword,
    };

    dispatch(updateUserProfile(payload))
      .unwrap()
      .then(() => {
        Alert.alert("Profile updated successfully");
      })
      .catch(() => {
        Alert.alert("Failed to update profile");
      });
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
      });

      const imageUri = result.assets?.[0]?.uri;
      if (!imageUri) return;

      setSelectedImage(imageUri);
      console.log(await account.get());

      const uploadedUrl = await dispatch(updateProfileImage({ imageUri: imageUri, user: await account.get() })).unwrap();
      console.log(uploadedUrl, "uploadedUrl");

      setSelectedImage(uploadedUrl);
      console.log(selectedImage, "uri");


      dispatch(
        updateUserProfile({
          email: user?.email || "",
          displayName: user?.displayName,
          imageUri: uploadedUrl,
        })
      );

      Alert.alert("Profile picture updated!");
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "Failed to upload image");
    }
  };

  return (
    <View className="flex-1 bg-slate-900 p-6 pt-20 justify-between items-center">
      {/* ---------- Avatar Section ---------- */}
      <View className="items-center">
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
          <View className="relative">
            {selectedImage || user?.photoURL ? (
              <Image
                source={{ uri: user?.photoURL }}
                className="w-36 h-36 rounded-full border-4 border-indigo-500 shadow-lg"
              />
            ) : (
              <View className="w-36 h-36 rounded-full bg-slate-800 justify-center items-center border-2 border-slate-700">
                <Icon name="account-circle" size={80} color="#94a3b8" />
              </View>
            )}
            <View className="absolute bottom-2 right-2 bg-indigo-600 rounded-full p-2 shadow-md">
              <Icon name="camera" size={18} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>

        <Text className="text-white text-3xl font-extrabold mt-4">
          {user?.displayName || "No Name Set"}
        </Text>
        <Text className="text-slate-400 text-base mt-1">{user?.email}</Text>
      </View>

      {/* ---------- Action Buttons ---------- */}
      <View className="w-full mt-8">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex-row items-center justify-center bg-indigo-600/80 p-4 rounded-xl w-full mb-3 shadow-md"
        >
          <Icon name="account-edit" size={22} color="#fff" />
          <Text className="text-white text-lg font-semibold ml-2">
            Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={logout}
          disabled={loading}
          className="flex-row items-center justify-center bg-red-600/80 p-4 rounded-xl w-full shadow-md"
        >
          {loading ? (
            <Text className="text-white font-semibold">Logging out...</Text>
          ) : (
            <>
              <Icon name="logout-variant" size={22} color="#fff" />
              <Text className="text-white text-lg font-semibold ml-2">
                Logout
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* ---------- Edit Modal ---------- */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-4">
          <View className="bg-slate-800 w-full rounded-2xl p-6 shadow-2xl">
            <Text className="text-2xl font-bold text-center mb-6 text-white">
              Edit Profile
            </Text>

            {/* Inputs */}
            <View className="mb-4">
              <Text className="text-slate-300 mb-1 font-medium">
                Change Username
              </Text>
              <TextInput
                placeholder="Enter new username"
                placeholderTextColor="#9ca3af"
                className="border border-slate-600 bg-slate-700 text-white rounded-xl px-4 py-2"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View className="mb-4">
              <Text className="text-slate-300 mb-1 font-medium">
                Old Password
              </Text>
              <TextInput
                secureTextEntry
                placeholder="Enter old password"
                placeholderTextColor="#9ca3af"
                className="border border-slate-600 bg-slate-700 text-white rounded-xl px-4 py-2"
                value={oldPassword}
                onChangeText={setOldPassword}
              />
            </View>

            <View className="mb-6">
              <Text className="text-slate-300 mb-1 font-medium">
                New Password
              </Text>
              <TextInput
                secureTextEntry
                placeholder="Enter new password"
                placeholderTextColor="#9ca3af"
                className="border border-slate-600 bg-slate-700 text-white rounded-xl px-4 py-2"
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            {/* Buttons */}
            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-slate-600 rounded-xl py-3 mr-2"
              >
                <Text className="text-center text-slate-200 font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleEditProfile}
                className="flex-1 bg-indigo-600 rounded-xl py-3 ml-2"
              >
                <Text className="text-center text-white font-semibold">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileSetupScreen;
