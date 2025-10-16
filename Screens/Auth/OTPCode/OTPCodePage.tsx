import OTPPopup from "@/components/Global/OTPPopup/OTPPopup";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import tw from "twrnc";

function OTPCode() {
  const { t } = useTranslation();
  return (
    <View style={tw``}>
      {/* Start Texts */}
      <View style={tw`flex flex-col gap-5`}>
        <Text style={tw`font-semibold text-xl text-center`}>
          {" "}
          {t("we_have_sent_otpcode_to_you")}{" "}
        </Text>
        <Text style={tw` px-6 text-center text-[#7c7d7e]`}>
          {" "}
          {t(
            "please_check_your_phone_or_email_to_complete_the_password_reset_process"
          )}{" "}
        </Text>
      </View>
      {/* End Texts */}

      <View>
        <OTPPopup />
      </View>
    </View>
  );
}

export default OTPCode;
