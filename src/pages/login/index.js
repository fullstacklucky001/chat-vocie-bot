import React, { useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { AiOutlineClose } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

function Login() {
  const navigate = useNavigate();

  // ======================
  let [loading, setLoading] = useState(false);
  let [success, setSuccess] = useState("");

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  let [emailErr, setEmailErr] = useState(false);
  let [passwordErr, setPasswordErr] = useState(false);

  let handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailErr("");
  };

  let handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordErr("");
  };

  let handleSingIn = (e) => {
    e.preventDefault();
    if (!email) {
      setEmailErr(true);
    }
    if (!password) {
      setPasswordErr(true);
    }

    setLoading(true);

    if (password === '123') {
      localStorage.setItem('login', 'success')
      navigate('/home')
      toast.success("Sign in successfully.");
    } else {
      setPasswordErr(true)
    }
  };

  return (
    <div className="flex" style={{ minHeight: '600px' }}>
      <ToastContainer position="top-left" theme="dark" />
      <div className="flex flex-col justify-center flex-1 max-w-xl min-h-full px-6 py-12 m-auto lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="w-auto h-20 mx-auto"
            src="favicon.png"
            alt="Your Company"
          />
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
            Sign in Chat Companion
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  focus:ring-indigo-600 focus: outline-none focus:ring-2 sm:text-sm sm:leading-6"
                onChange={handleEmail}
              />
            </div>
            {emailErr &&
              <p className="text-red-700">*Please enter valid email address.</p>
            }
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus: outline-none focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handlePassword}
              />
            </div>
            {passwordErr &&
              <p className="text-red-700">*Please enter valid password.</p>
            }
          </div>
          <div className="flex mt-6">
            <button
              className="flex justify-center m-auto rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white font-semibold leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSingIn}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
