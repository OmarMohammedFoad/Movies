import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const categories = ['Now Playing', 'Upcoming', 'Top Rated', 'Popular']
const categoryMap: Record<string, string> = {
  'Now Playing': 'now_playing',
  Upcoming: 'upcoming',
  'Top Rated': 'top_rated',
  Popular: 'popular',
}
function HomeScreen() {
  const [movie, setMovie] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('Now Playing');
  const [topRatedMovies, setTopRatedMovies] = useState("");
  const navigation = useNavigation()

  const fetchRatingMovies = async () => {
    try {
      const { data } = await axios.get("https://api.themoviedb.org/3/movie/top_rated", {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZDg1MjQ0NTNjMDlmMDJiOGIxZGEwN2EyMzdhNDEyNiIsIm5iZiI6MTczOTcwNjI5Ny40OTcsInN1YiI6IjY3YjFjZmI5ODVmNTc2ZTk3ZDZkYjg3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rEYNtq2ENmlkDbhb7Ql9MzrQ9oF23gLyChXjkJ1e02A'
        }
      });
      setTopRatedMovies(data.results);
    } catch (error) {
      console.error('Error fetching movie data:', error);

    }
  }

  const handleCategoryPress = async (categoryKey: string) => {

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${categoryKey}?language=en-US&page=1`, {
        headers: {
          Authorization: `Bearer ${Config.TOKEN}`
        }
      });

      setMovie(response.data.results);
    } catch (error) {
      console.error('Error fetching movie data:', error);

    }

  }

  useEffect(() => {
    fetchRatingMovies().then();

  }, []);


  useEffect(() => {
    handleCategoryPress('now_playing').then();

  }, [activeCategory]);



  return (


    <View className='bg-primary h-screen px-6 py-1 flex-1 justify-center items-center'>
      <FlatList
        data={movie}
        keyExtractor={(item: any) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ListHeaderComponent={

          <View>
            <View className='w-full flex-row items-center justify-between bg-searchBar py-2 rounded-3xl px-4'>
              <TextInput placeholder='Search' />
              <Icon name="magnify" size={30} color="#67686D" />
            </View>
            <FlatList
              data={topRatedMovies}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              // key={}
              renderItem={({ item, index }: any) => (
                <View className='mr-4 mt-3  mb-10'>
                  <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }} className='relative w-[13.1rem] h-[21rem] rounded-3xl object-cover' />
                  <View className='absolute bottom-[-40] left-[-12] '>
                    <Text className='text-9xl font-bold text-[#515459] font-sans'>{index + 1}</Text>
                  </View>
                </View>
              )
              }
            />
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View className="items-center">
                  <TouchableOpacity
                    onPress={() => {
                      setActiveCategory(item);
                      handleCategoryPress(categoryMap[item]);
                    }}
                  >
                    <Text
                      className={`text-xl font-bold font-sans ${activeCategory === item ? 'text-white' : 'text-gray-400'
                        }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                  <View
                    className={`h-1 w-32 mt-2 rounded-full ${activeCategory === item ? 'bg-[#3A3F47]' : 'bg-transparent'
                      }`}
                  />
                </View>
              )}
            />
          </View>
        }
        renderItem={({ item }: any) => (
          <View className="w-40 h-60 m-3 flex-1">
            <TouchableOpacity
              onPress={() => navigation.navigate('MovieDetails', { id: item.id })}
            >
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                className="w-full h-full rounded-2xl "
              />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

    </View >
  );
}

export default HomeScreen
