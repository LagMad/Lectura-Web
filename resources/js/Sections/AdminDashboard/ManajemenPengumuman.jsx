import React, { useState, useReducer, useMemo, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import {
    Search,
    Edit,
    Trash2,
    X,
    Save,
    Plus,
    Eye,
    EyeOff,
    FileText,
    Image,
    ExternalLink,
} from "lucide-react";

const initialState = {
    search: "",
    status: "Semua Status",
    page: 1,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_SEARCH":
            return { ...state, search: action.value, page: 1 };
        case "SET_STATUS":
            return { ...state, status: action.value, page: 1 };
        case "SET_PAGE":
            return { ...state, page: action.value };
        default:
            return state;
    }
};

const itemsPerPage = 10;

// Dropdown component
const Dropdown = ({ value, onChange, options }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white w-full md:w-auto text-center md:text-left"
    >
        {options.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
        ))}
    </select>
);

// Pagination component
const Pagination = ({ page, totalPages, onPageChange }) => {
    const generatePageNumbers = () => {
        const delta = 2; // Number of pages to show around current page
        const range = [];
        const rangeWithDots = [];

        // Always show first page
        range.push(1);

        // Calculate range around current page
        for (
            let i = Math.max(2, page - delta);
            i <= Math.min(totalPages - 1, page + delta);
            i++
        ) {
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
                rangeWithDots.push("...");
            }
            rangeWithDots.push(current);
            prev = current;
        }

        return rangeWithDots;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex sticky left-0 items-center justify-between px-6 py-3">
            <div className="text-sm text-gray-700">
                Halaman {page} dari {totalPages}
            </div>
            <div className="flex space-x-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent rounded"
                >
                    ‹
                </button>

                {pageNumbers.map((pageNum, index) => {
                    if (pageNum === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-sm text-gray-500"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`px-3 py-2 text-sm rounded ${
                                page === pageNum
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent rounded"
                >
                    ›
                </button>
            </div>
        </div>
    );
};

// Add/Edit Modal Component
const PengumumanModal = ({ pengumuman, isOpen, onClose, isEdit = false }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        judul: "",
        penulis: "",
        image: null,
        file: null,
        is_active: false,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [fileName, setFileName] = useState("");

    // Reset form when modal opens/closes or pengumuman changes
    useEffect(() => {
        if (isOpen) {
            if (isEdit && pengumuman) {
                setData({
                    judul: pengumuman.judul || "",
                    penulis: pengumuman.penulis || "",
                    image: null,
                    file: null,
                    is_active: pengumuman.is_active || false,
                });
                setImagePreview(pengumuman.image_path || null);
                setFileName(pengumuman.original_filename || "");
            } else {
                setData({
                    judul: "",
                    penulis: "",
                    image: null,
                    file: null,
                    is_active: false,
                });
                setImagePreview(null);
                setFileName("");
            }
        }
    }, [isOpen, isEdit, pengumuman]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("file", file);
            setFileName(file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit && pengumuman) {
            put(route("admin.pengumuman.update", pengumuman.id), {
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
            const fd = new FormData();
            fd.append("_method", "PUT"); // <‑‑ spoof
            fd.append("judul", data.judul);
            fd.append("penulis", data.penulis);
            fd.append("is_active", data.is_active ? 1 : 0);
            if (data.image) fd.append("image", data.image);
            if (data.file) fd.append("file", data.file);

            router.post(route("admin.pengumuman.update", pengumuman.id), fd, {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route("admin.pengumuman.store"), {
                forceFormData: true,
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {isEdit ? "Edit Pengumuman" : "Tambah Pengumuman"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Judul *
                        </label>
                        <input
                            type="text"
                            value={data.judul}
                            onChange={(e) => setData("judul", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.judul && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.judul}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Penulis *
                        </label>
                        <input
                            type="text"
                            value={data.penulis}
                            onChange={(e) => setData("penulis", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.penulis && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.penulis}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Gambar
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.image}
                            </p>
                        )}

                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg border"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            File Lampiran
                        </label>
                        <div className="text-left text-xs text-gray-500 mb-1">
                            Dapat berupa file pdf pengumuman. Jika dicantumkan
                            lampiran, pengumuman akan menunjukkan tombol
                            "Selengkapnya" untuk melihat dokumen.
                        </div>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.file && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.file}
                            </p>
                        )}

                        {fileName && (
                            <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                                <FileText className="w-4 h-4" />
                                <span>{fileName}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                            htmlFor="is_active"
                            className="text-sm font-medium"
                        >
                            Aktif
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>
                                {processing ? "Menyimpan..." : "Simpan"}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Delete Modal Component
const DeleteModal = ({ pengumuman, isOpen, onClose }) => {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route("admin.pengumuman.destroy", pengumuman.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-red-600">
                        Hapus Pengumuman
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                        Apakah Anda yakin ingin menghapus pengumuman ini?
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Judul:</strong> {pengumuman?.judul}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                            <strong>Penulis:</strong> {pengumuman?.penulis}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={processing}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>{processing ? "Menghapus..." : "Hapus"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ManajemenPengumuman({ pengumuman = [] }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState({
        isOpen: false,
        pengumuman: null,
    });
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        pengumuman: null,
    });
    const { search, status, page } = state;

    const filteredData = useMemo(() => {
        return pengumuman.filter((item) => {
            const matchSearch =
                item.judul?.toLowerCase().includes(search.toLowerCase()) ||
                item.penulis?.toLowerCase().includes(search.toLowerCase());
            const matchStatus =
                status === "Semua Status" ||
                (status === "Aktif" && item.is_active) ||
                (status === "Tidak Aktif" && !item.is_active);
            return matchSearch && matchStatus;
        });
    }, [pengumuman, search, status]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, page]);

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
                timeZone: "Asia/Jakarta",
            }) + " WIB"
        );
    };

    const handleEdit = (pengumuman) => {
        setEditModal({ isOpen: true, pengumuman });
    };

    const handleDelete = (pengumuman) => {
        setDeleteModal({ isOpen: true, pengumuman });
    };

    const closeAddModal = () => setAddModal(false);

    const closeEditModal = () => {
        setEditModal({ isOpen: false, pengumuman: null });
    };

    const closeDeleteModal = () =>
        setDeleteModal({ isOpen: false, pengumuman: null });

    return (
        <section className="flex flex-col w-full mx-auto pt-8 px-4 sm:px-6 lg:px-8 gap-5 font-[poppins]">
            <Head title="Manajemen Pengumuman" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-5">
                <div>
                    <h2 className="text-2xl font-bold">Manajemen Pengumuman</h2>
                    <p className="text-sm text-gray-500">
                        Kelola pengumuman yang akan ditampilkan kepada pengguna
                    </p>
                </div>
                <button
                    onClick={() => setAddModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Pengumuman</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan judul atau penulis..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) =>
                            dispatch({
                                type: "SET_SEARCH",
                                value: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="flex gap-3 w-full">
                    <Dropdown
                        value={status}
                        onChange={(v) =>
                            dispatch({ type: "SET_STATUS", value: v })
                        }
                        options={["Semua Status", "Aktif", "Tidak Aktif"]}
                    />
                </div>
            </div>

            <div className="relative bg-white rounded-lg shadow overflow-hidden overflow-x-scroll">
                <table className="w-full overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                "ID",
                                "Judul",
                                "Penulis",
                                "Gambar",
                                "File",
                                "Status",
                                "Dibuat",
                                "Diperbarui",
                                "Aksi",
                            ].map((h, i) => (
                                <th
                                    key={i}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {item.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                    <div
                                        className="truncate"
                                        title={item.judul}
                                    >
                                        {item.judul}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.penulis}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.image_path ? (
                                        <div className="flex items-center space-x-2">
                                            <Image className="w-4 h-4 text-green-600" />
                                            <span className="text-green-600">
                                                Ada
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {item.link ? (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <FileText className="w-4 h-4" />
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        {item.is_active ? (
                                            <Eye className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <EyeOff className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                item.is_active
                                                    ? "text-green-600 bg-green-50"
                                                    : "text-gray-600 bg-gray-50"
                                            }`}
                                        >
                                            {item.is_active
                                                ? "Aktif"
                                                : "Tidak Aktif"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {formatDate(item.created_at)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {formatDate(item.updated_at)}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit Pengumuman"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Hapus Pengumuman"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {currentData.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Tidak ada data pengumuman yang ditemukan.
                    </div>
                )}
                {pengumuman.length > itemsPerPage && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={(p) =>
                            dispatch({ type: "SET_PAGE", value: p })
                        }
                    />
                )}
            </div>

            {/* Add Modal */}
            <PengumumanModal
                isOpen={addModal}
                onClose={closeAddModal}
                isEdit={false}
            />

            {/* Edit Modal */}
            <PengumumanModal
                pengumuman={editModal.pengumuman}
                isOpen={editModal.isOpen}
                onClose={closeEditModal}
                isEdit={true}
            />

            {/* Delete Modal */}
            <DeleteModal
                pengumuman={deleteModal.pengumuman}
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
            />
        </section>
    );
}
