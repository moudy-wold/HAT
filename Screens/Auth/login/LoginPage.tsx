import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import tw from "twrnc";
import LoginForm from "./LoginForm";

function Login() {
  const { t } = useTranslation();
  return (
    <View style={tw``}>
      {/* Start Texts */}
      <View style={tw`flex flex-col gap-5`}>
        <Text style={tw`font-semibold text-xl text-center`}>{t("login")} </Text>
        <Text style={tw` text-center text-[#7c7d7e]`}>
          {t("add_your_details_toLogin")}{" "}
        </Text>
      </View>
      {/* End Texts */}

      <View>
        <LoginForm />
      </View>
    </View>
  );
}

export default Login;
