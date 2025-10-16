import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

function GuidingContent() {
  const { t } = useTranslation();
  const { width } = Dimensions.get("window");
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const data = [
    {
      id: "1",
      title: t("Find Food You Love"),
      description: t(
        "Discover The Best Food From 1000 restaurants and fast delivery to your doorstep."
      ),
      image: require("../../assets/images/kerspy.png"),
    },
    {
      id: "2",
      title: t("Fast Delivery"),
      description: t("Get your favorite meals delivered quickly and fresh."),
      image: require("../../assets//images/kerspy.png"),
    },
    {
      id: "3",
      title: t("Easy Payments"),
      description: t("Pay securely and easily with multiple payment options."),
      image: require("../../assets/images/kerspy.png"),
    },
  ];
  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/(tabs)");
    }
  };
  const Item = ({ item, index }: { item: (typeof data)[0]; index: number }) => {
    return (
      <View style={[{ width }, tw`items-center px-4`]}>
        <Image source={item.image} style={tw`w-60 h-60`} resizeMode="contain" />

        {/* Dots inside the item */}
        <View style={tw`flex-row justify-center mt-3`}>
          {data.map((_, i) => (
            <View
              key={i}
              style={[
                tw`w-2 h-2 mx-1 rounded-full`,
                currentIndex === i ? tw`bg-[#fc6011]` : tw`bg-[#ccc]`,
              ]}
            />
          ))}
        </View>

        <Text style={tw`text-xl font-bold text-center mt-4`}>{item.title}</Text>
        <Text style={tw`text-[#7c7d7e] text-center mt-2`}>
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <View style={tw`mt-32`}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item, index }) => <Item item={item} index={index} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <TouchableOpacity
        onPress={handleNext}
        style={tw`bg-[#fc6011] rounded-full w-5/6 mx-auto py-1 my-8`}
      >
        <Text style={tw`text-[#fff] text-center text-lg `}>{t("next")}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default GuidingContent;
