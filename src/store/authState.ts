import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImageToAppwrite } from "../helper/uploader";
import { account, ID, Query, tablesDB } from "../lib/appwrite";
import type { RootState } from "./store";


export interface ImageInteface {
  name: string,
  type: string,
  size: number,
  uri: string
}


export interface IUserCredential {
  email: string;
  newPassword: string;
  displayName?: string;
  imageUri?: string;
  oldPassword?: string;
}

// Utility: Convert URI to Blob


/**
 * 🧾 Sign Up User
 */
export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async ({ email, newPassword, displayName, imageUri }: IUserCredential, { rejectWithValue }) => {
    try {

      const user = await account.create({
        userId: ID.unique(),
        email,
        password: newPassword,
        name: displayName
      }
      );

      return { user };
    } catch (error: any) {
      console.log("error", error);

      return rejectWithValue(error.message);
    }
  }
);



export const updateProfileImage = createAsyncThunk<
  string,
  { imageUri: string, user: any },
  { state: RootState; rejectValue: string }
>(
  "auth/uploadImage",
  async ({ imageUri, user }, { rejectWithValue }) => {
    try {
      const imageUrl = await uploadImageToAppwrite(imageUri);
      console.log(user.$id);

      const existingRows = await tablesDB.listRows({
        databaseId: "69063b6f00214b84d617",
        tableId: "6908a237002974c4025d",
        queries: [Query.equal("userid", user.$id)],
      });
      console.log(existingRows, "existingRows");

      console.log(user.$id, "asdsadasd");
      if (existingRows.total > 0) {
        await tablesDB.updateRow({
          databaseId: "69063b6f00214b84d617",
          tableId: "6908a237002974c4025d",
          rowId: existingRows.rows[0].$id,
          data: {
            profile_picture: imageUrl,
            username: user.name,
            email: user.email,
          }
        })
      } else {
        await tablesDB.createRow({
          databaseId: "69063b6f00214b84d617",
          tableId: "6908a237002974c4025d",
          rowId: ID.unique(),
          data: {
            userid: user.$id,
            profile_picture: imageUrl,
            username: user?.name,
            email: user?.email,

          }
        });
      }



      return imageUrl;
    } catch (error: any) {
      return rejectWithValue(error.message || "Image upload failed.");
    }
  }
);

/**
 * ⚙️ Update User Profile (Name, Email, Password, Image)
 */
export const updateUserProfile = createAsyncThunk<
  Partial<IUserCredential>,
  Partial<IUserCredential>,
  { state: RootState; rejectValue: string }
>(
  "auth/updateUserProfile",
  async ({ displayName, email, newPassword, oldPassword }, { rejectWithValue }) => {
    console.log({
      "displayName": displayName,
      "email": email,
      'password': oldPassword,
      'newPassword': newPassword
    });

    try {
      if (displayName) {
        await account.updateName({
          name: displayName
        });
      }

      // ✅ Update Email
      // if (email) {
      //   if (!oldPassword) return rejectWithValue("Old password is required to change email.");
      //   await account.updateEmail({
      //     email: email,
      //     password: oldPassword
      //   });
      // }


      // ✅ Update Password
      if (newPassword) {
        if (!oldPassword) return rejectWithValue("Old password is required to change password.");
        await account.updatePassword(newPassword, oldPassword);
      }



      return { displayName, email };
    } catch (error: any) {
      console.log("error", error);
      console.log("error", error.message);

      return rejectWithValue(error.message);
    }
  }
);

/**
 * 🔑 Login User
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, newPassword }: IUserCredential, { rejectWithValue }) => {
    try {
      await account.createEmailPasswordSession({
        email: email,
        password: newPassword
      });
      const user = await account.get();
      const profile = await tablesDB.listRows({
        databaseId: "69063b6f00214b84d617",
        tableId: "6908a237002974c4025d",
        queries: [Query.equal("userid", user.$id)]
      })

      return {
        ...user,
        ...profile
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 🚪 Logout User
 */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await account.deleteSessions();
      return null;
    } catch (error: any) {

      return rejectWithValue(error.message);
    }
  }
);
