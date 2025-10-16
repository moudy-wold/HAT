import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Text, View } from "react-native";
import tw from "twrnc";
const STATUS_LIST = ["pending", "preparing", "on_the_way", "delivered"];

export default function OrderStatusLine({ currentStatus }: any) {
  const [animations] = useState(STATUS_LIST.map(() => new Animated.Value(0)));
  const { t } = useTranslation();
  useEffect(() => {
    animations.forEach((anim, index) => {
      const isActive = STATUS_LIST[index] === currentStatus;
      if (isActive) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        anim.setValue(0.3);
      }
    });
  }, [currentStatus]);

  return (
    <View style={tw`px-4 py-6`}>
      <View style={tw`flex-row items-center justify-between relative`}>
        <View
          style={tw`absolute top-[8px] w-[86%] opacity-45 left-5  h-1 bg-gray-300`}
        />

        {STATUS_LIST?.map((status, index) => (
          <View key={status} style={[tw`items-center z-50`]}>
            <Animated.View
              style={[
                tw`w-5 h-5 rounded-full mb-2  relative`,
                {
                  zIndex: 9999999999,
                  backgroundColor: "#fc6011",
                  opacity: animations[index],
                },
              ]}
            />
            <Text style={tw`text-xs`}>{t(status)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
