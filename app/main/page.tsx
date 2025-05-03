"use client"

import ActiveAlertsSection from "../User-Main/user-home/user-alert/page";
import About from "../home-components/about";
import AdminAnnouncementPage from "../home-components/AnnouncementSection";
import FAQ from "../home-components/FAQS";
import FirstSecClient from "../home-components/firstSecClient";
import MissionVision from "../home-components/MissionVision";



export default function HomePage() {
  return (
    <>
    <main className="relative">
      <FirstSecClient/>
      <div className="w-[80%] mx-auto">
        <ActiveAlertsSection/>
      </div>
      <AdminAnnouncementPage />
      <FAQ/>
      <About/>
      <MissionVision/>
      </main>
    </>
  );
}
