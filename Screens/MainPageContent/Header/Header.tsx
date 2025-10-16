import { GetAllMainCategories } from "@/api/category";
import { Get_offer_slider } from "@/api/offer";
import AdsSlider from "@/components/Global/AdsSlider/AdsSlider";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import tw from "twrnc";
import ActiveOrder from "../ActiveOrder/ActiveOrder";
import MainCategories from "../MainCategoris/MainCategories";
import SearchComponent from "../SearchComponent/SearchComponent";

function Header() {
  const [mainCategoriesData, setMainCategoriesData] = useState([]);
  const [offer_slider_Data, set_offer_slider_data] = useState([]);

  const getOfferSliderData = async () => {
    try {
      const res = await Get_offer_slider();
      set_offer_slider_data(res?.data?.data);
    } catch (err: any) {
      console.error(err);
    }
  };
  const getMainCateData = async () => {
    try {
      const res = await GetAllMainCategories();
      setMainCategoriesData(res.data.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMainCateData();
    getOfferSliderData();
  }, []);

  return (
    <View style={tw`mb-3`}>
      {/* Start ADS */}
      <View style={tw``}>
        <AdsSlider data={offer_slider_Data} />
      </View>
      {/* End ADS */}
      {/* Start Active Order */}
      <View style={tw``}>
        <ActiveOrder />
      </View>
      {/* End Active Order */}
      <View style={tw`px-3`}>
        {/* Start Search Input */}
        <View style={tw`mb-5`}>
          <SearchComponent />
        </View>
        {/* End Search Input */}
        {/* Start Main Categories */}
        <View>
          <MainCategories data={mainCategoriesData} />
        </View>
        {/* End Main Categories */}
      </View>
    </View>
  );
}

export default Header;
