import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroSection = ({ pengumuman }) => {
    return (
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
                                    <div className="text-2xl font-normal text-gray-400">
                                        {slide?.penulis}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default HeroSection;
