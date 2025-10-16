import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View, Image, Text } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import tw from "twrnc";

function MainCategories({ data }: any) {
  const router = useRouter();
  return (
    <View>
      <SwiperFlatList
        index={0}
        data={data}
        horizontal={true}
        pagingEnabled={true}
        decelerationRate="fast"
        snapToAlignment="center"
        keyExtractor={(item) => item._id}
        initialScrollIndex={0}
        getItemLayout={(data, index) => ({
          length: 76,
          offset: 76 * index,
          index,
        })}
        snapToOffsets={data.map((_: any, index: any) => index * 76)}
        renderItem={({ item, index }) => (
          <Pressable
            style={tw`flex flex-col items-center mt-1 mx-1`}
            key={index}
            onPress={() => {
              router.push(`/category/${item.id}`);
            }}
          >
            <View
              style={tw` w-[68px] h-[68px] flex-row items-center justify-center rounded-xl p-[1px] border-2 overflow-hidden`}
            >
              <Image
                source={{ uri: item.image }}
                style={[
                  tw`w-[61px] h-[61px] rounded-xl `,
                  { objectFit: "cover" },
                ]}
                resizeMode="contain"
              />
            </View>
            <Text style={tw`mt-2 text-sm font-semibold`}>{item?.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

export default MainCategories;
