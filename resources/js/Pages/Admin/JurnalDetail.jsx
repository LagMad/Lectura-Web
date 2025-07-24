import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { router } from "@inertiajs/react";

const JurnalDetail = ({ book, journals = [] }) => {
    const [isDeleting, setIsDeleting] = useState(null); // Track which journal is being deleted

    const handleClose = () => {
        router.visit(route("jurnal.book.detail", book.id));
    };

    const handleDelete = (journalId) => {
        if (confirm("Yakin ingin menghapus jurnal ini?")) {
            setIsDeleting(journalId); // Set loading state

            router.delete(`/jurnal/${journalId}`, {
                onSuccess: () => {
                    // Success handled by Laravel redirect with success message
                    setIsDeleting(null);
                    // Optional: You can add a toast notification here
                },
                onError: (errors) => {
                    // Handle error
                    console.error("Error deleting journal:", errors);
                    alert("Gagal menghapus jurnal. Silakan coba lagi.");
                    setIsDeleting(null);
                },
                onFinish: () => {
                    setIsDeleting(null);
                },
            });
        }
    };

    // Calculate progress percentage
    const calculateProgress = () => {
        if (!book) return 0;
        const currentPage = book.halaman_terakhir || 0;
        const totalPages = book.jumlah_halaman || 1;
        return Math.round((currentPage / totalPages) * 100);
    };

    const progressPercentage = calculateProgress();

    const isCloudinaryUrl = (url) => {
        const pattern =
            /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/v\d+\/[^/]+\/[^/]+\.(jpg|jpeg|png|gif)$/i;
        return pattern.test(url);
    };
    const isValidImage = book.cover_path && isCloudinaryUrl(book.cover_path);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">
                        Journal {book?.judul || "Buku"}
                    </h2>
                    <button
                        className="p-1 rounded-full hover:bg-gray-100"
                        onClick={handleClose}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Book Info */}
                {book && (
                    <div className="p-4 flex items-start border-b">
                        {isValidImage ? (
                            <img
                                className="w-20 h-auto object-contain"
                                src={book.cover_path}
                                alt={book.judul}
                            />
                        ) : (
                            <div className="flex justify-center items-center w-20 h-28 text-center object-contain mb-2 bg-gray-300 text-gray-500">
                                No Cover
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{book.judul}</h3>
                            <p className="text-gray-600">{book.penulis}</p>
                            <div className="mt-2 text-sm">
                                <div className="mb-1">
                                    <span>
                                        Halaman: {book.halaman_terakhir || 180}/
                                        {book.jumlah_halaman || 200}
                                    </span>
                                </div>
                                <div className="mb-1">
                                    <span>Progress: {progressPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{
                                            width: `${progressPercentage}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Journal list heading */}
                <div className="p-4">
                    <h3 className="font-bold text-lg">Daftar Jurnal</h3>
                </div>

                {/* Journal entries */}
                <div className="flex-1 overflow-y-auto p-4">
                    {journals.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                Belum ada jurnal untuk buku ini.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {journals.map((journal) => (
                                <div key={journal.id} className="border-b pb-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-lg">
                                                {journal.tanggal}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Halaman: {journal.halaman_range}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className={`text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    isDeleting === journal.id
                                                        ? "cursor-wait"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleDelete(journal.id)
                                                }
                                                disabled={
                                                    isDeleting === journal.id
                                                }
                                                title="Hapus jurnal"
                                            >
                                                {isDeleting === journal.id ? (
                                                    // Loading spinner
                                                    <svg
                                                        className="animate-spin h-5 w-5"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                ) : (
                                                    // Delete icon
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-800">
                                        {journal.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JurnalDetail;
