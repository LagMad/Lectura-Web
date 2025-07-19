import React, { useState, useRef, useEffect } from "react";
import BukuHomeCard from "../../Components/ui/BukuHomeCard";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";

import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const BookShowcase = ({
    books,
    judul,
    subjudul,
    deskripsi,
    image,
    onClick,
}) => {
    const swiperRef = useRef(null);
    const containerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(5);
    const [isMobile, setIsMobile] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);

    // Function to get slides per view based on screen width
    const getSlidesPerView = () => {
        if (typeof window !== "undefined") {
            const width = window.innerWidth;
            if (width < 640) return 1; // Mobile
            if (width < 1024) return 2; // Small tablets
            if (width < 1280) return 4; // Small laptops
            return 5; // Large screens
        }
        return 5; // Default for SSR
    };

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 1024);
            const newSlidesPerView = getSlidesPerView();
            setSlidesPerView(newSlidesPerView);

            // Get container width
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                setContainerWidth(containerWidth);
                // console.log("Container width:", containerWidth + "px");
            }

            // Reset active index when slides per view changes to avoid out of bounds
            setActiveIndex(0);
        };

        // Set initial values
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Calculate total pages based on complete groups
    const totalPages = Math.ceil(books.length / slidesPerView);

    // Calculate the current page based on activeIndex
    const currentPage = Math.floor(activeIndex / slidesPerView);

    const getCurrentPadding = () => {
        if (window.innerWidth >= 1536) return 370;
        if (window.innerWidth >= 1280) return 300;
        if (window.innerWidth >= 1024) return 300;
        if (window.innerWidth >= 640) return 64;
        return 40;
    };

    const padding = getCurrentPadding();
    const swiperWidth = containerWidth - padding;

    const goToNextPage = () => {
        if (swiperRef.current && currentPage < totalPages - 1) {
            const nextPageIndex = (currentPage + 1) * slidesPerView;
            swiperRef.current.slideTo(nextPageIndex);
        }
    };

    const goToPrevPage = () => {
        if (swiperRef.current && currentPage > 0) {
            const prevPageIndex = (currentPage - 1) * slidesPerView;
            swiperRef.current.slideTo(prevPageIndex);
        }
    };

    const goToPage = (pageIndex) => {
        if (swiperRef.current) {
            const targetIndex = pageIndex * slidesPerView;
            swiperRef.current.slideTo(targetIndex);
        }
    };

    const renderSwiper = () => (
        <>
            <Swiper
                modules={[Pagination]}
                spaceBetween={10}
                slidesPerView={slidesPerView}
                slidesPerGroup={slidesPerView} // Back to slidesPerView for proper grouping
                pagination={false}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className="w-full"
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 10,
                    },
                    640: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
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
                {books.map((book, index) => (
                    <SwiperSlide key={book.id} className="flex items-stretch">
                        <BukuHomeCard
                            index={index}
                            image={book.cover_path || "/default-cover.png"}
                            penulis={book.penulis}
                            judul={book.judul}
                            bookId={book.id}
                            rating={book.average_rating}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Controls - Only show if there are multiple pages */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
                        onClick={goToPrevPage}
                        disabled={currentPage === 0}
                    >
                        <MdOutlineKeyboardArrowLeft />
                    </button>

                    {/* Pagination Dots */}
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${
                                currentPage === idx
                                    ? "bg-blue-500"
                                    : "bg-gray-400"
                            }`}
                            onClick={() => goToPage(idx)}
                        />
                    ))}

                    <button
                        className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        <MdOutlineKeyboardArrowRight />
                    </button>
                </div>
            )}
        </>
    );

    return (
        <div
            ref={containerRef}
            className="flex flex-col justify-center items-start gap-5 sm:gap-8 lg:gap-10 w-full p-5 sm:p-8 lg:p-10 pb-10 sm:pb-16 lg:pb-24 bg-[#EFF6FF] rounded-xl sm:rounded-2xl"
        >
            {/* Header Section */}
            <div className="flex flex-col justify-center items-center gap-3 sm:gap-4 lg:gap-5 w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold w-full text-center">
                    {judul}
                </h2>
                <hr className="h-0.5 bg-black w-2/3 sm:w-1/2 lg:w-1/3 self-center rounded-full" />
                <p className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 text-center text-sm sm:text-base leading-tight">
                    {deskripsi}
                </p>
            </div>

            {/* Main Content */}
            <div className="w-full">
                {isMobile ? (
                    /* Mobile Layout */
                    <div className="w-full bg-[#54473F] p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-6">
                            {subjudul}
                        </h3>
                        {/* Image hidden on mobile */}

                        {/* Books Section */}
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    className="w-full text-right underline text-lg font-bold cursor-pointer text-white"
                                    onClick={() =>
                                        (window.location.href = "/buku")
                                    }
                                >
                                    Lihat Semua
                                </button>
                            </div>

                            {books.length > 0 ? (
                                renderSwiper()
                            ) : (
                                <div className="flex justify-center items-center h-64 text-gray-500">
                                    Belum ada buku yang tersedia
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Desktop Layout with Absolute Positioning */
                    <div className="relative w-full">
                        <div className="relative flex flex-col justify-start items-start w-[300px] xl:w-[340px] 2xl:w-[370px] h-[520px] sm:h-[560px] lg:h-[580px] bg-[#54473F] p-4 lg:p-6 rounded-xl lg:rounded-2xl gap-3 lg:gap-5">
                            {/* Sub Judul */}
                            <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold w-full text-white">
                                {subjudul}
                            </h3>
                            {/* Gambar Orang */}
                            <img
                                className="h-[350px] sm:h-[380px] lg:h-[400px] w-auto object-contain"
                                src={image}
                                alt="subject image"
                            />

                            {/* Absolute positioned books section */}
                            <div
                                className="absolute flex flex-col left-[calc(100%-60px)] lg:left-[calc(100%-80px)] top-16 lg:top-20 xl:top-24 gap-2 lg:gap-3"
                                style={{
                                    width:
                                        window.innerWidth >= 1024
                                            ? swiperWidth
                                            : "auto",
                                }}
                            >
                                <div className="flex justify-between items-center w-full">
                                    <button
                                        className="w-full text-right underline text-base lg:text-lg font-bold cursor-pointer pr-2 lg:pr-4"
                                        onClick={() =>
                                            (window.location.href = "/buku")
                                        }
                                    >
                                        Lihat Semua
                                    </button>
                                </div>

                                {books.length > 0 ? (
                                    renderSwiper()
                                ) : (
                                    <div className="flex justify-center items-center h-48 lg:h-64 text-gray-500 text-sm lg:text-base">
                                        Belum ada buku yang tersedia
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookShowcase;
