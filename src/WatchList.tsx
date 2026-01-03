import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './store/store'
import { fetchWatchlist } from './store/watchlistState'

const WatchList = () => {
  const watchListMovies = useSelector((state: RootState) => state.watchList.items)
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  // const [movies, setMovies] = React.useState<MovieDetails[] | null[]>([]);

  useEffect(() => {
    dispatch(fetchWatchlist({ userId: user?.uid || "" })).unwrap().catch(console.error);

  }, []);


  console.log(watchListMovies, user);



  return (
    <View className='flex-1 bg-slate-900 p-6 pt-20 justify-between items-center'>

      {/* <FlatList
        // data={movie}
        // keyExtractor={(item) => item.$id}
        renderItem={(item) => (
          <View className='flex-1 flex-row justify-center items-center'>
            <Image

            />
            <View className=''>
              <Text className='text-white font-poppins text-lg'>Watch List Screen</Text>
              <View className='flex-1 flex-row justify-between'>

              </View>
            </View>
          </View>
        )
        }
      /> */}
    </View>
  )
}

export default WatchList
