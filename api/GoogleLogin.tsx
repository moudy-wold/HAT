import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
WebBrowser.maybeCompleteAuthSession();

const BACKEND_URL = "https://getir.logicprodev.com/api"; // رابط Laravel

export default function GoogleLogin() {
  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId:
        "572082373697-9b08ur9hegqjludhfgj35rlkqipv5nqa.apps.googleusercontent.com",
      scopes: ["profile", "email"],
      responseType: AuthSession.ResponseType.Token,
    },
    { authorizationEndpoint: `${BACKEND_URL}/auth/google/redirect` }
  );

  useEffect(() => {
    if (response?.type === "success" && response.params?.token) {
      const token = response.params.token;
      SecureStore.setItemAsync("token", token);
      // بعدها أرسل المستخدم للصفحة الرئيسية
    }
  }, [response]);

  return (
    <View>
      <TouchableOpacity
        onPress={() => promptAsync()}
        style={{ backgroundColor: "#4285F4", padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          تسجيل الدخول عبر Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}
