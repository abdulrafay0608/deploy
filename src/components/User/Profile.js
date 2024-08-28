import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import MetaData from "../Layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/account/login");
    }
  }, [navigate, isAuthenticated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"My Profile - Ecommerce"} />
          <div className="h-[100vh] flex flex-col justify-center gap-6 items-center w-full my-5">
            <div className="w-[430px]">
              <div className="">
                <p className="border-b-4 border-orange-500 w-max  text-4xl font-bold mb-12">
                  My Profile
                </p>
              </div>

              <div className="w-full">
                <div className="flex flex-col justify-center items-center">
                  <img
                    className="h-[220px] w-[220px] object-cover rounded-full"
                    src={
                      user?.avatar.url
                        ? user?.avatar.url
                        : " https://madiavto.ru/files/default_images/noavatar.png"
                    }
                    alt=""
                  />
                  <Link
                    to={"update"}
                    className={`bg-orange-400 text-black relative hover:bg-orange-500 font-semibold transition-all duration-300 text-sm text-center p-2 px-6 mt-6`}
                  >
                    Edit Profile
                  </Link>
                </div>
                <div className="my-6 flex items-center gap-2 border border-black p-3 w-full">
                  <label className="text-nowrap">Full Name:</label>
                  <input
                    type="text"
                    value={user?.name}
                    className="bg-transparent outline-none w-full"
                    // onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="my-6 flex items-center gap-2 border border-black p-3 w-full">
                  <label className="text-nowrap"> Email Address:</label>
                  <input
                    type="email"
                    value={user.email}
                    className="bg-transparent outline-none w-full"
                    // onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <div className="my-6 flex items-center gap-2 border border-black p-3 w-full">
                  <label className="text-nowrap">Joined On:</label>
                  <input
                    type="text"
                    value={user.createdAt.substring(0, 10)}
                    className="bg-transparent outline-none w-full"
                    // onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <div className="my-6 flex justify-center items-center gap-6 w-full">
                  <Link
                    to={"/order"}
                    className={`relative hover:bg-orange-500 font-semibold transition-all duration-300 bg-orange-400 text-sm text-center p-2 px-6 w-full`}
                  >
                    My Order
                  </Link>
                  <Link
                    to={"/password/update"}
                    className={`relative hover:bg-orange-500 font-semibold transition-all duration-300 bg-orange-400 text-sm text-center p-2 px-6 w-full`}
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
