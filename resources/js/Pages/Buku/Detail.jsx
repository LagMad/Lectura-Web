import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/Layouts/Layout";
import { Star, StarHalf, StarOff } from "lucide-react";
import { usePage, router, useForm } from "@inertiajs/react";

const Detail = () => {
    const { book, avgRating, auth, isFavorited, reviews, relatedBooks } =
        usePage().props;
    const [isProcessing, setIsProcessing] = useState(false);
    const [favorited, setFavorited] = useState(isFavorited);
    const [reviewModal, setReviewModal] = useState(false);
    const [sortBy, setSortBy] = useState("latest");

    const sortedReviews = useMemo(() => {
        if (!reviews) return [];

        switch (sortBy) {
            case "highest": // Tertinggi
                return [...reviews].sort(
                    (a, b) =>
                        b.rating - a.rating ||
                        Date.parse(b.created_at) - Date.parse(a.created_at)
                );
            case "lowest": // Terendah
                return [...reviews].sort(
                    (a, b) =>
                        a.rating - b.rating ||
                        Date.parse(b.created_at) - Date.parse(a.created_at)
                );
            default: // Terbaru
                return [...reviews].sort(
                    (a, b) =>
                        Date.parse(b.created_at) - Date.parse(a.created_at)
                );
        }
    }, [reviews, sortBy]);

    // ❷  Handler dropdown
    const handleFilterChange = (e) => setSortBy(e.target.value);

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

    const formattedRating = avgRating
        ? parseFloat(avgRating).toFixed(1)
        : "0.0";

    const categories = book.kategori
        ? book.kategori.split(",").map((cat) => cat.trim())
        : [];

    const toggleReviewModal = () => {
        setReviewModal(!reviewModal);
    };

    // destruktur lengkap
    const {
        data,
        setData,
        post,
        processing,
        errors,
        setError,
        clearErrors,
        reset,
    } = useForm({
        book_id: book?.id || "",
        rating: 0,
        comment: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        clearErrors(); // hapus error lama
        let hasError = false; // penanda ada error

        if (data.rating === 0) {
            setError("rating", "Rating minimal harus 1 yaa!");
            hasError = true;
        }
        if (data.comment.trim() === "") {
            setError("comment", "Reviewnya ga boleh kosong lhoo");
            hasError = true;
        }

        if (hasError) return; // stop jika masih ada error

        post(route("reviews.store"), {
            onSuccess: () => {
                reset(); // kosongkan form
                clearErrors(); // bersihkan error server jika ada
                setReviewModal(false);
            },
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return (
            date.toLocaleString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Asia/Jakarta", // ensure it converts to WIB
            }) + " WIB"
        );
    };

    const StarRating = ({ rating, setRating, error, readOnly = false }) => {
        const [hover, setHover] = useState(0);

        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                        <button
                            key={index}
                            type="button"
                            disabled={readOnly}
                            className={`text-2xl transition-colors ${
                                readOnly ? "cursor-default" : "cursor-pointer"
                            } ${
                                ratingValue <= (hover || rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                            }`}
                            onClick={() => !readOnly && setRating(ratingValue)}
                            onMouseEnter={() =>
                                !readOnly && setHover(ratingValue)
                            }
                            onMouseLeave={() => !readOnly && setHover(0)}
                        >
                            ★
                        </button>
                    );
                })}
                <span className="ml-2 text-gray-600 text-sm">
                    {rating > 0 && `${rating} out of 5 stars`}
                </span>
            </div>
        );
    };

    return (
        <>
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
                                href={
                                    book.status === "Tersedia" ? book.link : "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`font-semibold text-sm rounded-lg transition-all py-2 w-40 lg:w-64 border-2 text-center ${
                                    book.status === "Tersedia"
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
                            {auth.user && (
                                <button
                                    className={`cursor-pointer border-2 border-cust-primary-color text-cust-primary-color font-semibold text-sm rounded-lg hover:scale-105 transition-all py-2 w-40 lg:w-64`}
                                    onClick={toggleReviewModal}
                                >
                                    Tulis Review
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
                                {book.deskripsi ||
                                    "Tidak ada deskripsi tersedia."}
                            </p>

                            <h3 className="text-lg font-semibold mb-2">
                                Kategori
                            </h3>
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
                            <div className="space-y-10">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-semibold text-xl">
                                        Review Pembaca
                                    </h2>
                                    <div className="flex items-center">
                                        <span className="mr-2 text-sm">
                                            Filter:
                                        </span>
                                        <select
                                            value={sortBy}
                                            onChange={handleFilterChange}
                                            className="border rounded py-1 px-3 text-sm"
                                        >
                                            <option value="latest">
                                                Terbaru
                                            </option>
                                            <option value="highest">
                                                Tertinggi
                                            </option>
                                            <option value="lowest">
                                                Terendah
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {reviews != 0 ? (
                                    <>
                                        {sortedReviews.map((review, index) => (
                                            <div
                                                key={index}
                                                className="border-b pb-4"
                                            >
                                                <div className="flex items-center mb-2">
                                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                                        <span className="text-gray-600">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                                <circle
                                                                    cx="12"
                                                                    cy="7"
                                                                    r="4"
                                                                ></circle>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="flex flex-row justify-center items-center font-medium text-sm gap-1">
                                                            {review.user.name}
                                                            <div className="text-xs text-gray-500">
                                                                {" "}
                                                                -{" "}
                                                                {formatDate(
                                                                    review.created_at
                                                                )}
                                                            </div>
                                                        </p>
                                                        <div className="flex">
                                                            {renderStars(
                                                                review.rating
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700 mb-2">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div>
                                        Tidak ada review. Tulis reviewmu
                                        sekarang!
                                    </div>
                                )}
                                <div className="space-y-8">
                                    <div className="w-full">
                                        <div className="space-y-5 w-full">
                                            <h1 className="font-semibold text-2xl">
                                                Buku yang Mirip
                                            </h1>
                                            {relatedBooks.length != 0 ? (
                                                <div className="flex gap-5 overflow-x-auto pb-2">
                                                    {relatedBooks.map(
                                                        (book, index) => (
                                                            <div
                                                                key={book.id}
                                                                onClick={() =>
                                                                    router.visit(
                                                                        route(
                                                                            "books.show",
                                                                            book.id
                                                                        )
                                                                    )
                                                                }
                                                                className="min-w-[160px] bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer"
                                                            >
                                                                <img
                                                                    src={
                                                                        book.cover_path
                                                                    }
                                                                    alt={
                                                                        book.judul
                                                                    }
                                                                    className="rounded-t-lg w-full object-cover h-56 p-3"
                                                                />
                                                                <div className="p-3">
                                                                    <p className="text-xs text-gray-600 mb-1">
                                                                        {
                                                                            book.penulis
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm font-medium line-clamp-2">
                                                                        {
                                                                            book.judul
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    Tidak ada buku yang mirip.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>

            {reviewModal && (
                <div className="fixed flex justify-center items-center inset-0 h-screen w-full bg-black/30 z-50">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full lg:w-1/3 mx-auto p-6 bg-white rounded-lg shadow-lg"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Write a Review
                        </h2>

                        <div className="space-y-6">
                            {/* Star Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    How would you rate your experience?{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <StarRating
                                    rating={data.rating}
                                    setRating={(rating) =>
                                        setData("rating", rating)
                                    }
                                    error={errors.rating}
                                />

                                {errors.rating && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.rating}
                                    </p>
                                )}
                            </div>

                            {/* Review Text */}
                            <div>
                                <label
                                    htmlFor="review"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Your Review{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="review"
                                    value={data.comment}
                                    onChange={(e) => {
                                        setData("comment", e.target.value);
                                    }}
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                        errors.comment
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Ceritakan tentang buku ini..."
                                    maxLength={500}
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">
                                    {data.comment.length}/500 characters
                                </div>
                                {errors.comment && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.comment}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReviewModal(false);
                                        reset();
                                        clearErrors();
                                    }}
                                    className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-200 font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50"
                                >
                                    {processing
                                        ? "Tunggu Sebentar..."
                                        : "Submit Review"}
                                </button>
                                {errors.book_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.book_id}
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Detail;
