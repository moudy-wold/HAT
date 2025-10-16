import ProfileContent from "@/Screens/ProfilePages/ProfileContent";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProfileContent />
    </SafeAreaView>
  );
}
