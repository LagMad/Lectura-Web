import { useState, useReducer, useMemo, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    Search,
    Edit,
    Trash2,
    X,
    Save,
    Plus,
    CheckCircle,
    XCircle,
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
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
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
    const getPageNumbers = () => {
        const pageNumbers = [];
        const showEllipsis = totalPages > 7;

        if (!showEllipsis) {
            // Show all pages if 7 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);

            if (page <= 4) {
                // Near the beginning: 1, 2, 3, 4, 5, ..., last
                for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
                    pageNumbers.push(i);
                }
                if (totalPages > 5) {
                    pageNumbers.push("ellipsis1");
                }
            } else if (page >= totalPages - 3) {
                // Near the end: 1, ..., n-4, n-3, n-2, n-1, n
                pageNumbers.push("ellipsis1");
                for (let i = Math.max(2, totalPages - 4); i < totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // In the middle: 1, ..., page-1, page, page+1, ..., last
                pageNumbers.push("ellipsis1");
                for (let i = page - 1; i <= page + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push("ellipsis2");
            }

            // Always show last page (if not already included)
            if (totalPages > 1) {
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
                Halaman {page} dari {totalPages}
            </div>
            <div className="flex space-x-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent rounded cursor-pointer"
                >
                    ‹
                </button>

                {getPageNumbers().map((pageNum, index) => {
                    if (pageNum === "ellipsis1" || pageNum === "ellipsis2") {
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
                            onClick={() => onPageChange(pageNum)}
                            className={`px-3 py-2 text-sm rounded transition-colors cursor-pointer ${
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
                    className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent rounded cursor-pointer"
                >
                    ›
                </button>
            </div>
        </div>
    );
};

// Add Modal Component
const AddModal = ({ isOpen, onClose, onSave }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        nipd: "",
        is_registered: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("nipd.store"), {
            onSuccess: () => {
                onClose();
                reset();
                onSave && onSave();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pt-0">
            <div className="bg-white rounded-lg p-6 w-full md:w-1/3 max-h-[600px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Tambah NIPD</h2>
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
                            NIPD
                        </label>
                        <input
                            type="text"
                            value={data.nipd}
                            onChange={(e) => setData("nipd", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan NIPD"
                            required
                        />
                        {errors.nipd && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.nipd}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Status Registrasi
                        </label>
                        <select
                            value={data.is_registered}
                            onChange={(e) =>
                                setData(
                                    "is_registered",
                                    e.target.value === "true"
                                )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={false}>Belum Terdaftar</option>
                            <option value={true}>Sudah Terdaftar</option>
                        </select>
                        {errors.is_registered && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.is_registered}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? "Menyimpan…" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Edit Modal Component
const EditModal = ({ nipd, isOpen, onClose, onSave }) => {
    const { data, setData, put, processing, errors, reset } = useForm({
        nipd: "",
        is_registered: false,
    });

    useEffect(() => {
        if (nipd && isOpen) {
            setData({
                nipd: nipd.nipd || "",
                is_registered: nipd.is_registered || false,
            });
        }
    }, [nipd, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("nipd.update", nipd.id), {
            onSuccess: () => {
                onClose();
                reset();
                onSave && onSave();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pt-0">
            <div className="bg-white rounded-lg p-6 w-full md:w-1/3 max-h-[600px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit NIPD</h2>
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
                            NIPD
                        </label>
                        <input
                            type="text"
                            value={data.nipd}
                            onChange={(e) => setData("nipd", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.nipd && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.nipd}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Status Registrasi
                        </label>
                        <select
                            value={data.is_registered}
                            onChange={(e) =>
                                setData(
                                    "is_registered",
                                    e.target.value === "true"
                                )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={false}>Belum Terdaftar</option>
                            <option value={true}>Sudah Terdaftar</option>
                        </select>
                        {errors.is_registered && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.is_registered}
                            </p>
                        )}
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
const DeleteModal = ({ nipd, isOpen, onClose, onDelete }) => {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route("nipd.destroy", nipd.id), {
            onSuccess: () => {
                onClose();
                onDelete && onDelete();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-red-600">
                        Hapus NIPD
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
                        Apakah Anda yakin ingin menghapus NIPD ini?
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>NIPD:</strong> {nipd?.nipd}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                            <strong>Status:</strong>{" "}
                            {nipd?.is_registered
                                ? "Sudah Terdaftar"
                                : "Belum Terdaftar"}
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

export default function ManajemenNipd({ nipdList = [] }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState({ isOpen: false, nipd: null });
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        nipd: null,
    });
    const { search, status, page } = state;

    const filteredData = useMemo(() => {
        return nipdList.filter((nipd) => {
            const matchSearch = nipd.nipd
                ?.toLowerCase()
                .includes(search.toLowerCase());
            const matchStatus =
                status === "Semua Status" ||
                (status === "Sudah Terdaftar" && nipd.is_registered) ||
                (status === "Belum Terdaftar" && !nipd.is_registered);

            return matchSearch && matchStatus;
        });
    }, [nipdList, search, status]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, page]);

    const getStatusColor = (isRegistered) =>
        isRegistered
            ? "text-green-600 bg-green-50"
            : "text-blue-600 bg-blue-50";

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

    const handleEdit = (nipd) => {
        setEditModal({ isOpen: true, nipd });
    };

    const handleDelete = (nipd) => {
        setDeleteModal({ isOpen: true, nipd });
    };

    const closeEditModal = () => {
        setEditModal({ isOpen: false, nipd: null });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, nipd: null });
    };

    return (
        <section className="flex flex-col w-full mx-auto pt-8 px-4 sm:px-6 lg:px-8 gap-5 font-[poppins]">
            <Head title="Manajemen NIPD" />

            <div className="flex flex-row justify-between items-center">
                <div className="">
                    <h2 className="text-2xl font-bold">Manajemen NIPD</h2>
                    <p className="text-sm text-gray-500">
                        Kelola NIPD yang valid untuk registrasi siswa
                    </p>
                </div>
                <button
                    onClick={() => setAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center text-sm"
                >
                    <Plus size={16} className="mr-1" /> Tambah NIPD
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari NIPD..."
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

                <div className="flex gap-3">
                    <Dropdown
                        value={status}
                        onChange={(v) =>
                            dispatch({ type: "SET_STATUS", value: v })
                        }
                        options={[
                            "Semua Status",
                            "Belum Terdaftar",
                            "Sudah Terdaftar",
                        ]}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                "ID",
                                "NIPD",
                                "Status Registrasi",
                                "Tanggal Dibuat",
                                "Terakhir Update",
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
                        {currentData.map((nipd) => (
                            <tr key={nipd.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {nipd.id}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {nipd.nipd}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {nipd.is_registered ? (
                                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-blue-600 mr-2" />
                                        )}
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                nipd.is_registered
                                            )}`}
                                        >
                                            {nipd.is_registered
                                                ? "Sudah Terdaftar"
                                                : "Belum Terdaftar"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {formatDate(nipd.created_at)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {formatDate(nipd.updated_at)}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(nipd)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit NIPD"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(nipd)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete NIPD"
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
                        Tidak ada data NIPD yang ditemukan.
                    </div>
                )}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => dispatch({ type: "SET_PAGE", value: p })}
            />

            {/* Add Modal */}
            <AddModal isOpen={addModal} onClose={() => setAddModal(false)} />

            {/* Edit Modal */}
            <EditModal
                nipd={editModal.nipd}
                isOpen={editModal.isOpen}
                onClose={closeEditModal}
            />

            {/* Delete Modal */}
            <DeleteModal
                nipd={deleteModal.nipd}
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
            />
        </section>
    );
}
