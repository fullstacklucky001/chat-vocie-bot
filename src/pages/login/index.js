import React, { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import axios from "axios";

// const SERVER_URL = 'https://rick-chat-bot.onrender.com'
const SERVER_URL = 'http://localhost:5001'

function Login() {
  const navigate = useNavigate();

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  let handleEmail = (e) => {
    setEmail(e.target.value);
  };

  let handlePassword = (e) => {
    setPassword(e.target.value);
  };

  let handleSingIn = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Enter your email or name.')
      return
    }
    if (!password) {
      toast.error('Enter your password.')
      return
    }

    axios.post(SERVER_URL + '/login', {
      username: email,
      password: password
    }).then((res) => {
      if (res.data === "username") {
        toast.error("Username is incorrect.");
        return
      }

      if (res.data === "password") {
        toast.error("Password is incorrect.");
        return
      }

      if (res.data === "success") {
        localStorage.setItem('login', 'success')
        navigate('/home')
        toast.success("Sign in successfully.");
        return
      }
    })
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