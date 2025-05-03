"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AlertModal from "./alertModal";
import style from "@/styles/secondSec.module.scss";

export default function SecondSection() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/alerts`, {
                    cache: "no-store",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch alerts.");
                const data = await res.json();
                setAlerts(data.alerts);
            } catch (error) {
                console.log("FETCH ERROR:", error);
                setAlerts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    if (loading) {
        return (
            <section className="second-container w-full flex justify-center items-center h-64">
                <p className="text-gray-500">Loading alerts...</p>
            </section>
        );
    }

    return (
        <section className="second-container w-full flex justify-center">
            <div className="alert-container w-[80%] flex flex-col">
                <div className="alert-title h-[5em] w-full flex justify-center items-center text-red-600">
                    <h1 className="text-3xl font-semibold">ALERTS</h1>
                </div>

                <div className="w-full">
                    <ul className={`${style.shadowInner} alert-grid-container w-full  
                        ${expanded ? `h-fit overflow-visible ${style.hideBefore}` : "max-h-[500px] overflow-hidden"} 
                        ${style.resizingGrid} gap-5 transition-all duration-300 ease-in-out`}>
                        {alerts.length > 0 ? (
                            alerts.map((t) => (
                                <li
                                    className={`${style[`li-indiv`]} max-w-[300px] bg-[#5C5A59]/60 flex flex-col items-center justify-start rounded-3xl overflow-hidden hover:scale-[1.05] transition-[500ms]`}
                                    key={t._id}
                                >
                                    <div className="report-image-holder w-full bg-blue-400 min-h-[15em] max-h-[15em] overflow-hidden">
                                        <Image
                                            src={t.img}
                                            alt={t.title}
                                            width={300}
                                            height={200}
                                            className="object-cover h-full w-full"
                                        />
                                    </div>
                                    <div className="w-[80%] py-5">
                                        <div className="report-title-holder min-h-[3em] flex items-center">
                                            <h1 className="text-white text-xl font-bold">{t.title}</h1>
                                        </div>
                                        <div className="report-descrip-holder min-h-[2em] max-h-[2em] overflow-hidden">
                                            <Link className="text-white text-xs" href="/">
                                                {t.description}
                                            </Link>
                                        </div>
                                        <div className="min-h-[3em] flex justify-between items-center">
                                            <label className="text-xs text-[#E0E0E0]">
                                                {new Date(t.createdAt).toLocaleDateString()}
                                            </label>
                                            <button
                                                onClick={() => setSelectedAlert(t)}
                                                className="w-[6em] h-[2.25em] bg-white text-[#333] text-[.9rem] rounded-xl hover:underline hover:cursor-pointer"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No alerts found.</p>
                        )}
                    </ul>
                </div>

                <div className="alert-show-more">
                    <div className="show-more-btn-holder w-full flex justify-center">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className={`transition-transform cursor-pointer duration-300 flex flex-col items-center ${style["button"]}`}
                        >
                            <Image
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBElEQVR4nO2WOw7CQAwFcwkQnNaFny8GVRA0UHAcKKBCipLd9U/CU8fSjtZJZpqKoiiKQhFmPgG4EtF+SgYR7Zn5BuC8+jCAC4AXMz8yydBH4vE927w6ICI7APfvwBPA0eWkDWciokPXYKSM9EpkkpFRiQwyoiURKSPaEhEyYiXhKSPWEh4ybhKWMu4SFjJhEpoyphLcEI0//dPUZj2zZBmNAwcamZlNVqZlpmedxDMat8y4SljJhEhoy4RKaL7MHh8Dl5sJvQlNmTQSo2sWuk5LVDQuUNGYZc3Cb8Lipxku4RWNrlhFYwja0RiKVjSmYDQaU9EbjSlpjcbUbI3GoiiK/+INpVdbjree1BIAAAAASUVORK5CYII="
                                alt="Show more"
                                width={30}
                                height={30}
                                className={`hover:scale-[1.1] transition-transform duration-300 ${style["expandBtn"]} ${expanded ? "rotate-180" : "rotate-0"}`}
                            />
                            <span className={`${style["span"]} text-gray-600 hover:font-bold cursor-pointer`}>
                                See More
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <AlertModal isOpen={!!selectedAlert} alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
        </section>
    );
}
