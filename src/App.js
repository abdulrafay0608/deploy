import "./App.css";
import { Fragment, useEffect } from "react";
import WebFont from "webfontloader";
import Home from "./components/Home/Home";
import { Route, Routes } from "react-router-dom";
import About from "./components/About/About";
import ProductDetail from "./components/Products/ProductDetail";
import { Products } from "./components/Products/Products";
import Search from "./components/Products/Search";
import Cart from "./components/Cart/Cart";
import LoginPage from "./components/User/LoginPage";
import SignupPage from "./components/User/SignupPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/User/Profile";
import store from "./app/Store";
import { loadUser } from "./features/authSlice";
import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";
import { useSelector } from "react-redux";

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
  }, []);

  return (
    <Fragment>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/about"} element={<About />} />
        <Route path={"/search"} element={<Search />} />
        <Route path={"/account"} element={<Profile />} />
        <Route path={"/account/login"} element={<LoginPage />} />
        <Route path={"/account/signup"} element={<SignupPage />} />
        <Route path={"/products"} element={<Products />} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"/products/:keyword"} element={<Products />} />
        <Route path={"/product-detail/:id"} element={<ProductDetail />} />
      </Routes>
      {/* <Footer /> */}
    </Fragment>
  );
}

export default App;
