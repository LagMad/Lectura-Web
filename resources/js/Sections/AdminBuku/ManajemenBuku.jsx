import { useState, useEffect } from "react";
import { Search, ChevronDown, Edit, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";

export default function ManajemenBuku({ books: initialBooks }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
    const [selectedStatus, setSelectedStatus] = useState("Semua Status");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([
        "Tersedia",
        "Tidak Tersedia",
        "Terkendala",
    ]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    // Extract categories from books data
    useEffect(() => {
        if (initialBooks?.data) {
            const uniqueCategories = [
                ...new Set(initialBooks.data.map((book) => book.kategori)),
            ].filter(Boolean);
            if (uniqueCategories.length > 0) {
                setCategories(uniqueCategories);
            }
        }
    }, [initialBooks]);

    // Handle search input change with debounce
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Apply search filter
    const handleSearch = () => {
        router.get(
            route("books.admin"),
            {
                search: searchTerm,
                kategori:
                    selectedCategory !== "Semua Kategori"
                        ? selectedCategory
                        : null,
                status:
                    selectedStatus !== "Semua Status" ? selectedStatus : null,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["books"],
            }
        );
    };

    // Handle search on Enter key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setShowCategoryDropdown(false);

        router.get(
            route("books.admin"),
            {
                search: searchTerm,
                kategori: category !== "Semua Kategori" ? category : null,
                status:
                    selectedStatus !== "Semua Status" ? selectedStatus : null,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["books"],
            }
        );
    };

    // Handle status selection
    const handleStatusSelect = (status) => {
        setSelectedStatus(status);
        setShowStatusDropdown(false);

        router.get(
            route("books.admin"),
            {
                search: searchTerm,
                kategori:
                    selectedCategory !== "Semua Kategori"
                        ? selectedCategory
                        : null,
                status: status !== "Semua Status" ? status : null,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["books"],
            }
        );
    };

    // Handle pagination
    const handlePageChange = (page) => {
        router.get(
            route("books.admin", {
                page: page,
                search: searchTerm,
                kategori:
                    selectedCategory !== "Semua Kategori"
                        ? selectedCategory
                        : null,
                status:
                    selectedStatus !== "Semua Status" ? selectedStatus : null,
            }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ["books"],
            }
        );
    };

    // Handle book deletion
    const confirmDelete = (book) => {
        setBookToDelete(book);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        router.delete(route("books.destroy", bookToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setBookToDelete(null);
            },
        });
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowCategoryDropdown(false);
            setShowStatusDropdown(false);
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Stop propagation to prevent dropdown from closing when clicking inside
    const handleDropdownClick = (e) => {
        e.stopPropagation();
    };

    // Calculate pagination info
    const currentPage = initialBooks?.current_page || 1;
    const totalPages = initialBooks?.last_page || 1;
    const startItem = initialBooks?.from || 0;
    const endItem = initialBooks?.to || 0;
    const totalBooks = initialBooks?.total || 0;

    return (
        <div className="w-full mx-auto pt-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="lg:flex justify-between items-center mb-2">
                <h2 className="text-2xl lg:mb-0 mb-2 font-bold">
                    Manajemen Buku
                </h2>
                <a
                    href={route("books.create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center text-sm"
                >
                    <span className="mr-1">+</span> Tambah Buku
                </a>
            </div>
            <p className="md:text-sm text-xs text-gray-500 mb-6">
                Kelola inventaris buku Anda
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-grow">
                    <Search
                        size={16}
                        className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Cari Buku..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded lg:text-md text-sm"
                    />
                </div>
                <div className="flex gap-3">
                    {/* Category Dropdown */}
                    <div className="relative" onClick={handleDropdownClick}>
                        <button
                            className="px-4 py-2 border border-gray-300 rounded flex items-center justify-between min-w-32 md:text-md text-sm md:mr-0 mr-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCategoryDropdown(!showCategoryDropdown);
                                setShowStatusDropdown(false);
                            }}
                        >
                            <span>{selectedCategory}</span>
                            <ChevronDown size={16} className="ml-2" />
                        </button>
                        {showCategoryDropdown && (
                            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
                                <div
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        handleCategorySelect("Semua Kategori")
                                    }
                                >
                                    Semua Kategori
                                </div>
                                {categories.map((category, idx) => (
                                    <div
                                        key={idx}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleCategorySelect(category)
                                        }
                                    >
                                        {category}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative" onClick={handleDropdownClick}>
                        <button
                            className="px-4 py-2 border border-gray-300 rounded flex items-center justify-between min-w-32 md:text-md text-sm md:ml-0 ml-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowStatusDropdown(!showStatusDropdown);
                                setShowCategoryDropdown(false);
                            }}
                        >
                            <span>{selectedStatus}</span>
                            <ChevronDown size={16} className="ml-2" />
                        </button>
                        {showStatusDropdown && (
                            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
                                <div
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        handleStatusSelect("Semua Status")
                                    }
                                >
                                    Semua Status
                                </div>
                                {statuses.map((status, idx) => (
                                    <div
                                        key={idx}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleStatusSelect(status)
                                        }
                                    >
                                        {status}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="text-left text-gray-500 text-sm">
                            <th className="py-3 px-4 font-medium">
                                Judul Buku
                            </th>
                            <th className="py-3 px-4 font-medium">Penulis</th>
                            <th className="py-3 px-4 font-medium">Kategori</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialBooks?.data && initialBooks.data.length > 0 ? (
                            initialBooks.data.map((book) => (
                                <tr
                                    key={book.id}
                                    className="border-t border-gray-100"
                                >
                                    <td className="py-3 px-4 md:text-md text-sm">
                                        {book.judul}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-500">
                                        {book.penulis}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                                            {book.kategori}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                book.status === "Tersedia"
                                                    ? "bg-green-100 text-green-500"
                                                    : book.status ===
                                                      "Tidak Tersedia"
                                                    ? "bg-red-100 text-red-500"
                                                    : "bg-yellow-100 text-yellow-500"
                                            }`}
                                        >
                                            {book.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <a
                                                href={route(
                                                    "books.edit",
                                                    book.id
                                                )}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit size={16} />
                                            </a>
                                            <button
                                                onClick={() =>
                                                    confirmDelete(book)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-6 text-center text-gray-500"
                                >
                                    Tidak ada buku yang ditemukan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="xl:flex items-center justify-between py-4">
                <div className="text-sm text-gray-500 lg:mb-0 mb-2">
                    {totalBooks > 0
                        ? `Menampilkan ${startItem} - ${endItem} dari ${totalBooks} buku`
                        : "Tidak ada buku"}
                </div>
                {totalPages > 1 && (
                    <div className="flex mr-auto md:mr-0 w-fit">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 border border-gray-300 rounded-l ${
                                currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "hover:bg-gray-50"
                            } md:text-md text-sm`}
                        >
                            Sebelumnya
                        </button>

                        {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                                // Show pages around current page
                                let pageToShow = currentPage;
                                if (currentPage <= 3) {
                                    pageToShow = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageToShow = totalPages - 4 + i;
                                } else {
                                    pageToShow = currentPage - 2 + i;
                                }

                                // Ensure page number is valid
                                if (
                                    pageToShow > 0 &&
                                    pageToShow <= totalPages
                                ) {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                handlePageChange(pageToShow)
                                            }
                                            className={`px-3 py-1 border-t border-b border-gray-300 ${
                                                currentPage === pageToShow
                                                    ? "bg-blue-600 text-white"
                                                    : "hover:bg-gray-50"
                                            } md:text-md text-sm`}
                                        >
                                            {pageToShow}
                                        </button>
                                    );
                                }
                                return null;
                            }
                        )}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 border border-gray-300 rounded-r ${
                                currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "hover:bg-gray-50"
                            } md:text-md text-sm`}
                        >
                            Selanjutnya
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">
                            Konfirmasi Penghapusan
                        </h3>
                        <p className="mb-6">
                            Apakah Anda yakin ingin menghapus buku "
                            {bookToDelete?.judul}"? Tindakan ini tidak dapat
                            dibatalkan.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
