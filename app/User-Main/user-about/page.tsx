"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaLightbulb, FaShieldAlt, FaHandsHelping } from "react-icons/fa";

const icons = {
  Innovation: <FaLightbulb className="text-[#FF5632]" size={40} />,
  Integrity: <FaShieldAlt className="text-[#FF5632]" size={40} />,
  Impact: <FaHandsHelping className="text-[#FF5632]" size={40} />,
};

type AboutData = {
  story: {
    title: string;
    text: string;
    image: string;
  };
  values: {
    title: "Innovation" | "Integrity" | "Impact";
    text: string;
  }[];
  team: {
    name: string;
    role: string;
    image: string;
  }[];
};

export default function About() {
  const [data, setData] = useState<AboutData | null>(null);

  useEffect(() => {
    fetch("/data/aboutPage.json")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <section className="px-6 py-12 max-w-7xl mx-auto space-y-12 text-center">
      <div className="py-[2em]">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-gray-600 w-[80%] mx-auto">
          We are committed to improving community resilience through innovative digital solutions for disaster preparedness and emergency response. With a focus on simplicity, reliability, and accessibility, we aim to empower barangays and local authorities with the tools they need to protect lives and respond swiftly in times of crisis.
        </p>
      </div>

      <div className="w-[80%] mx-auto flex flex-col lg:flex-row items-center gap-8">
        <div className="lg:w-1/2 text-left">
          <h2 className="text-2xl font-semibold mb-4">{data.story.title}</h2>
          <p className="text-gray-700 text-[.8rem]">{data.story.text}</p>
        </div>
        <div className="rounded-2xl shadow-lg overflow-hidden aspect-video w-full max-w-[500px]">
          <iframe
            src="https://www.youtube.com/embed/Oxx4U_Hv-T0"
            title="DisPERS Introduction Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {data.values.map((val, i) => (
            <div
              key={i}
              className="bg-white p-6 shadow rounded-lg text-left flex flex-col items-start"
            >
              <div className="bg-orange-100 p-3 rounded-full">
                {icons[val.title]} {/* No need for type assertion */}
              </div>
              <h3 className="font-bold mt-4 mb-2 text-lg text-[#FF5632]">
                {val.title}
              </h3>
              <p className="text-sm text-gray-600">{val.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {data.team.map((member, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="relative w-[150px] h-[150px] mx-auto">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="rounded-full object-cover shadow"
                />
              </div>
              <h4 className="font-semibold">{member.name}</h4>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}