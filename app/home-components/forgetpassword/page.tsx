"use client";
import { useState } from "react";
import { FaKey, FaLock, FaUser, FaArrowLeft } from "react-icons/fa";
import style from "@/styles/login.module.scss";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUserName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");

  const sendCode = async () => {
    setMessage("");
    const res = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        phone: phonenumber, 
      }),
    });
  
    const data = await res.json();
    if (res.ok) {
      setStep(2);
    } else {
      setMessage(data.message || "Something went wrong.");
    }
  };
  

  const resetPassword = async () => {
    setMessage("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword: password }),
    });

    const data = await res.json();
    if (res.ok) {
      setStep(3);
    } else {
      setMessage(data.message || "Failed to reset password.");
    }
  };

  return (
    <section className={`${style.body} min-h-screen flex items-center justify-center`}>
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-xl p-10 w-full max-w-sm text-center scale-[.9]">


        {step === 1 && (
          <>
            <div className="relative flex items-center justify-center mb-6">
              <Link href="../../Login" className="absolute left-0 text-blue-600 hover:underline flex items-center gap-2">
                <FaArrowLeft className="text-lg" />
              </Link>
              <h2 className="text-2xl font-bold tracking-wider">FIND ACCOUNT</h2>
            </div>
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                sendCode();
              }}
            >
              <div className="flex items-center border rounded-full px-4 py-2 bg-white">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full outline-none bg-transparent text-sm"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex items-center border rounded-full px-4 py-2 bg-white">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="User Name"
                  className="w-full outline-none bg-transparent text-sm"
                  required
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="flex items-center border rounded-full px-4 py-2 bg-white">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="number"
                  placeholder="Phone Number"
                  className="w-full outline-none bg-transparent text-sm"
                  required
                  value={phonenumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-full w-full transition"
              >
                Send Code
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="relative flex items-center justify-center mb-6">
              <Link href="../../Login" className="absolute left-0 text-blue-600 hover:underline flex items-center gap-2">
                <FaArrowLeft className="text-lg" />
              </Link>
              <h2 className="text-2xl font-bold tracking-wider">RESET PASSWORD</h2>
            </div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                resetPassword();
              }}
            >
              <div className="flex items-center border rounded-full px-4 py-2 bg-white">
                <FaKey className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Verification Code"
                  className="w-full outline-none bg-transparent text-sm"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="flex items-center border rounded-full px-4 py-2 bg-white">
                <FaLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full outline-none bg-transparent text-sm"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-full w-full transition"
              >
                Reset Password
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <p className="text-green-600 font-medium">
            Your password has been reset. You can now log in.
          </p>
        )}

        {message && <p className="text-red-500 text-sm mt-4">{message}</p>}
      </div>
    </section>

  );
}
