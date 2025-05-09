"use client"

import HomePage from "./main/page";
import Footer from "./home-components/Footer";
import Navbar from "./home-components/navbar";
import { useState, useEffect } from "react";
import LoadingSpinner from "./loading";

export default function Home() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin-alert')
      .then((res) => res.json())
      .then((data) => {
        setAlerts([...data.alerts].reverse());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <main className="relative">
        <Navbar />
        <HomePage />
        <Footer />
      </main>
    </>
  );
}
