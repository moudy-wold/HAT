import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import tw from "twrnc";
const { width } = Dimensions.get("window");
const defaultDataWith6Colors = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];

function AdsSlider({ data }: any) {
  const router = useRouter();
  const progress = useSharedValue<number>(0);
  const ref = React.useRef<ICarouselInstance>(null);
  const baseOptions = {
    vertical: false,
    width: width,
    height: width * 0.6,
  } as const;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
  return (
    <View style={tw``}>
      <Carousel
        ref={ref}
        {...baseOptions}
        height={130}
        loop
        onProgressChange={progress}
        data={data}
        pagingEnabled
        snapEnabled
        renderItem={({ item, index }: any) => (
          <TouchableOpacity
            style={[
              tw`h-[120px]  flex flex-row items-center justify-center mx-1 border-2 border-gray-300 rounded-lg overflow-hidden`,
              { width: width - 10 },
            ]}
            key={item?.id}
            onPress={() => {
              router.push(`/meal/${item?.id}`);
            }}
          >
            <Image
              source={{ uri: item.images[0] }}
              style={tw`w-full h-[116px] rounded-md`}
            />
          </TouchableOpacity>
        )}
      />
      {/* Start Custom Pagination */}

      {/* <Pagination.Basic
        progress={progress}
        data={defaultDataWith6Colors}
        dotStyle={{
          backgroundColor: "#ddd",
          borderRadius: 8,
          marginHorizontal: 4,
        }}
        activeDotStyle={{ backgroundColor: "#fc6011", borderRadius: 8 }}
        containerStyle={{ gap: 5, marginBottom: 10 }}
        onPress={onPressPagination}
      /> */}
      {/* End Custom Pagination */}
    </View>
  );
}

export default AdsSlider;
