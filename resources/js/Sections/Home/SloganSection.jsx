import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SloganSection = () => {
    return (
            <Swiper
                loop={true}
                autoHeight={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    waitForTransition: true,
                }}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="w-full h-auto"
            >
                <SwiperSlide className="flex justify-center items-center ">
                    <img className="object-center" src="/slogan.webp" />
                </SwiperSlide>
                <SwiperSlide className="">
                    <div className="flex justify-center items-center py-16 text-white bg-cust-primary-color w-full rounded-2xl">
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
            </Swiper>
    );
};

export default SloganSection;
