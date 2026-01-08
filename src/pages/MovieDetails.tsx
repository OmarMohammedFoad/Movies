import axios from 'axios';
import React, { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ReviewsCard } from '../components/MoviesReviews';
// password MoviesAppOmar123!@#

const MovieDetails = ({ route }: { route: any }) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);

  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedToWatchList, setAddToWatchList] = useState(false);
  const fetchMovieDetails = async (id: number) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${Config.TOKEN}`

          },
        }
      );
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const fetchMovieReviews = async (id: number) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/reviews`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDg1MjQ0NTNjMDlmMDJiOGIxZGEwN2EyMzdhNDEyNiIsIm5iZiI6MTczOTcwNjI5Ny40OTcsInN1YiI6IjY3YjFjZmI5ODVmNTc2ZTk3ZDZkYjg3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rEYNtq2ENmlkDbhb7Ql9MzrQ9oF23gLyChXjkJ1e02A'

          },
        },
      );
      setReviews(data.results || []);
    } catch (error) {
      console.error("Error fetching movie reviews:", error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMovieDetails(route.params.id),
        fetchMovieReviews(route.params.id)
      ]);
      setLoading(false);
    };
    fetchData()
  }, [route.params.id]);

  const renderHeader = () => (
    <>
      <View>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.backdrop_path}` }}
          className="w-full h-96 rounded-b-xl"
          resizeMode="cover"
        />
        <View className="flex-row items-end -mt-24 px-6">
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
            className="w-40 h-56 rounded-xl shadow-lg"
            resizeMode="cover"
          />
          <View className='flex-1 items-start ml-4'>


            <Text
              className="text-white font-bold text-3xl mb-2"
              numberOfLines={2}
            >
              {movie?.title}
            </Text>

            <View className='bg-white/30 px-3 py-1 rounded-2xl flex-row items-center'>
              <Icon name="star" size={20} color="#FF8700" />
              <Text className='text-[#FF8700] font-semibold text-base ml-2 '>
                {Math.floor((movie?.vote_average ?? 0) / 2).toFixed(1)} / 5
              </Text>
            </View>
          </View>

        </View>



        <View className="flex-row justify-center items-center px-6 mt-4">
          <View className="flex-row justify-center items-center text-[#92929D] mr-2">
            <Icon name="calendar-outline" size={20} color="#92929D" />
            <Text className="text-gray-300 text-base ml-1">
              {movie?.release_date
                ? new Date(movie.release_date).getFullYear()
                : ''}
            </Text>
          </View>
          <Text className="text-gray-300 text-base mr-2">|</Text>
          <View className="flex-row justify-center items-center text-[#92929D] mr-2">
            <Icon name="clock-outline" size={20} color="#92929D" />
            <Text className="text-gray-300 text-base ml-1">
              {movie?.runtime} Minutes
            </Text>
          </View>
          <Text className="text-gray-300 text-base mr-2">|</Text>
          {movie?.genres && (
            <View className="flex-row justify-center items-center text-[#92929D]">
              <Icon name="ticket-outline" size={20} color="#92929D" />
              <Text className="text-gray-300 text-base ml-1">
                {movie.genres?.map((genre) => genre.name)[0]}
              </Text>
            </View>
          )}
        </View>

        <View className="px-6 mt-4">
          <Text className="text-gray-300 text-base leading-relaxed">
            {movie?.overview}
          </Text>
        </View>
      </View>
    </>
  );


  const Loading = () => (<> <View className='bg-primary flex-1 justify-center items-center'>
    <ActivityIndicator color="#FF8700" size='large' />
  </View></>)

  return (
    <>
      <Suspense fallback={<Loading />}>
        <FlatList
          className="bg-primary flex-1"
          data={reviews}
          keyExtractor={(item: Reviews) => item.id.toString()}
          renderItem={({ item }) => <ReviewsCard {...item} />}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text className="text-gray-400 text-center mt-4">No reviews yet.</Text>}
        />
      </Suspense >
    </>

  );
};

export default MovieDetails;
