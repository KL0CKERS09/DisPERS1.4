'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';


interface AboutItem {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
}

const About: React.FC = () => {
    const [aboutItems, setAboutItems] = useState<AboutItem[]>([]);

    useEffect(() => {
        const fetchAboutData = async () => {
            const response = await fetch('/data/about.json');
            const data = await response.json();
            setAboutItems(data);
        };

        fetchAboutData();
    }, []);

    return (
        <section className="fifth-container w-11/12 max-w-7xl mx-auto py-12 scale-[.8]">
            <div className="guide-container">
                <div className="guide-holder flex flex-col space-y-20">
                    {aboutItems.map((item) => (
                        <div
                            key={item.id}
                            className="about-safenet grid grid-cols-1 md:grid-cols-2 gap-12 items-center "
                        >
                            <div className="guide-image-holder w-full">
                                <Image
                                    className="w-[80%] mx-auto rounded-3xl shadow-[0_0_20px_#a6a6a6]  "
                                    src={item.image}
                                    alt={item.title}
                                    width={500}
                                    height={300}
                                />
                            </div>
                            <div className="guide-description-holder flex flex-col justify-center px-4">
                                <h1 className="text-3xl font-semibold mb-4">{item.title}</h1>
                                <p className="text-gray-700 mb-8">{item.description}</p>
                                <div className="flex justify-end">
                                    <Link
                                        className="py-3 px-6 bg-[#4E709D] rounded-3xl text-white hover:shadow-[0_0_10px_rgba(0,0,255,0.5)] transition-shadow"
                                        href={"/main/about"}
                                    >
                                        See More...
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    );
};

export default About;
