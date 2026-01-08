import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { fetchWatchlist } from './store/watchlistState';

// 1. Define the interface for the Movie Data from TMDB
interface MovieData {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const WatchList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const watchListItems = useSelector((state: RootState) => state.watchList.items);

  // Local state to hold the actual movie details (images, titles, etc.)
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // 2. Fetch the IDs from Appwrite when component mounts
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchWatchlist({ userId: user.uid })).unwrap().catch(console.error);
    }
  }, [dispatch, user?.uid]);

  // 3. "Hydrate" the IDs: Whenever watchListItems changes, fetch details from TMDB
  useEffect(() => {
    const fetchFullMovieDetails = async () => {
      if (watchListItems.length === 0) {
        setMovies([]);
        return;
      }

      setLoadingDetails(true);
      try {
        // Create an array of promises to fetch all movies in parallel
        const promises = watchListItems.map(async (item) => {
          try {

            const { data } = await axios.get(
              `https://api.themoviedb.org/3/movie/${item.movieId}?language=en-US`,
              {
                headers: {
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDg1MjQ0NTNjMDlmMDJiOGIxZGEwN2EyMzdhNDEyNiIsIm5iZiI6MTczOTcwNjI5Ny40OTcsInN1YiI6IjY3YjFjZmI5ODVmNTc2ZTk3ZDZkYjg3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rEYNtq2ENmlkDbhb7Ql9MzrQ9oF23gLyChXjkJ1e02A'
                }
              }
            );
            setLoadingDetails(false);
            return data;
          } catch (err) {
            console.error(`Failed to fetch movie ${item.movieId}`, err);
            return null; // Return null if one fails so we can filter it out later
          }
        });

        // Wait for all requests to finish
        const results = await Promise.all(promises);

        // Filter out any nulls (failed requests) and set state
        setMovies(results.filter((movie) => movie !== null) as MovieData[]);
      } catch (error) {
        console.error("Error hydrating watchlist:", error);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchFullMovieDetails();
  }, [watchListItems]);

  const renderItem = ({ item }: { item: MovieData }) => (
    <View className='flex-row bg-slate-800 mb-4 rounded-xl overflow-hidden shadow-lg p-2'>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        className='w-24 h-36 rounded-lg'
        resizeMode='cover'
      />

      <View className='flex-1 ml-4 justify-between py-2'>
        <View>
          <Text className='text-white font-bold text-lg' numberOfLines={2}>
            {item.title}
          </Text>
          <Text className='text-gray-400 text-sm mt-1'>
            {item.release_date?.split('-')[0] || 'N/A'}
          </Text>
        </View>

        <View className='flex-row items-center'>
          <Icon name="star" size={16} color="#FFD700" />
          <Text className='text-yellow-400 ml-1 font-bold'>
            {item.vote_average.toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className='flex-1 bg-slate-900 p-4'>
      <Text className='text-white text-2xl font-bold mb-4 mt-8'>My Watchlist</Text>

      {loadingDetails ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size="large" color="#0296E5" />
        </View>
      ) : (
        <FlatList
          data={movies} // We render the Hydrated 'movies', not the 'watchListItems' IDs
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text className='text-gray-500 text-center mt-10'>
              No movies in watchlist yet.
            </Text>
          }
        />
      )}
    </View>
  );
};

export default WatchList;
