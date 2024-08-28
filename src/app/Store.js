import { configureStore } from "@reduxjs/toolkit";
import productSlice from "../features/productSlice";
import productDetailSlice from "../features/productDetailSlice";
import authSlice from "../features/authSlice";

const store = configureStore({
  reducer: {
    products: productSlice,
    productDetail: productDetailSlice,
    user: authSlice,
  },
});

export default store;
