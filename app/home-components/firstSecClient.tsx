"use client";

import Image from "next/image";
import Link from "next/link";
import style from "@/styles/firstSec.module.scss";
import { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';

import FirstImage from "@/public/1st-sec-1st-pic.jpg";
import SecondImage from "@/public/1st-sec-2nd-pic.jpg";
import ThirdImage from "@/public/1st-sec-3rd-pic.jpg";
import FourthImage from "@/public/1st-sec-4th-pic.jpg";
import FifthImage from "@/public/1st-sec-5th-pic.jpg";
import SixthImage from "@/public/1st-sec-6th-pic.jpg";

type SlideContent = {
    title: string;
    text: string;
    showButton: boolean;
};

export default function FirstSecClient() {
    const slideHolderRef = useRef<HTMLDivElement>(null);
    const slidesRef = useRef<NodeListOf<HTMLDivElement>>();
    const currentSlide = useRef(0);
    const autoSlideInterval = useRef<NodeJS.Timeout | null>(null);

    const [slideContent, setSlideContent] = useState<SlideContent[]>([]);
    const images = [
        FirstImage,
        SecondImage,
        ThirdImage,
        FourthImage,
        FifthImage,
        SixthImage,
    ];

    const updateSlidePosition = () => {
        if (!slidesRef.current || !slideHolderRef.current) return;
        const slideWidth = slidesRef.current[0].clientWidth;
        slideHolderRef.current.style.transform = `translateX(-${currentSlide.current * slideWidth
            }px)`;
    };

    const goToSlide = (direction: "forward" | "backward") => {
        const totalSlides = slidesRef.current?.length || 0;

        if (direction === "forward") {
            currentSlide.current = Math.min(
                currentSlide.current + 1,
                totalSlides - 1
            );
        } else {
            currentSlide.current = Math.max(currentSlide.current - 1, 0);
        }

        if (autoSlideInterval.current) {
            clearInterval(autoSlideInterval.current);
        }

        updateSlidePosition();
    };

    useEffect(() => {
        if (!slideHolderRef.current) return;

        slidesRef.current = slideHolderRef.current.querySelectorAll(
            `.${style.slides}`
        );
        const totalSlides = slidesRef.current.length;

        const moveToNextSlide = () => {
            currentSlide.current = (currentSlide.current + 1) % totalSlides;
            updateSlidePosition();
        };

        autoSlideInterval.current = setInterval(moveToNextSlide, 5000);
        return () => clearInterval(autoSlideInterval.current!);
    }, []);

    useEffect(() => {
        const fetchSlideContent = async () => {
            try {
                const res = await fetch(
                    `${window.location.origin}/data/slideContent.json`
                );
                const data = await res.json();
                setSlideContent(data);
            } catch (error) {
                console.error("Failed to fetch slide content:", error);
            }
        };
        fetchSlideContent();
    }, []);

    return (
        <section className={`${style.firstContainer}`}>
            <div className={`${style["slide-container"]}`}>
                <div className={`${style["slide-holder"]}`} ref={slideHolderRef}>
                    {images.map((img, index) => (
                        <div className={`${style.slides}`} key={index}>
                            <div className={`${style.background}`}>
                                <Image src={img} width={0} height={0} alt="" />
                            </div>
                            <div className={`${style["main-container-absolute"]}`}>
                                <div className={`${style["headline-title"]}`}>
                                    <h1>{slideContent[index]?.title || ""}</h1>
                                </div>
                                <div className={`${style["headline-subtext"]}`}>
                                    <p>{slideContent[index]?.text || ""}</p>
                                </div>
                                {slideContent[index]?.showButton && (
                                    <div className={`${style["registration-btn"]}`}>
                                        <Link className={`${style[`reg-button`]}`} href={"../Login"}>
                                            <Image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADtUlEQVR4nO2aSWgUQRSGyySKYMRbDCJe9aKYxODFXARjjATcySIRPAieJI6oBw9BFKJZjIiKB8WDGhe8efWcg3EDFVGMWYxRFA+JYlziJ8W8gUrZPdPp6Sw19gcNQ03Pq3r9ql799XqUiomJiYmJiYmJiYmJiZl6gDlAGdAANMmlP5fq71SuAhQDncAQ/ujvzgCLVY5F/DDwleCMAoecnxHAfKDLw8FhaW8HOuSzbrO5oW0ohyPfZTnUA1QCeR735wEbgUceD8G9mUBy2pvoSOcH+F2B5AqThHIJoAgYMRxoD2HjrJUTipUrMDGCPUEi7zMTzOXQoRxa+0PGwCuzsFVl2HnnRC4A1hiDfu+V8CZhSyfGD4a9UjXbAeqNAXdFYO+WYa9WzXZICpgUrRHYa3NqNwASxoDbIrCnxVKKg2q2A9T970ugzBjwcARJ8KNhr0Q5uA1WZWGr2rAz6MQ2qJEjbQotZgpUOCH0JBs1OZukcGcIG+csKexWjYCJ2yGi7QsCRt50XtOkXINkLtBHWazlUJXmOFxtTXvNNWfWvk9BxH4IiLy9KUfkDtnqzGyf4rqzBRFrJiRkHQdlRIqlbkbeC53EJNr6VOfHoCi/IpWrkJwRJaIYU2XxOmnLnYjHxMT8AzAPKAd2AfuAI3IdkDywFliocglgJXASeAD8CLAF/gaeSiGkwsnECMwF9gLPyJ6LyiWA3cAbH2f+AC+Bu8AloEUurQ/uiAz+Zf3mRYCHXSvK8i3wXa4+adM1ynnT4fgS4J6H06Oi52uARQHsLAA2AZeBbmBbmnu3AK8DzCIdkO2RO50C2AB8sTr9JAmuUE2NmDouM2oytIZ5SZMWYA/w0+hkXAoikTtu9NlMeNqiHMh+Kwr9OnNH1oF3n5tDRN5mZxQDqZEtK8VjnQci8dK/z3ydFNM4prfPpcByCYYfvVklRmCV9Y+P7ukQMJL00nHUuNeuKtnUhx1EgbzxNTPstBxfgSsZnEr4vFHyItw7C+CYYeSbnm5ROpmhby9hpdtOiZ6osHJFi2R+rQ9sesMMIE+cnpFiJfDZcmI8yOwDVns8AC2WJi+zgYdi4H42b33C4KE1xoOUy30ewFjYB1AIrJuJYiXw3GcJNIvoKjfuXS9tJ3yWQJ9yDeAq0SXB28o1tJ6PcBtsVK4hW/CrDEJoGbACGEhzX7+z7xuArWRPg3IZ4HQWzp9XrkPyTJApyXlxQRdQVK4A7JCDTSYGnJ/2GSrN9VZJbEwSnS6zNTqb8NQ08BdIVLLl+fnD9QAAAABJRU5ErkJggg==" width={24} height={24} alt="" />    REGISTER HERE
                                        </Link>
                                        <Link href="../AnonymousReport" className={style["button"]}>
                                            <FontAwesomeIcon icon={faUserSecret} className="w-5 h-5 mr-2" />
                                            REPORT ANONYMOUSLY
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => goToSlide("backward")}
                    className={`left-0 top-[50%] ${style.leftNavBtn}`}
                >
                    <Image className="w-[4vw]" width="50" height="50" src={'/double-left-64.png'} alt="double-left" />
                </button>
                <button
                    onClick={() => goToSlide("forward")}
                    className={`right-0 top-[50%] ${style.rightNavBtn}`}>
                    <Image className="rotate-180 m-auto w-[4vw]" width={50} height="50" src={'/double-left-64.png'} alt="double-left" />
                </button>
            </div>
        </section>
    );
}
