import React, { Fragment } from "react";
import { FaBars, FaFacebookF } from "react-icons/fa";
// import { FaLinkedinIn } from "react-icons/fa";
// import { IoMdMail } from "react-icons/io";
import { TbBrandGithubFilled, TbSearch } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../features/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const { user, error, isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const LogoutFunc = () => {
    try {
      dispatch(logoutUser());
      toast.success("User Logout Successfully");
      navigate("/account/login");
    } catch (err) {
      toast.error(error);
    }
  };

  return (
    <header className="fixed top-0 w-full mx-auto text-sm bg-white/60">
      {/* <div className="relative flex justify-center items-center bg-blue-600 p-2 px-5 w-full">
        <div className="absolute left-12 flex self-start top-1/2 -translate-y-1/2 gap-3 items-start">
          <div className="bg-white p-1 rounded-full text-blue-600">
            <FaFacebookF size={16} />
          </div>
          <div className="bg-white p-1 rounded-full text-blue-600">
            <FaLinkedinIn size={16} />
          </div>
          <div className="bg-white p-1 rounded-full text-blue-600">
            <IoMdMail size={16} />
          </div>
          <div className="bg-white p-1 rounded-full text-blue-600">
            <TbBrandGithubFilled size={16} />
          </div>
        </div>
        <div className="">
          <p className="text-sm text-white">
            &lt;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            This is an Official Store of Apna Bazaar
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &gt;
          </p>
        </div>
      </div> */}
      <nav className="relative flex justify-between items-center px-10 h-[80px]">
        <div className="flex items-center gap-3">
          <FaBars size={25} />
          <h1 className="text-3xl  font-[900]">Ecommerce</h1>
        </div>
        <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 text-sm">
          <NavLink to={"/"}>Home</NavLink>
          <NavLink to={"/about"}>About</NavLink>
          <NavLink to={"/products"}>Products</NavLink>
          <NavLink to={"/contact"}>Contact</NavLink>
        </div>
        <div className="relative flex items-center gap-8">
          <div className="search-box">
            <button className="btn-search">
              <TbSearch className="searchIcon" size={18} />
            </button>
            <input
              type="text"
              className="input-search"
              placeholder="Search..."
            />
          </div>

          {isAuthenticated ? (
            <Fragment>
              <ul className="profile-img relative order-2">
                <NavLink className="" to={"/"}>
                  <img
                    className="h-10 w-10 object-cover rounded-full"
                    src={
                      user.avatar.url
                        ? user.avatar.url
                        : "https://madiavto.ru/files/default_images/noavatar.png"
                    }
                  />
                </NavLink>
                <ul className="profile-option">
                  {user.role === "admin" ? (
                    <>
                      <NavLink className="" to={"/dashborad"}>
                        Dashboard
                      </NavLink>
                      <NavLink className="" to={"/order"}>
                        Order
                      </NavLink>
                      <NavLink className="" to={"/account"}>
                        Profile
                      </NavLink>
                      <NavLink className="" onClick={LogoutFunc} to={"/"}>
                        Logout
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink className="" to={"/order"}>
                        Order
                      </NavLink>
                      <NavLink className="" to={"/account"}>
                        Profile
                      </NavLink>
                      <NavLink className="" onClick={LogoutFunc} to={"/"}>
                        Logout
                      </NavLink>
                    </>
                  )}
                </ul>
              </ul>
            </Fragment>
          ) : (
            <NavLink className="" to={"/account/login"}>
              Account
            </NavLink>
          )}
          <NavLink to={"/"}>
            Cart<sup>(0)</sup>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;
