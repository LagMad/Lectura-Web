import { useState, useEffect } from "react";
import { Search, Edit, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";

export default function ManajemenKategori({
    categories: initialCategories,
    books: initialBooks,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [error, setError] = useState("");

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        console.log("initialBooks", initialBooks.data);
    }, [initialBooks.data]);

    // Apply search filter
    const handleSearch = () => {
        router.get(
            route("books.admin"),
            {
                search: searchTerm,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // Handle search on Enter key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Handle pagination
    const handlePageChange = (page) => {
        router.get(
            route("books.admin", {
                page: page,
                search: searchTerm,
            }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // Handle category deletion
    const confirmDelete = (category) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        router.delete(route("kategori.destroy", categoryToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setCategoryToDelete(null);
            },
        });
    };

    // Handle category addition
    const openAddModal = () => {
        setNewCategoryName("");
        setError("");
        setAddModalOpen(true);
    };

    const handleAdd = () => {
        if (!newCategoryName.trim()) {
            setError("Nama kategori tidak boleh kosong");
            return;
        }

        router.post(
            route("kategori.store"),
            {
                kategori: newCategoryName,
            },
            {
                onSuccess: () => {
                    setAddModalOpen(false);
                    setNewCategoryName("");
                    setError("");
                },
                onError: (errors) => {
                    setError(errors.kategori || "Terjadi kesalahan");
                },
            }
        );
    };

    // Calculate pagination info
    const currentPage = initialCategories?.current_page || 1;
    const totalPages = initialCategories?.last_page || 1;
    const startItem = initialCategories?.from || 0;
    const endItem = initialCategories?.to || 0;
    const totalCategories = initialCategories?.total || 0;

    const getBookCountForCategory = (categoryName) => {
        if (!initialBooks || !initialBooks.data) return 0;
        
        return initialBooks.data.filter(book => book.kategori === categoryName).length;
    };

    return (
        <div className="w-full mx-auto pt-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="lg:flex justify-between items-center mb-2">
                <h2 className="text-2xl lg:mb-0 mb-2 font-bold">
                    Manajemen Kategori
                </h2>
                <button
                    onClick={openAddModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center text-sm"
                >
                    <span className="mr-1">+</span> Tambah Kategori
                </button>
            </div>
            <p className="md:text-sm text-xs text-gray-500 mb-6">
                Kelola kategori buku perpustakaan Anda
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-grow">
                    <Search
                        size={16}
                        className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Cari Kategori..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded lg:text-md text-sm"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                    Cari
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="text-left text-gray-500 text-sm">
                            <th className="py-3 px-4 font-medium">
                                Nama Kategori
                            </th>
                            <th className="py-3 px-4 font-medium">
                                Jumlah Buku
                            </th>
                            <th className="py-3 px-4 font-medium">
                                Tanggal Dibuat
                            </th>
                            <th className="py-3 px-4 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialCategories?.data &&
                        initialCategories.data.length > 0 ? (
                            initialCategories.data.map((category, index) => (
                                <tr
                                    key={category.id}
                                    className="border-t border-gray-100"
                                >
                                    <td className="py-3 px-4 md:text-md text-sm">
                                        {category.kategori}
                                    </td>
                                    <td className="py-3 px-4 md:text-md text-sm">
                                        {getBookCountForCategory(
                                            category.kategori
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-500">
                                        {new Date(
                                            category.created_at
                                        ).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    confirmDelete(category)
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
                                    colSpan="4"
                                    className="py-6 text-center text-gray-500"
                                >
                                    Tidak ada kategori yang ditemukan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="xl:flex items-center justify-between py-4">
                <div className="text-sm text-gray-500 lg:mb-0 mb-2">
                    {totalCategories > 0
                        ? `Menampilkan ${startItem} - ${endItem} dari ${totalCategories} kategori`
                        : "Tidak ada kategori"}
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
                            Apakah Anda yakin ingin menghapus kategori "
                            {categoryToDelete?.kategori}"? Tindakan ini tidak
                            dapat dibatalkan.
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

            {/* Add Category Modal */}
            {addModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">
                            Tambah Kategori Baru
                        </h3>
                        <div className="mb-4">
                            <label
                                htmlFor="category-name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nama Kategori
                            </label>
                            <input
                                type="text"
                                id="category-name"
                                value={newCategoryName}
                                onChange={(e) =>
                                    setNewCategoryName(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan nama kategori"
                            />
                            {error && (
                                <p className="text-red-500 text-xs mt-1">
                                    {error}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setAddModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
