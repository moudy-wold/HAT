import {
  Get_layout,
  Get_random_meals,
  Most_ordered_meals,
  Suggested_meals,
  Top_rated_restaurants,
} from "@/api/layout";
import ItemsPagination from "@/components/Global/ItemsPagination/ItemsPagination";
import ItemsSlider from "@/components/Global/ItemsSlider/ItemsSlider";
import useStore from "@/store/useStore";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl, View } from "react-native";
import tw from "twrnc";
import Header from "./Header/Header";

const endpointsMap: any = {
  most_ordered_meals: Most_ordered_meals,
  top_rated_restaurants: Top_rated_restaurants,
  suggested_meals: Suggested_meals,
  Get_random_meals: Get_random_meals,
};

function MainPageContent() {
  const { i18n } = useTranslation();
  const {
    visibleSections,
    categoryData,
    setVisibleSections,
    initCategoryData,
    updateCategoryData,
    clearStore,
    refreshHomeScreenData,
  } = useStore();
  const getVisibleSections = async () => {
    try {
      const res = await Get_layout();
      const filtered = res?.data?.data?.filter(
        (section: any) =>
          section.is_visible === 1 && endpointsMap.hasOwnProperty(section.key)
      );
      setVisibleSections(filtered);
    } catch (err) {
      console.error("Failed to fetch layout:", err);
    }
  };

  const loadSectionData: any = async (section: any, pageOverride: any) => {
    initCategoryData(section.key);
    const current = categoryData[section.key];
    if (current?.isLoading || current?.isFinished) return;
    updateCategoryData(section.key, { isLoading: true });
    const fetchFunction = endpointsMap[section.key];
    if (!fetchFunction) return;
    try {
      const page = pageOverride || current?.page || 1;
      const res = await fetchFunction(page);
      const newItems = res.data?.data || [];
      updateCategoryData(section.key, {
        items: [...(current?.items || []), ...newItems],
        page: page + 1,
        isLoading: false,
        isFinished: newItems.length === 0,
      });
    } catch (error) {
      console.error(`Failed to load ${section.label}:`, error);
      updateCategoryData(section.key, { isLoading: false });
    }
  };

  const checkIfNeedMoreSections = (viewableItems: any) => {
    if (visibleSections.length === 0) return;
    const loadedSectionKeys = Object.keys(categoryData);
    const lastLoadedKey = loadedSectionKeys[loadedSectionKeys.length - 1];
    const lastSectionVisible = viewableItems.some(
      (viewable: any) => viewable.item?.key === lastLoadedKey
    );
    if (
      lastSectionVisible &&
      loadedSectionKeys.length < visibleSections.length
    ) {
      const nextSection = visibleSections[loadedSectionKeys.length];
      if (nextSection) loadSectionData(nextSection);
    }
  };

  useEffect(() => {
    getVisibleSections();
  }, []);

  useEffect(() => {
    if (visibleSections.length > 0) {
      const firstTwo = visibleSections.slice(0, 2);
      firstTwo.forEach(loadSectionData);
    }
  }, [visibleSections]);

  const onRefresh = useCallback(() => {
    clearStore();
    getVisibleSections();
    console.log("from refresh");
  }, [refreshHomeScreenData]);

  const loadedSections = visibleSections.filter(
    (section: any) => categoryData[section.key]
  );

  return (
    <View
      style={[tw`mb-28`, { direction: i18n.language === "ar" ? "rtl" : "ltr" }]}
    >
      <FlatList
        ListHeaderComponent={<Header />}
        data={loadedSections}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          const sectionData = categoryData[item.key];
          if (!sectionData) return null;

          // ✨ لا تعرض القسم إذا ما فيه منتجات
          if (!sectionData.items || sectionData.items.length === 0) {
            return null;
          }

          return item.layout === "horizontal" ? (
            <ItemsSlider
              url={""}
              title={item.label}
              direction={item.layout}
              data={sectionData.items}
              meal={item.key !== "top_rated_restaurants"}
              isLoading={sectionData.isLoading}
              onEndReached={() => loadSectionData(item, sectionData.page)}
            />
          ) : (
            <ItemsPagination
              url={""}
              title={item.label}
              direction={item.layout}
              data={sectionData.items}
              meal={item.key !== "top_rated_restaurants"}
              isLoading={sectionData.isLoading}
              onEndReached={() => loadSectionData(item, sectionData.page)}
            />
          );
        }}
        initialNumToRender={2}
        maxToRenderPerBatch={5}
        windowSize={10}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            colors={["#2196f3"]}
          />
        }
        onViewableItemsChanged={({ viewableItems }) => {
          checkIfNeedMoreSections(viewableItems);
        }}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    </View>
  );
}

export default MainPageContent;
