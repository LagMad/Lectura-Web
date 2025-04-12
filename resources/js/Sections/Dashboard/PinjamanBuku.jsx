import React, { useState, useRef } from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import BukuHomeCard from "../../Components/ui/BukuHomeCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";

import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const PinjamanBuku = () => {
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
        <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-col justify-start items-start gap-5 w-full">
                <div className="font-bold text-lg">Buku Yang Dipinjam</div>
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={20}
                    slidesPerView={5}
                    slidesPerGroup={5}
                    pagination={false}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) =>
                        setActiveIndex(Math.floor(swiper.activeIndex / 5))
                    }
                    className="w-full h-[450px]"
                >
                    {dataDummy.map((data, index) => (
                        <SwiperSlide key={index} className="flex items-stretch">
                            <BukuHomeCard
                                image={data.image}
                                penulis={data.penulis}
                                judul={data.judul}
                                // showButton={false}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="flex justify-center items-center gap-2 -mt-8 w-full">
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
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                                activeIndex === idx
                                    ? "bg-cust-blue"
                                    : "bg-cust-dark-gray"
                            }`}
                            onClick={() => swiperRef.current?.slideTo(idx * 5)}
                        />
                    ))}

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
            <Input label={"Email"} placeholder={"Your Email Here..."} />
            <div className="flex self-end">
                <Button>Save Changes</Button>
            </div>
        </div>
    );
};

export default PinjamanBuku;
