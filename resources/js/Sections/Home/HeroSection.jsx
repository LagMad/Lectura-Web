import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const HeroSection = () => {
    const smallImages = [
        { src: "hero-1.jpg", alt: "Berita 1", judul: "ini Judul 1" },
        { src: "hero-2.jpg", alt: "Berita 2", judul: "ini Judul 2" },
        { src: "hero-3.jpg", alt: "Berita 3", judul: "ini Judul 3" },
    ];

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
                {smallImages.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative flex flex-col justify-end h-screen w-full">
                            <img
                                src={slide?.src ?? ""}
                                alt={slide?.alt ?? "Slide Image"}
                                className="absolute inset-0 w-full h-full object-cover object-center z-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#3B3D643B] to-[#2A2E66B8] z-10 pointer-events-none" />
                            <div className="relative z-20 mb-32 px-5 md:px-20 text-white text-6xl font-bold">
                                {slide?.judul}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSection;
