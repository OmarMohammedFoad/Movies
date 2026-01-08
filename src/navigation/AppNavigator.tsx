import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from "react-redux";
import HomeScreen from "../Home";
import MovieDetails from "../pages/MovieDetails";
import ProfileSetupScreen from "../Profile";
import { AppDispatch, RootState } from "../store/store";
import { toggleWatchlist } from "../store/watchlistState";
import WatchList from "../WatchList";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  const watchList = useSelector((state: RootState) => state.watchList.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const fetchMovieDetails = async (id: number) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDg1MjQ0NTNjMDlmMDJiOGIxZGEwN2EyMzdhNDEyNiIsIm5iZiI6MTczOTcwNjI5Ny40OTcsInN1YiI6IjY3YjFjZmI5ODVmNTc2ZTk3ZDZkYjg3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rEYNtq2ENmlkDbhb7Ql9MzrQ9oF23gLyChXjkJ1e02A'

          },
        },
      );
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#242A32" },
          headerTitleStyle: { color: "#FFFFFF", fontFamily: "poppins", fontWeight: "semibold" },
          headerTitle: "What do you want to watch?",

        }}
      />
      <Stack.Screen
        name="MovieDetails"
        component={MovieDetails}
        options={({ route }) => {
          const movieId = route.params?.id;
          // console.log(typeof movieId);
          const movieDetails = fetchMovieDetails(movieId);


          const isMovieInWatchList = watchList.some((item: any) => item.movieId === movieId?.toString());




          return {
            headerStyle: { backgroundColor: '#242A32' },
            headerTitleStyle: { color: "#FFFFFF", fontFamily: "poppins", fontWeight: "semibold" },
            headerTintColor: '#FFFFFF',
            title: 'Movie Details',
            headerTitleAlign: "center",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  if (movieId && user?.uid) {
                    dispatch(toggleWatchlist({
                      userId: user?.uid,
                      movieId: movieId.toString(),
                    })).unwrap().then(() => {
                      console.log("movie watchlist status toggled");
                    }).catch((error) => {
                      console.log("error toggling watchlist status:", error);
                    });
                    console.log("movie added to watch list");
                  }
                }}
              >
                {isMovieInWatchList ? (<Icon name="bookmark" size={30} color="#FFFFFF" />) : (<Icon name="bookmark-outline" size={30} color="#FFFFFF" />)}


              </TouchableOpacity>
            )
          }
        }}
      />

    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (<Tab.Navigator
    screenOptions={({ route }) => {
      const routeName = getFocusedRouteNameFromRoute(route) ?? "";

      if (routeName === "MovieDetails") {
        return { tabBarStyle: { display: "none" } };
      }

      return { tabBarStyle: { backgroundColor: "#242A32", padding: 20 } };
    }}>
    <Tab.Screen

      name="Home"
      component={HomeStack}
      options={{

        headerShown: false,

        tabBarIcon: ({ color }) => (

          <Icon name="home" size={30} color={color} />
        ),

      }}
    />

    <Tab.Screen
      name="watch list"
      component={WatchList}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="archive" size={30} color={color} />
        ),
      }}
    />

    <Tab.Screen
      name="Profile"
      component={ProfileSetupScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="account" size={30} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
  )
}


export default AppNavigator
