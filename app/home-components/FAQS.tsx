"use client"

import { useEffect, useState } from "react";
import style from "@/styles/faqs.module.scss"

interface FAQItem {
    question: string;
    answer: string;
}


export default function FAQ() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);

    useEffect(() => {
        fetch('/data/faq.json')
            .then(res => res.json())
            .then(data => setFaqs(data));
    }, []);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section className=" w-[80%] m-auto p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`${style['faqBox']}  ${activeIndex === index ? style['active'] : ''} `}
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className={`w-full text-left p-4 flex justify-between items-center focus:outline-none 
                            ${activeIndex === index ? "border-b-orange-500 border-b-1" : ''}`}
                        >
                            <span className="font-medium text-gray-800 cursor-pointer">
                                {faq.question}
                            </span>
                            <svg
                                className={`w-5 h-5 transition-transform duration-200 ${activeIndex === index ? "transform rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        {activeIndex === index && (
                            <div className="px-4 py-4 text-gray-700">{faq.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
