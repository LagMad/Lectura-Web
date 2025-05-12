import React, { useState, useRef } from "react";
import BukuHomeCard from "../../Components/ui/BukuHomeCard";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";

import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const BukuMinggu = () => {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const dataBuku = [
        {
            image: "/silat.png",
            penulis: "A. Fuadi",
            judul: "Buku Ayo Berlatih Silat. Let's Practice Silat",
        },
        {
            image: "/mie-ayam.png",
            penulis: "Brian Khrisna",
            judul: "Buku Seporsi Mie Ayam Sebelum Mati",
        },
        {
            image: "/laut-bercerita.png",
            penulis: "Leila S. Chudori",
            judul: "Buku Laut Bercerita",
        },
        {
            image: "/raksasa-laut.png",
            penulis: "Maya Lestari",
            judul: "Buku Smong, Si Raksasa Laut. Smong the Dragon",
        },
        {
            image: "/silat.png",
            penulis: "A. Fuadi",
            judul: "Buku Ayo Berlatih Silat. Let's Practice Silat",
        },
        {
            image: "/silat.png",
            penulis: "A. Fuadi",
            judul: "Buku Ayo Berlatih Silat. Let's Practice Silat",
        },
        {
            image: "/mie-ayam.png",
            penulis: "Brian Khrisna",
            judul: "Buku Seporsi Mie Ayam Sebelum Mati",
        },
        {
            image: "/laut-bercerita.png",
            penulis: "Leila S. Chudori",
            judul: "Buku Laut Bercerita",
        },
        {
            image: "/raksasa-laut.png",
            penulis: "Maya Lestari",
            judul: "Buku Smong, Si Raksasa Laut. Smong the Dragon",
        },
        {
            image: "/silat.png",
            penulis: "A. Fuadi",
            judul: "Buku Ayo Berlatih Silat. Let's Practice Silat",
        },
    ];

    // Function to get slides per view based on screen width
    const getSlidesPerView = () => {
        if (typeof window !== "undefined") {
            const width = window.innerWidth;
            if (width < 640) return 1; // Mobile
            if (width < 768) return 2; // Small tablets
            if (width < 1024) return 3; // Tablets
            if (width < 1280) return 4; // Small laptops
            return 5; // Large screens
        }
        return 5; // Default for SSR
    };

    const slidesPerView = getSlidesPerView();
    const totalPages = Math.ceil(dataBuku.length / slidesPerView);

    return (
        <div className="container">
            <div className="flex flex-col justify-center items-start gap-5 sm:gap-8 lg:gap-10 w-full p-5 sm:p-8 lg:p-10 pb-10 sm:pb-16 lg:pb-24 bg-[#EFF6FF] rounded-xl sm:rounded-2xl">
                <div className="flex flex-col justify-center items-center gap-3 sm:gap-4 lg:gap-5 w-full">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold w-full text-center">
                        Buku Terlaris Minggu Ini
                    </h2>
                    <hr className="h-0.5 bg-black w-2/3 sm:w-1/2 lg:w-1/3 self-center rounded-full" />
                    <p className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 text-center text-sm sm:text-base leading-tight">
                        Lagi rame dibaca! Buku-buku ini lagi jadi incaran para
                        pembaca e-library minggu ini. Sudah baca belum?
                    </p>
                </div>

                <div className="w-full flex flex-col lg:flex-row">
                    <div className="flex flex-col justify-start items-start w-full bg-[#6F826A] p-3 sm:p-4 rounded-xl sm:rounded-2xl gap-3 sm:gap-5">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold w-full text-white">
                            BUKU
                            <span className="text-[#F0F1C5]"> TERLARIS</span>{" "}
                            MINGGU INI
                        </h3>
                        <img
                            className="h-auto w-full"
                            src="/boy-reading.svg"
                            alt="boy-reading"
                        />
                    </div>

                    <div className="flex flex-col xl:w-[calc(100vw-470px)] xl:left-full gap-3">
                        <div className="flex justify-between items-center w-full">
                            <button
                                className="w-full text-right underline text-lg font-bold cursor-pointer pr-4"
                                onClick={() => alert("Lihat Semua")}
                            >
                                Lihat Semua
                            </button>
                        </div>

                        <Swiper
                            modules={[Pagination]}
                            spaceBetween={10}
                            slidesPerView={slidesPerView}
                            slidesPerGroup={slidesPerView}
                            pagination={false}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            onSlideChange={(swiper) =>
                                setActiveIndex(
                                    Math.floor(
                                        swiper.activeIndex / slidesPerView
                                    )
                                )
                            }
                            className="w-full"
                            breakpoints={{
                                320: { slidesPerView: 1, slidesPerGroup: 1 },
                                640: {
                                    slidesPerView: 2,
                                    slidesPerGroup: 2,
                                    spaceBetween: 15,
                                },
                                768: {
                                    slidesPerView: 3,
                                    slidesPerGroup: 3,
                                    spaceBetween: 15,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    slidesPerGroup: 4,
                                    spaceBetween: 20,
                                },
                                1280: {
                                    slidesPerView: 5,
                                    slidesPerGroup: 5,
                                    spaceBetween: 20,
                                },
                            }}
                        >
                            {dataBuku.map((data, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="flex items-stretch"
                                >
                                    <BukuHomeCard
                                        image={data.image}
                                        penulis={data.penulis}
                                        judul={data.judul}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
                                onClick={() => {
                                    if (activeIndex > 0) {
                                        swiperRef.current?.slideTo(
                                            (activeIndex - 1) * slidesPerView
                                        );
                                    }
                                }}
                                disabled={activeIndex === 0}
                            >
                                <MdOutlineKeyboardArrowLeft />
                            </button>

                            {totalPages <= 5 ? (
                                Array.from({ length: totalPages }).map(
                                    (_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === idx
                                                ? "bg-cust-blue"
                                                : "bg-cust-dark-gray"
                                                }`}
                                            onClick={() =>
                                                swiperRef.current?.slideTo(
                                                    idx * slidesPerView
                                                )
                                            }
                                        />
                                    )
                                )
                            ) : (
                                <>
                                    {Array.from({
                                        length: Math.min(3, totalPages),
                                    }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === idx
                                                ? "bg-cust-blue"
                                                : "bg-cust-dark-gray"
                                                }`}
                                            onClick={() =>
                                                swiperRef.current?.slideTo(
                                                    idx * slidesPerView
                                                )
                                            }
                                        />
                                    ))}
                                    {totalPages > 3 && (
                                        <div className="text-xs font-bold">
                                            ...
                                        </div>
                                    )}
                                    {totalPages > 3 && (
                                        <div
                                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === totalPages - 1
                                                ? "bg-cust-blue"
                                                : "bg-cust-dark-gray"
                                                }`}
                                            onClick={() =>
                                                swiperRef.current?.slideTo(
                                                    (totalPages - 1) *
                                                    slidesPerView
                                                )
                                            }
                                        />
                                    )}
                                </>
                            )}
                            <button
                                className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
                                onClick={() => {
                                    if (activeIndex < totalPages - 1) {
                                        swiperRef.current?.slideTo(
                                            (activeIndex + 1) * slidesPerView
                                        );
                                    }
                                }}
                                disabled={activeIndex === totalPages - 1}
                            >
                                <MdOutlineKeyboardArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BukuMinggu;