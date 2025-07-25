import React, { useState, useMemo } from "react";
import { Eye, Download, ChevronLeft, ChevronRight, Search } from "lucide-react";

const TabelKonten = ({ books }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [yearFilter, setYearFilter] = useState("Semua Tahun");
    const [searchTerm, setSearchTerm] = useState("");

    const getColor = (tipe) => {
        switch (tipe) {
            case "Koleksi Perpustakaan":
                return "bg-purple-100 text-purple-500";
            case "Siswa":
                return "bg-blue-100 text-blue-500";
            case "Guru":
                return "bg-yellow-100 text-yellow-500";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const entriesPerPage = 5;

    // Get unique years for filter options - Fixed version
    const availableYears = useMemo(() => {
        
        // Extract years and filter out null/undefined values
        const years = books
            .map((item) => {
                return item.tahun_terbit;
            })
            .filter((year) => year != null && year !== undefined && year !== "");
        
        // Remove duplicates and sort
        const uniqueYears = [...new Set(years)].sort((a, b) => Number(b) - Number(a));
        
        return uniqueYears;
    }, [books]);

    // Filter data based on year and search term
    const filteredData = useMemo(() => {
        let filtered = books || [];

        // Apply year filter
        if (yearFilter !== "Semua Tahun") {
            const targetYear = parseInt(yearFilter);
            filtered = filtered.filter((item) => {
                return parseInt(item.tahun_terbit) === targetYear;
            });
        }

        // Apply search filter
        if (searchTerm.trim() !== "") {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((item) => {
                return (
                    item.judul?.toLowerCase().includes(searchLower) ||
                    item.penulis?.toLowerCase().includes(searchLower) ||
                    item.karya_oleh?.toLowerCase().includes(searchLower) ||
                    item.kategori?.toLowerCase().includes(searchLower) ||
                    item.deskripsi?.toLowerCase().includes(searchLower)
                );
            });
        }

        return filtered;
    }, [books, yearFilter, searchTerm]);

    // Calculate pagination
    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    // Reset to page 1 when filter changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [yearFilter, searchTerm]);

    // Get current page data
    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, entriesPerPage]);

    // Calculate showing text
    const startEntry =
        totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
    const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

    // Improved pagination numbers with ellipsis
    const generatePageNumbers = () => {
        const delta = 2; // Number of pages to show around current page
        const range = [];
        const rangeWithDots = [];

        // Always show first page
        range.push(1);

        // Calculate range around current page
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        // Always show last page (if totalPages > 1)
        if (totalPages > 1) {
            range.push(totalPages);
        }

        // Remove duplicates and sort
        const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

        // Add ellipsis where there are gaps
        let prev = 0;
        for (const current of uniqueRange) {
            if (current - prev === 2) {
                rangeWithDots.push(prev + 1);
            } else if (current - prev !== 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(current);
            prev = current;
        }

        return rangeWithDots;
    };

    // Handle view action
    const handleView = (book) => {
        if (book.link) {
            window.open(book.link, "_blank");
        } else {
        }
    };

    // Handle download action
    const handleDownload = (book) => {
        if (book.link) {
            const link = document.createElement("a");
            link.href = book.link;
            link.download = book.original_filename || `${book.judul}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
        }
    };

    // Clear search function
    const clearSearch = () => {
        setSearchTerm("");
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchTerm("");
        setYearFilter("Semua Tahun");
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-2">
                <h2 className="text-2xl font-semibold text-gray-900 text-center md:text-left">
                    Konten menurut Tahun Akademik
                </h2>
                <div className="relative flex w-full md:w-auto">
                    <select
                        value={yearFilter}
                        onChange={(e) => {
                            setYearFilter(e.target.value);
                        }}
                        className="text-center md:text-left w-full md:w-auto appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    >
                        <option value="Semua Tahun">Semua Tahun</option>
                        {availableYears.length > 0 ? (
                            availableYears.map((tahun_terbit) => (
                                <option
                                    key={tahun_terbit}
                                    value={tahun_terbit.toString()}
                                >
                                    {tahun_terbit}
                                </option>
                            ))
                        ) : (
                            <option disabled>Tidak ada tahun tersedia</option>
                        )}
                    </select>
                    <ChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Cari berdasarkan judul, penulis, tipe, atau kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Active Filters Display */}
            {(searchTerm || yearFilter !== "Semua Tahun") && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">Filter aktif:</span>
                    {searchTerm && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            Pencarian: "{searchTerm}"
                            <button
                                onClick={clearSearch}
                                className="hover:text-blue-900"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {yearFilter !== "Semua Tahun" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            Tahun: {yearFilter}
                            <button
                                onClick={() => setYearFilter("Semua Tahun")}
                                className="hover:text-green-900 cursor-pointer"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-red-600 hover:text-red-800 underline cursor-pointer"
                    >
                        Hapus semua filter
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="relative overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                Judul
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                Tipe
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                Penulis
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                Tahun Terbit
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                Kategori
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                Status
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="py-8 px-4 text-center text-gray-500"
                                >
                                    {books && books.length === 0 ? (
                                        "Belum ada data buku"
                                    ) : searchTerm ||
                                      yearFilter !== "Semua Tahun" ? (
                                        <>
                                            Tidak ada data yang cocok dengan
                                            filter
                                            {searchTerm &&
                                                ` pencarian "${searchTerm}"`}
                                            {yearFilter !== "Semua Tahun" &&
                                                ` tahun ${yearFilter}`}
                                        </>
                                    ) : (
                                        "Tidak ada data"
                                    )}
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item, index) => (
                                <tr
                                    key={item.id || index}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="py-4 px-4 text-sm text-gray-900">
                                        <div className="flex items-center space-x-3">
                                            {item.cover_path && (
                                                <img
                                                    src={item.cover_path}
                                                    alt={item.judul}
                                                    className="w-8 h-10 object-cover rounded"
                                                />
                                            )}
                                            <div className="max-w-xs">
                                                <div className="truncate font-medium">
                                                    {item.judul}
                                                </div>
                                                {item.deskripsi && (
                                                    <div className="text-xs text-gray-500 truncate mt-1">
                                                        {item.deskripsi}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getColor(
                                                item.karya_oleh
                                            )}`}
                                        >
                                            {item.karya_oleh}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {item.penulis}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {item.tahun_terbit}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                                            {item.kategori}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                item.status === "Tersedia"
                                                    ? "bg-green-100 text-green-500"
                                                    : item.status ===
                                                      "Tidak Tersedia"
                                                    ? "bg-red-100 text-red-500"
                                                    : "bg-yellow-100 text-yellow-500"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleView(item)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Lihat"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDownload(item)
                                                }
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Unduh"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Improved Pagination with Ellipsis */}
                <div className="flex sticky left-0 items-center justify-between mt-6 px-6 py-3">
                    <p className="text-sm text-gray-700">
                        Data {startEntry} - {endEntry} dari {totalEntries}{" "}
                        data
                        {(yearFilter !== "Semua Tahun" || searchTerm) && (
                            <span className="text-gray-500">
                                {" ("}
                                {[
                                    yearFilter !== "Semua Tahun" &&
                                        `filter tahun ${yearFilter}`,
                                    searchTerm &&
                                        `pencarian "${searchTerm}"`,
                                ]
                                    .filter(Boolean)
                                    .join(", ")}
                                {")"}
                            </span>
                        )}
                    </p>

                    {totalPages > 1 && (
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        Math.max(1, currentPage - 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {generatePageNumbers().map((pageNum, index) => {
                                if (pageNum === '...') {
                                    return (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="px-3 py-2 text-sm text-gray-400"
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            currentPage === pageNum
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        Math.min(
                                            totalPages,
                                            currentPage + 1
                                        )
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TabelKonten;