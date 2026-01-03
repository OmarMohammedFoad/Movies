import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  signUpUser,
  updateProfileImage,
  updateUserProfile
} from "./authState";

export interface IUser {
  uid: string;
  email: string | null;
  oldPassword?: string | null;
  newPassword?: string | null;
  imageUri?: any;
  photoURL?: string;
  displayName?: string;
}

interface UserState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 🔹 Sign Up
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.user;
        if (user) {
          state.user = {
            uid: user.$id,
            email: user.email,
            displayName: user.name,
          };
        }
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔹 Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload;
        if (user) {
          state.user = {
            uid: user.$id,
            email: user.email,
            displayName: user.name,
            photoURL: user.rows[0].profile_picture
          };
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔹 Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.error = null;
    });

    // 🔹 Update Profile Info
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && action.payload) {
          state.user = {
            ...state.user,
            displayName: action.payload.displayName ?? state.user.displayName,
            email: action.payload.email ?? state.user.email,
            imageUri: action.payload.imageUri ?? state.user.imageUri,
          };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔹 Upload Profile Image
    builder
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user = {
            ...state.user,
            photoURL: action.payload, // ✅ هنا بنخزن رابط الصورة
          };
        }
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
