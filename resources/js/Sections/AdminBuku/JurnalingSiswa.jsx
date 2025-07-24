import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { router } from "@inertiajs/react";
import JurnalSiswaDetail from "./JurnalSiswaDetail";

const JurnalingSiswa = (props) => {
    const {
        booksJurnaling: initialBooks = [],
        totalBooks: initialTotalBooks = 0,
        kategoriBuku: initialKategoriBuku = ["Semua Kategori"],
        filters: initialFilters = {
            search: "",
            kategori: "",
            page: 1,
            perPage: 10,
        },
        pagination: initialPagination = {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
        },
        onNavigate = null,
    } = props;

    // State for data
    const [books, setBooks] = useState(initialBooks);
    const [kategoriBuku, setKategoriBuku] = useState(initialKategoriBuku);
    const [pagination, setPagination] = useState(initialPagination);

    // State for filters
    const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
    const [selectedCategory, setSelectedCategory] = useState(
        initialFilters.kategori === ""
            ? "Semua Kategori"
            : initialFilters.kategori
    );
    const [loading, setLoading] = useState(false);

    // Popup state
    const [selectedBook, setSelectedBook] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Timeout ID for search debounce
    const [searchTimeout, setSearchTimeout] = useState(null);

    // Define computed values
    const currentPage = pagination.current_page;
    const totalPages = pagination.last_page;
    const perPage = pagination.per_page;
    const totalBooks = pagination.total;

    // Update component when props change
    React.useEffect(() => {
        if (props.booksJurnaling) setBooks(props.booksJurnaling);
        if (props.kategoriBuku) setKategoriBuku(props.kategoriBuku);
        if (props.pagination) setPagination(props.pagination);
        if (props.filters) {
            setSearchQuery(props.filters.search || "");
            setSelectedCategory(
                props.filters.kategori === ""
                    ? "Semua Kategori"
                    : props.filters.kategori
            );
        }

        setLoading(false);
    }, [props]);

    // Handle search with debounce
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Clear any existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Debounce search request
        const timeoutId = setTimeout(() => {
            setLoading(true);
            navigateWithFilters({
                search: value,
                kategori:
                    selectedCategory === "Semua Kategori"
                        ? ""
                        : selectedCategory,
                page: 1, // Reset to first page on new search
            });
        }, 500);

        setSearchTimeout(timeoutId);
    };

    // Handle category change
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value);
        setLoading(true);

        navigateWithFilters({
            search: searchQuery,
            kategori: value === "Semua Kategori" ? "" : value,
            page: 1, // Reset to first page on category change
        });
    };

    // Handle page navigation
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setLoading(true);

            navigateWithFilters({
                search: searchQuery,
                kategori:
                    selectedCategory === "Semua Kategori"
                        ? ""
                        : selectedCategory,
                page: page,
            });
        }
    };

    const navigateWithFilters = (filterUpdates) => {
        // Make sure we're consistently sending empty string for "Semua Kategori"
        const kategoriValue =
            (filterUpdates.kategori !== undefined
                ? filterUpdates.kategori
                : selectedCategory) === "Semua Kategori"
                ? ""
                : filterUpdates.kategori !== undefined
                ? filterUpdates.kategori
                : selectedCategory;

        const updatedFilters = {
            search: searchQuery,
            kategori: kategoriValue,
            page: currentPage,
            perPage: perPage,
            ...filterUpdates,
            // Override kategori again in case it was included in filterUpdates
            kategori:
                filterUpdates.kategori === "Semua Kategori"
                    ? ""
                    : filterUpdates.kategori || kategoriValue,
        };

        if (onNavigate) {
            // Use provided onNavigate if available
            onNavigate(updatedFilters);
        } else {
            // Otherwise use Inertia router directly
            router.get(window.location.pathname, updatedFilters, {
                preserveState: true,
                replace: true,
            });
        }
    };

    // Generate pagination array
    const getPaginationArray = () => {
        // For small number of pages, show all
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // For larger number of pages, show a window around current page
        let pages = [];

        // Always include first page
        pages.push(1);

        // Add ellipsis if needed
        if (currentPage > 3) {
            pages.push("ellipsis1");
        }

        // Add pages around current page
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(currentPage + 1, totalPages - 1);
            i++
        ) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        // Add ellipsis if needed
        if (currentPage < totalPages - 2) {
            pages.push("ellipsis2");
        }

        // Always include last page
        if (!pages.includes(totalPages)) {
            pages.push(totalPages);
        }

        return pages;
    };

    // Calculate the first and last item displayed
    const firstItem = books.length > 0 ? (currentPage - 1) * perPage + 1 : 0;
    const lastItem = Math.min(currentPage * perPage, totalBooks);

    return (
        <div className="w-full mx-auto pt-4 pb-8 px-4 sm:px-6 lg:px-8 font-sans">
            <h1 className="text-2xl font-bold mb-6">Jurnaling Siswa</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 md:max-w-xs">
                    <input
                        type="text"
                        placeholder="Cari buku..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <Search size={18} />
                    </div>
                </div>

                <select
                    className="px-2 py-2 rounded-md border border-gray-300"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    {kategoriBuku.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <p>Memuat data...</p>
                    </div>
                ) : books.length === 0 ? (
                    <div className="p-8 text-center">
                        <p>Tidak ada buku yang ditemukan.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                                    <th className="px-6 py-3 text-black font-medium">
                                        Cover
                                    </th>
                                    <th className="px-6 py-3 text-black font-medium">
                                        Judul Buku
                                    </th>
                                    <th className="px-6 py-3 text-black font-medium">
                                        Penulis
                                    </th>
                                    <th className="px-6 py-3 text-black font-medium">
                                        Total Siswa
                                    </th>
                                    <th className="px-6 py-3 text-black font-medium">
                                        Total jurnal
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
                                {books.map((book) => {
                                    const isCloudinaryUrl = (url) => {
                                        const pattern =
                                            /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/v\d+\/[^/]+\/[^/]+\.(jpg|jpeg|png|gif)$/i;
                                        return pattern.test(url);
                                    };
                                    const isValidImage =
                                        book.cover_image &&
                                        isCloudinaryUrl(book.cover_image);

                                    return (
                                        <tr
                                            key={book.id}
                                            className="border-b border-gray-200"
                                        >
                                            <td className="px-6 py-4">
                                                {isValidImage ? (
                                                    <img
                                                        className="w-20 h-auto object-contain"
                                                        src={book.cover_image}
                                                        alt={book.judul}
                                                    />
                                                ) : (
                                                    <div className="flex justify-center items-center w-20 h-28 text-center object-contain mb-2 bg-gray-300 text-gray-500">
                                                        No Cover
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {book.judul}
                                            </td>
                                            <td className="px-6 py-4">
                                                {book.penulis}
                                            </td>
                                            <td className="px-6 py-4">
                                                {book.total_siswa} Siswa
                                            </td>
                                            <td className="px-6 py-4">
                                                {book.total_jurnal} Jurnal
                                            </td>
                                            <td className="px-6 py-4">
                                                {book.update_terakhir}
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={route(
                                                        "jurnal.book.detail",
                                                        book.id
                                                    )}
                                                    className="text-blue-600 hover:text-blue-700 cursor-pointer"
                                                >
                                                    Lihat Detail
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {books.length > 0 && (
                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Menampilkan {firstItem} - {lastItem} dari{" "}
                            {totalBooks} Buku
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

export default JurnalingSiswa;
