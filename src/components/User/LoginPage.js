import React, { Fragment, useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";
import { TbMail } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/authSlice";
import { toast } from "react-toastify";
import MetaData from "../Layout/MetaData";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, error, navigate]);

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: loginEmail, password: loginPassword }));
    try {
      if (isAuthenticated) {
        navigate("/");
        toast.success("User Login Successfully");
      }
    } catch (err) {
      toast.error(error);
    }
  };

  return (
    <Fragment>
      <MetaData title={"Login - Ecommerce"} />
      <div className="h-[100vh] flex flex-col justify-center gap-6 items-center w-full my-5">
        <div className="w-[430px]">
          <div className="flex justify-center">
            <p className="border-b-4 border-orange-500 w-max  text-4xl font-bold mb-8">
              Login
            </p>
          </div>

          <form className="w-full" onSubmit={loginSubmit}>
            <div className="my-5 flex items-center gap-2 border border-black p-3 w-full">
              <TbMail size={20} />
              <input
                type="email"
                placeholder="Email"
                required
                value={loginEmail}
                className="bg-transparent outline-none w-full"
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="my-5 flex items-center gap-2 border border-black p-3 w-full">
              <FaLock />
              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                className="bg-transparent outline-none w-full"
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <p className="text-right text-sm my-8">
              <Link to="/password/forgot">Forget Password?</Link>
            </p>
            <button
              type="submit"
              className={`${
                loading
                  ? "bg-orange-200 text-gray-400"
                  : "bg-orange-400 text-black"
              } relative hover:bg-orange-500 font-semibold transition-all duration-300 bg-orange-400 text-center p-3 w-full`}
            >
              <div
                className={`${
                  loading ? "block" : "hidden"
                } absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2`}
              >
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
              Login
            </button>
          </form>

          <div className="my-5 text-sm">
            If you have no register?{" "}
            <Link to={"/account/signup"} className="text-orange-500 font-bold">
              Create account.
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginPage;
