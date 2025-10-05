import React, { useState } from "react";
import { FaThreads } from "react-icons/fa6";
import api from "../../../api/ServerApi";

function LoginSignup({ setUser }) {
  // State to toggle between Login and Signup forms (default to Login)
  const [isLogin, setIsLogin] = useState(true);

  // State to manage form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
  });

  const { username, email, password, fullname } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Login attempt with:", { email, password });
      // TODO: Implement API call to /mthreads/users/login
      const res = await api.post(`/mthreads/users/login`, { email, password });
      console.log("Registration attempt with:", {
        username,
        email,
        password,
        fullname,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    } else {
      // TODO: Implement API call to /mthreads/users/register
      const res = await api.post(`/mthreads/users/register`, {
        username,
        email,
        password,
        fullname,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
  };

  const commonInputClass =
    "w-full p-3 my-2 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
  const buttonClass =
    "w-full p-3 mt-4 rounded-lg font-semibold transition-colors duration-200";

  return (
    <div className="w-full h-dvh bg-zinc-950 flex flex-col justify-center items-center text-zinc-200">
      {/* App Logo/Header */}
      <div className="text-4xl font-bold mb-8 flex items-center gap-2">
        Thre
        <FaThreads className="inline" />
        ds
      </div>

      {/* Login/Signup Card - Styled similarly to PostDisplayCard */}
      <div className="w-11/12 max-w-sm bg-zinc-900/80 backdrop-blur-md rounded-2xl p-6 border border-zinc-800/50 shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        <form onSubmit={onSubmit}>
          {/* Registration Fields (Show only on Signup) */}
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                name="fullname"
                value={fullname}
                onChange={onChange}
                className={commonInputClass}
                required
              />
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={onChange}
                className={commonInputClass}
                required
              />
            </>
          )}

          {/* Common Fields */}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={onChange}
            className={commonInputClass}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            className={commonInputClass}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className={`${buttonClass} ${
              isLogin
                ? "bg-white text-zinc-950 hover:bg-zinc-200"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Toggle Link */}
        <p className="mt-4 text-center text-sm text-zinc-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            className="text-white font-semibold cursor-pointer ml-1 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;
