import React, { useState, useEffect } from "react";
import Layout from "@/Layouts/Layout";
import { Star, StarHalf, StarOff } from "lucide-react";
import { usePage, router } from "@inertiajs/react";

const Detail = () => {
    const { book, avgRating, auth, isFavorited } = usePage().props;
    const [isProcessing, setIsProcessing] = useState(false);
    const [favorited, setFavorited] = useState(isFavorited); // Local state

    const handleFavoriteToggle = () => {
        if (isProcessing) return;
        setIsProcessing(true);

        if (favorited) {
            // Remove from favorites
            router.delete("/favorites", {
                data: { book_id: book.id },
                preserveScroll: true,
                onFinish: () => {
                    setFavorited(false);
                    setIsProcessing(false);
                },
            });
        } else {
            // Add to favorites
            router.post(
                "/favorites",
                {
                    book_id: book.id,
                },
                {
                    preserveScroll: true,
                    onFinish: () => {
                        setFavorited(true);
                        setIsProcessing(false);
                    },
                }
            );
        }
    };

    // Function to render stars based on rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={`full-${i}`}
                    size={20}
                    fill="#facc15"
                    stroke="#facc15"
                />
            );
        }

        // Add half star if needed
        if (hasHalfStar) {
            stars.push(
                <StarHalf
                    key="half"
                    size={20}
                    fill="#facc15"
                    stroke="#facc15"
                />
            );
        }

        // Add empty stars
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <StarOff key={`empty-${i}`} size={20} stroke="#facc15" />
            );
        }

        return stars;
    };

    // Format rating to display with one decimal place
    const formattedRating = avgRating
        ? parseFloat(avgRating).toFixed(1)
        : "0.0";

    // Format categories array into individual items
    const categories = book.kategori
        ? book.kategori.split(",").map((cat) => cat.trim())
        : [];

    return (
        <Layout>
            <section className="bg-cust-background-color pt-20">
                <div className="container py-20 flex flex-wrap justify-center gap-10">
                    <div className="bg-white flex flex-col items-center p-8 rounded-lg w-full md:w-1/3 space-y-4">
                        <img
                            src={book.cover_path || "/placeholder-book.png"}
                            alt={`Cover Buku ${book.judul}`}
                            className="rounded-lg w-40 lg:w-64 object-cover"
                        />
                        <a
                            href={book.status === "Tersedia" ? book.link : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-semibold text-sm rounded-lg transition-all py-2 w-40 lg:w-64 border-2 text-center ${book.status === "Tersedia"
                                ? "bg-cust-primary-color border-cust-primary-color text-white hover:scale-105"
                                : " bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                                }`}
                        >
                            {book.status === "Tersedia"
                                ? "Baca Sekarang"
                                : "Tidak Tersedia"}
                        </a>

                        {auth.user && (
                            <button
                                className={`cursor-pointer border-2 border-cust-primary-color font-semibold text-sm rounded-lg hover:scale-105 transition-all py-2 w-40 lg:w-64 ${isFavorited
                                    ? "bg-cust-primary-color text-white"
                                    : "text-cust-primary-color"
                                    }`}
                                onClick={handleFavoriteToggle}
                                disabled={isProcessing}
                            >
                                {isFavorited
                                    ? "Hapus dari Favorite"
                                    : "Tambah ke Favorite"}
                            </button>
                        )}
                    </div>

                    <div className="bg-white p-8 rounded-lg w-full md:w-1/2">
                        <h2 className="text-2xl font-bold text-cust-primary-color mb-1">
                            {book.judul}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Oleh {book.penulis}
                        </p>

                        <div className="flex items-center gap-2 mb-6">
                            {renderStars(avgRating || 0)}
                            <span className="ml-2 text-sm text-gray-700">
                                {formattedRating}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 w-2/3 text-sm mb-8">
                            <p>Penerbit</p>
                            <p>{book.penerbit || "-"}</p>
                            <p>Tahun Terbit</p>
                            <p>{book.tahun_terbit || "-"}</p>
                            <p>Bahasa</p>
                            <p>{book.bahasa || "-"}</p>
                            <p>Halaman</p>
                            <p>{book.jumlah_halaman || "-"}</p>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                            Deskripsi
                        </h3>
                        <p className="text-gray-700 text-justify mb-6">
                            {book.deskripsi || "Tidak ada deskripsi tersedia."}
                        </p>

                        <h3 className="text-lg font-semibold mb-2">Kategori</h3>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((kategori) => (
                                <span
                                    key={kategori}
                                    className="bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1 rounded-full"
                                >
                                    {kategori}
                                </span>
                            ))}
                        </div>

                        <hr className="my-8" />
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-semibold text-xl">Review Pembaca</h2>
                                <div className="flex items-center">
                                    <span className="mr-2 text-sm">Filter:</span>
                                    <select className="border rounded py-1 px-3 text-sm">
                                        <option>Terbaru</option>
                                        <option>Tertinggi</option>
                                        <option>Terendah</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="border-b pb-4">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                            <span className="text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg>
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Bambang Pamungkas</p>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                        Buku ini benar-benar menggugah! Alur ceritanya sangat menarik dan membuat saya tidak bisa berhenti
                                        membaca. Karakter-karakternya sangat berkembang dibandingkan buku sebelumnya. Twist di akhir cerita benar-benar
                                        tidak terduga. Sangat merekomendasikan untuk penggemar seri ini!
                                    </p>
                                    <div className="flex items-center text-xs text-gray-500 gap-4">
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                <path d="M12 20V10"></path>
                                                <path d="M18 10V4"></path>
                                                <path d="M6 16v-6"></path>
                                                <path d="M18 4l-6 6-6 6"></path>
                                            </svg>
                                            Membantu (12)
                                        </span>
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                            Tidak Membantu (4)
                                        </span>
                                    </div>
                                </div>

                                <div className="border-b pb-4">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                            <span className="text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg>
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Ilmu Sutieno</p>
                                            <div className="flex">
                                                {[...Array(3)].map((_, i) => (
                                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                    </svg>
                                                ))}
                                                {[...Array(2)].map((_, i) => (
                                                    <svg key={i + 3} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">
                                        Buku ini benar-benar menggugah! Alur ceritanya sangat menarik dan membuat saya tidak bisa berhenti
                                        membaca. Karakter-karakternya sangat berkembang dibandingkan buku sebelumnya. Twist di akhir cerita benar-benar
                                        tidak terduga. Sangat merekomendasikan untuk penggemar seri ini!
                                    </p>
                                    <div className="flex items-center text-xs text-gray-500 gap-4">
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                <path d="M12 20V10"></path>
                                                <path d="M18 10V4"></path>
                                                <path d="M6 16v-6"></path>
                                                <path d="M18 4l-6 6-6 6"></path>
                                            </svg>
                                            Membantu (10)
                                        </span>
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                            Tidak Membantu (6)
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="space-y-5 w-full">
                                        <h1 className="font-semibold text-2xl">
                                            Buku yang Mirip
                                        </h1>
                                        <div className="flex gap-5 overflow-x-auto pb-2">
                                            {Array(6)
                                                .fill(0)
                                                .map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="min-w-[160px] bg-white rounded-lg shadow hover:shadow-md transition-all"
                                                    >
                                                        <img
                                                            src="mie-ayam.png"
                                                            alt="Ayo Berlatih Silat"
                                                            className="rounded-t-lg w-full object-cover h-56 p-3"
                                                        />
                                                        <div className="p-3">
                                                            <p className="text-xs text-gray-600 mb-1">
                                                                A. Fuadi
                                                            </p>
                                                            <p className="text-sm font-medium line-clamp-2">
                                                                Ayo Berlatih Silat. Let's
                                                                Practice Silat
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Detail;
