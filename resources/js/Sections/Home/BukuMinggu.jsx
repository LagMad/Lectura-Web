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

    const dataDummy = [
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

    const totalPages = Math.ceil(dataDummy.length / 5);

    return (
        <div className="px-20">
            <div className="flex flex-col justify-center items-start gap-10 w-full p-10 pb-24 bg-[#EFF6FF] rounded-2xl">
                <div className="flex flex-col justify-center items-center gap-5 w-full">
                    <div className="text-5xl font-bold w-full text-center">
                        Buku Terlaris Minggu Ini
                    </div>
                    <hr className="h-0.5 bg-black w-1/3 self-center rounded-full" />
                    <div className="w-1/3 text-center leading-tight">
                        Lagi rame dibaca! Buku-buku ini lagi jadi incaran para
                        pembaca e-library minggu ini. Sudah baca belum?
                    </div>
                </div>
                <div className="relative flex flex-col justify-start items-start w-[300px] bg-[#6F826A] p-3 h-[510px] rounded-2xl gap-5">
                    <div className="text-3xl font-extrabold w-full text-white">
                        BUKU <span className="text-[#F0F1C5]">TERLARIS</span>{" "}
                        MINGGU INI
                    </div>
                    <img
                        className="h-auto w-full"
                        src="/boy-reading.svg"
                        alt="boy-reading"
                    />
                    <div className="absolute flex flex-col justify-start items-center w-[calc(100vw-480px)] left-full -translate-x-[70px] top-[30px] gap-3 pr-4">
                        <button
                            className="w-full text-right underline text-lg font-bold cursor-pointer pr-4"
                            onClick={() => alert("Lihat Semua")}
                        >
                            Lihat Semua
                        </button>
                        <Swiper
                            modules={[Pagination]}
                            spaceBetween={20}
                            slidesPerView={5}
                            slidesPerGroup={5}
                            pagination={false}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            onSlideChange={(swiper) =>
                                setActiveIndex(
                                    Math.floor(swiper.activeIndex / 5)
                                )
                            }
                            className="w-full h-[450px]"
                        >
                            {dataDummy.map((data, index) => (
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
                            {/* Left Arrow */}
                            <button
                                className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
                                onClick={() => {
                                    if (activeIndex > 0) {
                                        swiperRef.current?.slideTo(
                                            (activeIndex - 1) * 5
                                        );
                                    }
                                }}
                                disabled={activeIndex === 0}
                            >
                                <MdOutlineKeyboardArrowLeft />
                            </button>

                            {/* Dots */}
                            {Array.from({ length: totalPages }).map(
                                (_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                                            activeIndex === idx
                                                ? "bg-cust-blue"
                                                : "bg-cust-dark-gray"
                                        }`}
                                        onClick={() =>
                                            swiperRef.current?.slideTo(idx * 5)
                                        }
                                    />
                                )
                            )}

                            {/* Right Arrow */}
                            <button
                                className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
                                onClick={() => {
                                    if (activeIndex < totalPages - 1) {
                                        swiperRef.current?.slideTo(
                                            (activeIndex + 1) * 5
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
