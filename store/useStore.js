import { create } from "zustand";

const useStore = create((set, get) => ({
  isLogined: false,
  wishList_length: 0,
  wishList_ids: [],
  cart_length: 0,
  refreshCart: false,
  visibleSections: [],
  categoryData: {},
  refreshHomeScreenData: false,
  ratingModal: false,

  setRatingModal: (value) => set({ ratingModal: value }),
  setRefreshHomeScreenData: () =>
    set({ refreshHomeScreenData: !get().refreshHomeScreenData }),
  setVisibleSections: (sections) => set({ visibleSections: sections }),

  initCategoryData: (categoryId) => {
    const current = get().categoryData;
    if (!current[categoryId]) {
      set({
        categoryData: {
          ...current,
          [categoryId]: {
            items: [],
            page: 1,
            isLoading: false,
            isFinished: false,
          },
        },
      });
    }
  },

  updateCategoryData: (categoryId, newData) => {
    set({
      categoryData: {
        ...get().categoryData,
        [categoryId]: {
          ...get().categoryData[categoryId],
          ...newData,
        },
      },
    });
  },
  clearStore: () =>
    set(() => ({
      visibleSections: [],
      categoryData: {},
    })),
  setIsLogined: () => set((state) => ({ isLogined: !state.isLogined })),

  set_wishList_ids: (items) =>
    set(() => ({
      wishList_ids: items,
    })),

  set_wishList_length: (length) => set(() => ({ wishList_length: length })),

  set_cart_length: (updater) =>
    set((state) => ({
      cart_length:
        typeof updater === "function" ? updater(state.cart_length) : updater,
    })),

  set_cart_length_manual: (value) =>
    set(() => ({
      cart_length: value,
    })),

  setRefreshCart: (value) => set(() => ({ refreshCart: value })),
}));

export default useStore;
