import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SloganSection = ({
    posters = [],
    useSwiper = true,
    showDetails = true,
}) => {
    const [currentPoster, setCurrentPoster] = useState(null);

    useEffect(() => {
        if (posters.length > 0) {
            setCurrentPoster(posters[0]);
        }
    }, [posters]);

    const handleSlideChange = (swiper) => {
        const realIndex = swiper.realIndex;
        if (realIndex < posters.length) {
            setCurrentPoster(posters[realIndex]);
        } else {
            setCurrentPoster(null); // For the logo slide
        }
    };

    // Render with Swiper
    if (useSwiper) {
        return (
            <div className="flex flex-col justify-center items-center w-full">
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
                    onSlideChange={handleSlideChange}
                    onSwiper={(swiper) => {
                        // Set initial poster when swiper is ready
                        if (posters.length > 0) {
                            setCurrentPoster(posters[0]);
                        }
                    }}
                >
                    {posters.length !== 0 &&
                        posters.map((poster) => (
                            <SwiperSlide
                                key={poster.id}
                                className="flex justify-center items-center rounded-2xl"
                            >
                                <Zoom>
                                    <img
                                        className="object-center rounded-2xl"
                                        src={poster.image_path}
                                        alt={poster.judul}
                                    />
                                </Zoom>
                            </SwiperSlide>
                        ))}
                    <SwiperSlide className="">
                        <div className="flex justify-center items-center py-16 px-10 text-white bg-cust-primary-color w-full rounded-2xl">
                            <div className="flex flex-col justify-center items-center text-center">
                                <div className="flex justify-center items-end h-auto max-w-96 mb-10 animate-pulse font-bold text-5xl text-white">
                                    <img
                                        className="text-white"
                                        src={
                                            "/Logo-lectura-full-transparent-white.svg"
                                        }
                                        alt="Lectura Logo"
                                    />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>

                {/* Show current poster details */}
                {showDetails && currentPoster && (
                    <div className="flex flex-col justify-center items-center w-full mt-6 p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-xl font-semibold text-gray-800 mb-2 text-center">
                            {currentPoster.judul}
                        </div>
                        <div className="text-gray-600 text-sm">
                            Karya oleh:{" "}
                            <span className="font-medium">
                                {currentPoster.karya_oleh}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Render without Swiper - Grid/List layout
    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {posters.length !== 0 ? (
                    posters.map((poster) => (
                        <div
                            key={poster.id}
                            className="flex flex-col items-center bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="w-full">
                                <Zoom>
                                    <img
                                        className="w-full h-64 object-cover"
                                        src={poster.image_path}
                                        alt={poster.judul}
                                    />
                                </Zoom>
                            </div>
                            {showDetails &&
                                (poster.judul || poster.karya_oleh) && (
                                    <div className="p-4 text-center">
                                        {poster.judul && (
                                            <div className="text-lg font-semibold text-gray-800 mb-2">
                                                {poster.judul}
                                            </div>
                                        )}

                                        {poster.karya_oleh && (
                                            <div className="text-gray-600 text-sm">
                                                Karya oleh:{" "}
                                                <span className="font-medium">
                                                    {poster.karya_oleh}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex justify-center items-center py-16 px-10 text-white bg-cust-primary-color w-full rounded-2xl">
                        <div className="flex flex-col justify-center items-center text-center">
                            <div className="flex justify-center items-end h-auto max-w-96 mb-10 animate-pulse font-bold text-5xl text-white">
                                <img
                                    className="text-white"
                                    src={
                                        "/Logo-lectura-full-transparent-white.svg"
                                    }
                                    alt="Lectura Logo"
                                />
                            </div>
                            <p className="text-white/80">
                                Belum ada poster tersedia
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SloganSection;
