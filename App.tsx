import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";
import "./global.css";
import LoadingIndicator from "./src/components/LoadingIndicator";
import { account, Query, tablesDB } from "./src/lib/appwrite";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { setUser } from "./src/store/authSlice";
import { RootState, store } from "./src/store/store";
const AppContent = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isInitialize, setIsInitialize] = useState(true);

  useEffect(() => {


    const checkUserLogged = async () => {
      try {
        const currentUser = await account.get();
        const profile = await tablesDB.listRows({
          databaseId: "69063b6f00214b84d617",
          tableId: "6908a237002974c4025d",
          queries: [Query.equal("userid", currentUser.$id)]
        })

        if (currentUser) {
          dispatch(
            setUser({
              uid: currentUser.$id,
              email: currentUser.email,
              displayName: currentUser.name,
              photoURL: profile.rows[0].profile_picture

            })
          );
        } else {
          dispatch(setUser(null))
        }
      } catch (error) {
        dispatch(setUser(null))
      } finally {
        setIsInitialize(false);

      }
    }

    checkUserLogged();
  }, [dispatch])
  if (isInitialize) {
    return (
      <LoadingIndicator />
    )
  }
  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )

}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>

    </Provider>

  );
}
