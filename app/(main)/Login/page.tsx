"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // <-- ADD THIS
import { FaUser, FaLock } from "react-icons/fa";
import style from "@/styles/login.module.scss";
import RegisterModal from "./reg-component/RegisterModal";
import Link from "next/link";

export default function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showRegister, setShowRegister] = useState(false);
    const router = useRouter(); // <-- INIT HERE

    return (
        <>
            <section className={`${style.body}`}>
                <div className="min-h-screen flex items-center justify-center bg-[url('/images/bg-pattern.jpg')] bg-cover">
                    <div className="bg-white bg-opacity-90 rounded-3xl shadow-xl p-10 w-full max-w-sm text-center scale-[.9]">
                        <h2 className="text-2xl font-bold mb-6 tracking-wider">LOG IN</h2>
                        <form
                            className="space-y-5"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const res = await fetch("/api/login", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ email, password }),
                                });
                                const data = await res.json();
                                if (data.success) {
                                    alert("Login successful!");
                                    router.push("../User-Main"); // <-- REDIRECT TO PROFILE
                                } else {
                                    alert(data.message || "Login failed");
                                }
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
                                <Link href={'../home-components/forgetpassword'} className="text-blue-700 hover:underline">
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
        </>
    );
}
