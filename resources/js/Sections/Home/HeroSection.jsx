import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { usePage } from "@inertiajs/react";

const HeroSection = ({ pengumuman = [] }) => {
    const { auth } = usePage().props;
    return (
        <>
            {pengumuman.length != 0 ? (
                <div className="flex w-full h-full">
                    <Swiper
                        loop={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            waitForTransition: true,
                        }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="w-full h-full"
                    >
                        <SwiperSlide>
                            <div className="flex justify-center items-center py-16 text-white bg-cust-primary-color w-full h-screen">
                                <div className="flex flex-col justify-center items-center text-center">
                                    <div className="flex justify-center items-end h-auto w-96 mb-10 animate-pulse font-bold text-5xl text-white">
                                        <img
                                            className="text-white"
                                            src={
                                                "/Logo-lectura-full-transparent-white.svg"
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        {pengumuman
                            .filter((slide) => slide.is_active)
                            .map((slide, index) => (
                                <SwiperSlide key={index}>
                                    <div className="relative flex flex-col justify-end h-screen w-full">
                                        <img
                                            src={slide?.image_path ?? ""}
                                            alt={slide?.judul ?? "Slide Image"}
                                            className="absolute inset-0 w-full h-full object-cover object-center z-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#3B3D643B] to-[#2A2E66B8] z-10 pointer-events-none" />
                                        <div className="z-20 mb-32 px-5 md:px-20 space-y-2">
                                            <div className="text-6xl font-bold text-white">
                                                {slide?.judul}
                                            </div>
                                            <div className="text-2xl font-normal text-gray-400 mb-10">
                                                {slide?.penulis}
                                            </div>
                                            {slide?.link && (
                                                <a
                                                    href={slide.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-transparent hover:bg-cust-primary-color text-white px-8 py-1 rounded-full text-lg cursor-pointer transition-all duration-300 ease-in-out border-2 border-white hover:border-cust-primary-color"
                                                >
                                                    Selengkapnya
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            ) : (
                <div className="flex justify-center items-center py-16 text-white bg-cust-primary-color w-full h-screen">
                    <div className="flex flex-col justify-center items-center text-center">
                        <div className="flex justify-center items-end h-auto w-96 mb-10 animate-pulse font-bold text-5xl text-white">
                            <img
                                className="text-white"
                                src={"/Logo-lectura-full-transparent-white.svg"}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HeroSection;
