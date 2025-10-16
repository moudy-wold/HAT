import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import tw from "twrnc";
import ChangePasswordForm from "./ChangePasswordForm";

function ChangePassword() {
  const { t } = useTranslation();
  return (
    <View style={tw``}>
      {/* Start Texts */}
      <View style={tw`flex flex-col gap-5`}>
        <Text style={tw`font-semibold text-xl text-center`}>
          {" "}
          {t("set_passord")}{" "}
        </Text>
        <Text style={tw`px-8 text-center text-[#7c7d7e]`}>
          {" "}
          {t("enter_email_pr_phone")}{" "}
        </Text>
      </View>
      {/* End Texts */}

      <View>
        <ChangePasswordForm />
      </View>
    </View>
  );
}

export default ChangePassword;
