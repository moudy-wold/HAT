import { get_cities, getAreas } from "@/Helpers/Address";
import * as Location from "expo-location";
import { t } from "i18next";
import React, { useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";

import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import SafeMapView from "./SafeMapView";

function AddressFeils({
  handleChange,
  set_citeis_centers,
  governorates,
  set_neighborhoods,
  citeis_centers,
  neighborhoods,
  handleSubmit,
  setShowForm,
  formdata, // دعم الاسم القديم أيضاً
  selectedAddress,
}: any) {
  // توحيد البيانات - استخدام أي منهما موجود
  const actualFormData = formdata;
  const streetRef = useRef<any>(null);
  const buildingNoRef = useRef<any>(null);
  const floorRef = useRef<any>(null);
  const flatRef = useRef<any>(null);
  const notesRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const [markerCoord, setMarkerCoord] = useState({
    latitude: 36.198885302700745,
    longitude: 37.16563493013382,
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapError, setMapError] = useState(false);

  // تحديد نمط التشغيل (إنشاء جديد أو تعديل)
  const isEditMode = selectedAddress && Object.keys(selectedAddress).length > 0;

  // حالات الأخطاء للحقول
  const [fieldErrors, setFieldErrors] = useState({
    governorate: false,
    city: false,
    district: false,
    street: false,
    build_no: false,
    floor: false,
    flat: false,
    note: false,
    coordinates: false,
  });

  //  للتعديل
  // useEffect(() => {
  //   if (isEditMode && selectedAddress) {
  //     // console.log("📝 نمط التعديل: تعبئة البيانات من العنوان المحدد");
  //     // console.log("📦 بيانات العنوان:", selectedAddress);

  //     // تعبئة الحقول النصية
  //     // تعبئة المحافظة والمدينة والحي
  //     if (selectedAddress.governorate) {
  //       handleChange("governorate", selectedAddress.governorate);
  //     }
  //     if (selectedAddress.city) {
  //       handleChange("city", selectedAddress.city);
  //     }
  //     if (selectedAddress.area_id) {
  //       handleChange("district", selectedAddress.area_id);
  //     }
  //     if (selectedAddress.floor) {
  //       handleChange("floor", selectedAddress.floor);
  //     }
  //     if (selectedAddress.flat) {
  //       handleChange("flat", selectedAddress.flat);
  //     }
  //     if (selectedAddress.note) {
  //       handleChange("note", selectedAddress.note);
  //     }
  //     if (selectedAddress.street) {
  //       handleChange("street", selectedAddress.street);
  //     }
  //     if (selectedAddress.build_no) {
  //       handleChange("build_no", selectedAddress.build_no);
  //     }

  //     // تعبئة الإحداثيات والخريطة
  //     // if (selectedAddress.coordinates) {
  //     //   try {
  //     //     const coords = JSON.parse(selectedAddress.coordinates);
  //     //     if (coords && coords.length === 2) {
  //     //       const newCoord = {
  //     //         latitude: parseFloat(coords[0]),
  //     //         longitude: parseFloat(coords[1]),
  //     //       };
  //     //       setMarkerCoord(newCoord);
  //     //       handleChange("coordinates", selectedAddress.coordinates);
  //     //       console.log("🗺️ تم تعبئة إحداثيات الخريطة:", newCoord);
  //     //     }
  //     //   } catch (error) {
  //     //     console.error("❌ خطأ في تحليل الإحداثيات:", error);
  //     //   }
  //     // }
  //   } else {
  //     console.log("➕ نمط الإنشاء: عنوان جديد");
  //   }
  // }, [selectedAddress, isEditMode]);

  // مراقبة تغيرات الإحداثيات لإزالة الأخطاء تلقائياً
  useEffect(() => {
    if (
      markerCoord.latitude !== 36.198885302700745 ||
      markerCoord.longitude !== 37.16563493013382
    ) {
      clearFieldError("coordinates");
    } else {
      console.error("⚠️ الموقع ما زال على الإحداثيات الافتراضية");
    }
  }, [markerCoord]);

  // دوال إزالة الأخطاء عند الإدخال
  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
  };

  // دالة التحقق من جميع الحقول
  const validateFields = (formData: any) => {
    const errors = {
      governorate: !actualFormData?.governorate,
      city: !actualFormData?.city,
      district: !actualFormData?.district,
      street: !actualFormData?.street || actualFormData?.street.trim() === "",
      build_no:
        !actualFormData?.build_no || actualFormData?.build_no.trim() === "",
      floor: !actualFormData?.floor || actualFormData?.floor.trim() === "",
      flat: !actualFormData?.flat || actualFormData?.flat.trim() === "",
      note: !actualFormData?.note || actualFormData?.note.trim() === "",
      coordinates: !actualFormData?.coordinates,
    };
    setFieldErrors(errors);

    // التحقق من وجود أي خطأ
    const hasErrors = Object.values(errors).some((error) => error);

    if (hasErrors) {
      Toast.show({
        type: "error",
        text1: t("please_fill_all_required_fields"),
      });

      return false;
    }

    return true;
  };

  // دالة لإعادة تعيين جميع الأخطاء
  const resetAllErrors = () => {
    setFieldErrors({
      governorate: false,
      city: false,
      district: false,
      street: false,
      build_no: false,
      floor: false,
      flat: false,
      note: false,
      coordinates: false,
    });
  };

  // دالة معالجة الإرسال المحدثة
  const handleFormSubmit = () => {
    if (validateFields(actualFormData)) {
      console.log(
        isEditMode ? "📝 إرسال تعديل العنوان" : "➕ إرسال عنوان جديد"
      );
      console.log("📦 البيانات المرسلة:", actualFormData);

      // إعادة تعيين الأخطاء عند نجاح التحقق
      resetAllErrors();
      handleSubmit();
    }
  };

  // دالة للحصول على الإحداثيات عند النقر على الخريطة
  const handleMapPress = (event: any) => {
    try {
      const coordinate = event.nativeEvent.coordinate;
      if (coordinate && coordinate.latitude && coordinate.longitude) {
        setMarkerCoord(coordinate);
        clearFieldError("coordinates");
        handleChange(
          "coordinates",
          JSON.stringify([coordinate.latitude, coordinate.longitude])
        );
      }
    } catch (error) {
      console.error("Error handling map press:", error);
      Toast.show({
        type: "error",
        text1: t("error"),
        text2: t("map_interaction_error"),
      });
    }
  };

  // دالة لجلب الموقع الحالي
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // طلب الإذن للوصول للموقع
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: t("permission_denied"),
          text2: t("location_permission_required"),
        });
        setIsLoadingLocation(false);
        return;
      }

      // الحصول على الموقع الحالي
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const currentCoord = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setMarkerCoord(currentCoord);
      clearFieldError("coordinates");
      // حفظ الإحداثيات في النموذج
      handleChange(
        "coordinates",
        JSON.stringify([currentCoord.latitude, currentCoord.longitude])
      );

      // إزالة خطأ الخريطة فوراً بعد الحصول على الموقع
      setMapError(false);

      // تحريك الخريطة للموقع الحالي
      if (mapRef.current) {
        try {
          mapRef.current.animateToRegion({
            ...currentCoord,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        } catch (error) {
          console.error("Error animating to region:", error);
        }
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Toast.show({
        type: "error",
        text1: t("error"),
        text2: t("location_fetch_error"),
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={tw`p-4`}>
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <Text style={tw`text-base font-bold`}>
            {isEditMode
              ? t("edit_address") || "تعديل العنوان"
              : t("add_new_address")}
          </Text>
          <TouchableOpacity
            onPress={() => setShowForm(false)}
            style={tw`w-7 py-1 px-2 border self-end rounded-full mb-1`}
          >
            <Text style={tw`text-center text-red-600`}>X</Text>
          </TouchableOpacity>
        </View>
        {/* Start governorates */}
        <View>
          <Text style={tw`text-gray-700 mb-1`}>{t("the_governorates")}</Text>
          <View
            style={tw`border-[1px] ${
              fieldErrors.governorate ? "border-red-500" : "border-gray-500"
            } rounded-xl`}
          >
            <RNPickerSelect
              onValueChange={(value) => {
                clearFieldError("governorate");
                get_cities(value, set_citeis_centers);
                handleChange("governorate", value);
              }}
              items={governorates.map((city: any) => ({
                label: city?.name,
                value: city.id,
              }))}
              placeholder={{ label: t("choose_the_city"), value: null }}
            />
          </View>
          {fieldErrors.governorate && (
            <Text style={tw`text-red-500 text-xs mt-1`}>
              {t("governorate_required")}
            </Text>
          )}
        </View>
        {/* End governorates */}

        {/* Start Cities */}
        <View>
          <Text style={tw`text-gray-700  mt-4  mb-1`}>
            {t("the_city_center")}
          </Text>
          <View
            style={tw`border-[1px] ${
              fieldErrors.city ? "border-red-500" : "border-gray-500"
            } rounded-xl`}
          >
            <RNPickerSelect
              onValueChange={(value) => {
                clearFieldError("city");
                getAreas(value, set_neighborhoods);
                handleChange("city", value);
              }}
              items={citeis_centers?.map((city: any) => ({
                label: city?.name,
                value: city?.id,
              }))}
              placeholder={{ label: t("choose_the_city"), value: null }}
            />
          </View>
          {fieldErrors.city && (
            <Text style={tw`text-red-500 text-xs mt-1`}>
              {t("city_required")}
            </Text>
          )}
        </View>
        {/* End Cities */}

        {/* Start Areas */}
        <View>
          <Text style={tw`text-gray-700 mt-4 mb-1`}>
            {t("the_neighborhood")}
          </Text>
          <View
            style={tw`border-[1px] ${
              fieldErrors.district ? "border-red-500" : "border-gray-500"
            } rounded-xl`}
          >
            <RNPickerSelect
              onValueChange={(value) => {
                clearFieldError("district");
                handleChange("district", value);
              }}
              items={neighborhoods?.map((d: any) => ({
                label: d?.name,
                value: d?.id,
              }))}
              placeholder={{ label: t("choose_the_neighborhood"), value: null }}
            />
          </View>
          {fieldErrors.district && (
            <Text style={tw`text-red-500 text-xs mt-1`}>
              {t("district_required")}
            </Text>
          )}
        </View>
        {/* End Areas */}

        {/* Start Street */}
        <View>
          <Text style={tw`mt-4 mb-1`}>{t("street_name")}</Text>
          <TextInput
            ref={streetRef}
            returnKeyType="next"
            onSubmitEditing={() => buildingNoRef.current.focus()}
            style={tw`border rounded-xl px-3 py-2 ${
              fieldErrors.street ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("street_name")}
            value={actualFormData?.street}
            onChangeText={(val) => {
              clearFieldError("street");
              handleChange("street", val);
            }}
          />
          {fieldErrors.street && (
            <Text style={tw`text-red-500 text-xs mt-1`}>
              {t("street_required")}
            </Text>
          )}
        </View>
        {/* End Street */}

        {/* Start Build NO */}
        <View>
          <Text style={tw`mt-4 mb-1`}>{t("building_number")}</Text>
          <TextInput
            ref={buildingNoRef}
            returnKeyType="next"
            onSubmitEditing={() => floorRef.current.focus()}
            style={tw`border rounded-xl px-3 py-2 ${
              fieldErrors.build_no ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("example_12")}
            value={actualFormData?.build_no}
            onChangeText={(val) => {
              clearFieldError("build_no");
              handleChange("build_no", val);
            }}
          />
          {fieldErrors.build_no && (
            <Text style={tw`text-red-500 text-xs mt-1`}>
              {t("building_number_required")}
            </Text>
          )}
        </View>
        {/* End Build NO */}

        {/* Start Floor */}
        <View>
          <Text style={tw`mt-4 mb-1`}>{t("the_floor")}</Text>
          <TextInput
            ref={floorRef}
            returnKeyType="next"
            onSubmitEditing={() => flatRef.current.focus()}
            style={tw`border rounded-xl px-3 py-2 ${
              fieldErrors.floor ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("example_3")}
            value={actualFormData?.floor}
            onChangeText={(val) => {
              clearFieldError("floor");
              handleChange("floor", val);
            }}
          />
          {fieldErrors.floor && (
            <Text style={tw`text-red-500 text-xs mt-1`}>
              {t("floor_required")}
            </Text>
          )}
        </View>
        {/* End Floor */}

        {/* Start Flat */}
        <View>
          <Text style={tw`mt-4 mb-1`}>{t("apartment_number")}</Text>
          <TextInput
            ref={flatRef}
            returnKeyType="next"
            onSubmitEditing={() => notesRef.current.focus()}
            style={tw`border rounded-xl px-3 py-2 ${
              fieldErrors.flat ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("example_14")}
            value={actualFormData?.flat}
            onChangeText={(val) => {
              clearFieldError("flat");
              handleChange("flat", val);
            }}
          />
          {fieldErrors.flat && (
            <Text style={tw`text-red-500 text-xs mt-1`}>
              {t("apartment_number_required")}
            </Text>
          )}
        </View>
        {/* End Flat */}

        {/* Start Note */}
        <View>
          <Text style={tw`mt-4 mb-1`}>{t("additional_notes")}</Text>
          <TextInput
            ref={notesRef}
            returnKeyType="done"
            style={tw`border rounded-xl px-3 py-2 ${
              fieldErrors.note ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t(
              "please_enter_the_address_in_detail_and_explain_a_lot"
            )}
            multiline
            value={actualFormData?.note}
            onChangeText={(val) => {
              clearFieldError("note");
              handleChange("note", val);
            }}
          />
          {fieldErrors.note && (
            <Text style={tw`text-red-500 text-xs mt-1`}>
              {t("note_required")}
            </Text>
          )}
        </View>
        {/* ENd Note */}

        {/* Start Map */}
        <View>
          <View style={tw`flex-row items-center justify-between mt-4 mb-2`}>
            <Text>{t("locate_via_map")}</Text>
            <TouchableOpacity
              onPress={getCurrentLocation}
              disabled={isLoadingLocation}
              style={tw`
                ${fieldErrors.coordinates ? "border-2 border-red-500" : ""}
                px-3 py-2 bg-blue-500 rounded-lg flex-row items-center `}
            >
              <Text style={tw`text-white text-sm`}>
                {isLoadingLocation ? t("loading") : t("current_location")}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={tw`rounded-xl overflow-hidden h-64 `}>
            <SafeMapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 36.198885302700745,
                longitude: 37.16563493013382,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              onPress={handleMapPress}
              showsCompass={true}
              rotateEnabled={true}
              scrollEnabled={true}
              zoomEnabled={true}
              markerCoord={markerCoord}
              onMapError={() => {
                console.log("Map error handled by SafeMapView");
                setMapError(true);
              }}
            />
          </View>
          {fieldErrors.coordinates && (
            <Text style={tw`text-red-500 text-xs mt-1`}>
              {t("location_required")}
            </Text>
          )}
        </View>
        {/* End Map */}

        <TouchableOpacity
          onPress={handleFormSubmit}
          style={tw`bg-green-600 py-3 px-4 rounded-xl mt-6`}
        >
          <Text style={tw`text-white text-center font-bold`}>
            {isEditMode
              ? t("update_address") || "تحديث العنوان"
              : t("save_address")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowForm(false)}
          style={tw`py-3 px-4 mt-4 border rounded-xl mb-10`}
        >
          <Text style={tw`text-center text-red-600`}>{t("hide_form")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddressFeils;
