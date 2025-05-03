"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import style from "@/styles/login.module.scss";
import RegisterModal from "./reg-component/RegisterModal";
import Link from "next/link";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      setModalMessage("Login successful!");
      setMessageType("success");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(true);
        router.push("../User-Main");
      }, 1500);
    } else {
      setModalMessage(data.message || "Login failed");
      setMessageType("error");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 1500);
    }
  };

  return (
    <>
      <section className={`${style.body}`}>
        <div className="min-h-screen flex items-center justify-center bg-[url('/images/bg-pattern.jpg')] bg-cover">
          <div className="bg-white bg-opacity-90 rounded-3xl shadow-xl p-10 w-full max-w-sm text-center scale-[.9]">
            <h2 className="text-2xl font-bold mb-6 tracking-wider">LOG IN</h2>

            <form className="space-y-5" onSubmit={handleLogin}>
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
                <FaLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full outline-none bg-transparent text-sm"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="text-left text-sm">
                <Link href="../home-components/forgetpassword" className="text-blue-700 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-full w-full transition"
              >
                Login
              </button>
            </form>

            <div className="text-sm mt-3">
              <button
                onClick={() => setShowRegister(true)}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Don’t have an account yet?
              </button>
            </div>
          </div>
        </div>
      </section>

      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 bg-opacity-40 flex items-center justify-center z-1000">
        <div className="fixed left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg px-6 py-3 z-50">
          <p
            className={`text-sm font-medium ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {modalMessage}
          </p>
        </div>
        </div>
      )}
    </>
  );
}
