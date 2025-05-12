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
                        <button className="font-semibold text-sm rounded-lg hover:scale-105 transition-all py-2 w-40 lg:w-64 bg-cust-primary-color border-2 border-cust-primary-color text-white">
                            Baca Sekarang
                        </button>
                        {auth.user && (
                            <button
                                className={`cursor-pointer border-2 border-cust-primary-color font-semibold text-sm rounded-lg hover:scale-105 transition-all py-2 w-40 lg:w-64 ${
                                    isFavorited
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
                    </div>
                </div>
                <div className="container pt-10 pb-20">
                    <div className="container space-y-5">
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
            </section>
        </Layout>
    );
};

export default Detail;
