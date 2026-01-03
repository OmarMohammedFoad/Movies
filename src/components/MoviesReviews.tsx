import { Image, View,Text
 } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const ReviewsCard = ({ author_details, content, updated_at }: Reviews) => {
    const avatarUrl = author_details.avatar_path
        ? `https://image.tmdb.org/t/p/w500${author_details.avatar_path}`
        : 'https://via.placeholder.com/50';

    return (
        <View className="bg-secondary m-4 p-4 rounded-2xl">
            <View className="flex-row items-center mb-3">
                <Image className="w-12 h-12 rounded-full" source={{ uri: avatarUrl }} />
                <View className="flex-1 ml-3">
                    <Text className="font-bold text-gray-100 text-base">
                        {author_details.username}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                        {Array.from({ length: author_details?.rating ?? 0 / 2 }).map((_, index) => (
                            <Icon key={index} name="star-outline" size={18} color={index < (author_details?.rating ?? 0) / 2 ? "#FFD700" : "#444"} />
                        ))}
                        <Text className="text-gray-200 ml-1">
                            {Math.floor(author_details?.rating ?? 0 / 2) > 0 ? `  ${Math.floor(author_details?.rating ?? 0 / 2)} / 5` : 'N/A'}
                        </Text>
                        <Text className="text-gray-400 ml-2 text-xs">
                            {new Date(updated_at).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </View>
            <Text  className="text-zinc-100 text-sm leading-5">
                {content.split(' ').slice(0, 50).join(' ')}…
            </Text>
        </View>
    );
};