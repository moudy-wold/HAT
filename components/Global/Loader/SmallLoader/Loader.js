import { ActivityIndicator, View } from "react-native";
import tw from "twrnc";

export default function SmallLoader() {
  return (
    <View style={tw`justify-center items-center flex-1`}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
