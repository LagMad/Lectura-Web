import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { router } from "@inertiajs/react";

const JurnalSiswaDetail = ({ book, siswa, totalPages = 1 }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const perPage = 3;

    useEffect(() => {
        // Initialize with data passed from props if available
        if (siswa) {
            setStudents(siswa.data || []);
            setTotalStudents(siswa.total || 0);
            setCurrentPage(siswa.current_page || 1);
            setLoading(false);
        } else {
            fetchStudents();
        }
    }, [siswa]);

    useEffect(() => {
        console.log("book", book);
    }, [book]);

    useEffect(() => {
        console.log("siswa", siswa);
    }, [siswa]);

    const fetchStudents = async (page = 1, query = "") => {
        setLoading(true);
        try {
            router.reload({
                only: ["siswa"],
                data: {
                    page: page,
                    search: query,
                    book_id: book?.id,
                },
                preserveState: true,
                onSuccess: (page) => {
                    setStudents(page.props.siswa.data || []);
                    setTotalStudents(page.props.siswa.total || 0);
                    setCurrentPage(page.props.siswa.current_page || 1);
                    setLoading(false);
                },
            });
        } catch (error) {
            console.error("Error fetching students:", error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchStudents(1, query);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        fetchStudents(page, searchQuery);
    };

    const handleViewJournal = (studentId) => {
        router.visit(
            route("jurnal.detail", {
                book_id: book.id,
                user_id: studentId,
            })
        );
    };

    const getPaginationArray = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages are less than or equal to max visible pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end page numbers
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if current page is near the beginning
            if (currentPage <= 3) {
                endPage = 4;
            }

            // Adjust if current page is near the end
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pages.push("ellipsis1");
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pages.push("ellipsis2");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const isCloudinaryUrl = (url) => {
        const pattern =
            /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/v\d+\/[^/]+\/[^/]+\.(jpg|jpeg|png|gif)$/i;
        return pattern.test(url);
    };
    const isValidImage = book.cover_path && isCloudinaryUrl(book.cover_path);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">
                        {book?.judul || "Detail Buku"}
                    </h2>
                    <a
                        href="/admin-buku"
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <X size={24} />
                    </a>
                </div>

                {/* Book Info */}
                {book && (
                    <div className="p-4 flex items-start border-b">
                        {isValidImage ? (
                            <img
                                className="w-20 h-28 object-cover mr-4"
                                src={book.cover_path}
                                alt={book.judul}
                            />
                        ) : (
                            <div className="flex justify-center items-center w-20 h-28 text-center object-contain mb-2 bg-gray-300 text-gray-500">
                                No Cover
                            </div>
                        )}
                        <div>
                            <h3 className="font-bold text-lg">{book.judul}</h3>
                            <p className="text-gray-600">{book.penulis}</p>
                            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <div>
                                    <span className="font-medium">
                                        Total Siswa:
                                    </span>{" "}
                                    <span>
                                        {book.total_siswa || totalStudents}{" "}
                                        Siswa
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium">
                                        Total Jurnal:
                                    </span>{" "}
                                    <span>{book.total_jurnal} Jurnal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search bar */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari siswa..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <Search size={18} />
                        </div>
                    </div>
                </div>

                {/* Student list */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center">
                            <p>Memuat data...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="p-8 text-center">
                            <p>Tidak ada siswa yang ditemukan.</p>
                        </div>
                    ) : (
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                                    <th className="px-6 py-3 text-black font-medium">
                                        Siswa
                                    </th>
                                    <th className="px-6 py-3 text-black font-medium">
                                        Total Jurnal
                                    </th>
                                    <th className="px-6 py-3 text-black font-medium">
                                        Update Terakhir
                                    </th>
                                    <th className="px-6 py-3 text-black font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="border-b border-gray-200"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {student.name}
                                                    </div>
                                                    <div className="text-gray-500 text-sm">
                                                        {student.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.total_journals} Jurnal
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.last_updated}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="text-blue-600 hover:text-blue-700 cursor-pointer"
                                                onClick={() =>
                                                    handleViewJournal(
                                                        student.id
                                                    )
                                                }
                                            >
                                                Lihat Jurnal
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {students.length > 0 && totalPages > 1 && (
                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Menampilkan {(currentPage - 1) * perPage + 1} -{" "}
                            {Math.min(currentPage * perPage, totalStudents)}{" "}
                            dari {totalStudents} Siswa
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {getPaginationArray().map((page, index) =>
                                typeof page === "string" ? (
                                    <span
                                        key={page}
                                        className="w-8 h-8 flex items-center justify-center"
                                    >
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 flex items-center justify-center rounded ${
                                            currentPage === page
                                                ? "bg-blue-600 text-white"
                                                : "border border-gray-300"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JurnalSiswaDetail;
