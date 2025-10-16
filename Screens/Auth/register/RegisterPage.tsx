import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import RegisterForm from "./RegisterForm";
function Register() {
  const { t, i18n } = useTranslation();
  return (
    <ScrollView
      style={[
        tw`px-5 pt-8   `,
        { direction: i18n.language === "ar" ? "rtl" : "ltr" },
      ]}
    >
      {/* Start Texts */}
      <View style={tw`flex flex-col gap-5`}>
        <Text style={tw`font-semibold text-xl text-center`}>
          {" "}
          {t("register")}{" "}
        </Text>
        <Text style={tw` text-center text-[#7c7d7e]`}>
          {" "}
          {t("add_your_details_to_register")}{" "}
        </Text>
      </View>
      {/* End Texts */}
      <View>
        <RegisterForm />
      </View>
    </ScrollView>
  );
}

export default Register;
