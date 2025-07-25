import { useState, useReducer, useMemo, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
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
    date: "Semua Tanggal",
    page: 1,
};

const CATEGORIES = [
    "Informasi Umum",
    "Layanan Perpustakaan",
    "Sumber Daya Digital",
    "Ruang Belajar",
];

const SelectInput = ({ value, onChange }) => (
    <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    >
        <option value="">— pilih kategori —</option>
        {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
                {cat}
            </option>
        ))}
    </select>
);

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_SEARCH":
            return { ...state, search: action.value, page: 1 };
        case "SET_STATUS":
            return { ...state, status: action.value, page: 1 };
        case "SET_DATE":
            return { ...state, date: action.value, page: 1 };
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
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white w-full md:w-fit"
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
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
                Halaman {page} dari {totalPages}
            </div>
            <div className="flex space-x-1">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent rounded"
                >
                    ‹
                </button>

                {/* Page numbers with ellipsis */}
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

                {/* Next button */}
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

// Edit Modal Component - Fixed Version
const EditModal = ({ faq, isOpen, onClose, onSave }) => {
    const { data, setData, put, processing, errors, reset } = useForm({
        nama: "",
        nipd: "",
        pertanyaan: "",
        jawaban: "",
        status: "pending",
        kategori: "",
    });

    // Reset form data when FAQ changes or modal opens
    useEffect(() => {
        if (faq && isOpen) {
            setData({
                nama: faq.nama || "",
                nipd: faq.nipd || "",
                pertanyaan: faq.pertanyaan || "",
                jawaban: faq.jawaban || "",
                status: faq.status || "pending",
                kategori: faq.kategori || "",
            });
        }
    }, [faq, isOpen, reset]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.faq.update", faq.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pt-0">
            <div className="bg-white rounded-lg p-6 w-full md:w-1/3 max-h-[600px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit FAQ</h2>
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
                            Nama Pengirim
                        </label>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData("nama", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.nama && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.nama}
                            </p>
                        )}
                    </div>

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
                            readOnly
                        />
                        {errors.nipd && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.nipd}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Pertanyaan
                        </label>
                        <textarea
                            value={data.pertanyaan}
                            onChange={(e) =>
                                setData("pertanyaan", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            required
                        />
                        {errors.pertanyaan && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.pertanyaan}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Jawaban
                        </label>
                        <textarea
                            value={data.jawaban}
                            onChange={(e) => setData("jawaban", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Masukkan jawaban..."
                        />
                        {errors.jawaban && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.jawaban}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Status
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData("status", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="answered">Answered</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.status}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">
                            Kategori
                        </label>
                        <SelectInput
                            value={data.kategori}
                            onChange={(e) =>
                                setData("kategori", e.target.value)
                            }
                        />
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

const AddModal = ({ isOpen, onClose }) => {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: "",
        nipd: auth?.user.nipd,
        pertanyaan: "",
        jawaban: "",
        kategori: "",
        status: "answered", // admin langsung “answered”
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.faq.store"), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pt-0">
            <div className="bg-white rounded-lg p-6 w-full md:w-1/3 max-h-[600px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Tambah FAQ</h2>
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
                            Nama Pengirim
                        </label>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData("nama", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.nama && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.nama}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            NIPD
                        </label>
                        <input
                            type="text"
                            value={data.nipd}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            readOnly
                        />
                        {errors.nipd && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.nipd}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Pertanyaan
                        </label>
                        <textarea
                            value={data.pertanyaan}
                            onChange={(e) =>
                                setData("pertanyaan", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            required
                        />
                        {errors.pertanyaan && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.pertanyaan}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Jawaban
                        </label>
                        <textarea
                            value={data.jawaban}
                            onChange={(e) => setData("jawaban", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Masukkan jawaban..."
                        />
                        {errors.jawaban && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.jawaban}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Status
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData("status", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="answered">Answered</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.status}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">
                            Kategori
                        </label>
                        <SelectInput
                            value={data.kategori}
                            onChange={(e) =>
                                setData("kategori", e.target.value)
                            }
                        />
                    </div>

                    <input
                        type="hidden"
                        value={data.status}
                        onChange={() => {}}
                    />

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
                            <Save className="w-4 h-4" />{" "}
                            {processing ? "Menyimpan…" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Delete Modal Component
const DeleteModal = ({ faq, isOpen, onClose, onDelete }) => {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route("admin.faq.destroy", faq.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-red-600">
                        Hapus FAQ
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
                        Apakah Anda yakin ingin menghapus FAQ ini?
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Pertanyaan:</strong> {faq?.pertanyaan}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                            <strong>Pengirim:</strong> {faq?.nama}
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

export default function ManajemenFaq({ faqList = [] }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState({ isOpen: false, faq: null });
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        faq: null,
    });
    const { search, status, page, date } = state;

    const filteredData = useMemo(() => {
        const now = new Date(); // current time in local TZ
        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        // make Monday the first day of the week (ISO‑8601)
        const mondayOffset = (startOfToday.getDay() + 6) % 7; // 0 = Mon, …, 6 = Sun
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - mondayOffset);

        return faqList.filter((faq) => {
            const matchSearch =
                faq.jawaban?.toLowerCase().includes(search.toLowerCase()) ||
                faq.nama?.toLowerCase().includes(search.toLowerCase()) ||
                faq.pertanyaan?.toLowerCase().includes(search.toLowerCase());
            const matchStatus =
                status === "Semua Status" || faq.status === status;
            // created_at is what we filter on – change to updated_at if you want
            const created = new Date(faq.created_at);
            const matchDate =
                date === "Semua Tanggal"
                    ? true
                    : date === "Hari Ini"
                    ? created >= startOfToday
                    : date === "Minggu Ini"
                    ? created >= startOfWeek
                    : date === "Bulan Ini"
                    ? created >= startOfMonth
                    : true; // fallback (should never hit)

            return matchSearch && matchStatus && matchDate;
        });
    }, [faqList, search, status, date]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, page]);

    const getStatusColor = (status) =>
        status === "answered"
            ? "text-green-600 bg-green-50"
            : status === "rejected"
            ? "text-red-600 bg-red-50"
            : "text-yellow-600 bg-yellow-50";

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

    const handleEdit = (faq) => {
        setEditModal({ isOpen: true, faq });
    };

    const handleDelete = (faq) => {
        setDeleteModal({ isOpen: true, faq });
    };

    const closeEditModal = () => {
        setEditModal({ isOpen: false, faq: null });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, faq: null });
    };

    return (
        <section className="flex flex-col w-full mx-auto pt-8 px-4 sm:px-6 lg:px-8 gap-5 font-[poppins]">
            <Head title="Manajemen FAQ" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold">Managemen FAQ</h2>
                    <p className="text-sm text-gray-500">
                        Kelola pertanyaan yang sering diajukan oleh pengguna
                    </p>
                </div>{" "}
                <button
                    onClick={() => setAddModal(true)}
                    className="w-full md:w-fit bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex justify-center items-center text-sm"
                >
                    <Plus size={16} className="mr-1" /> Tambah FAQ
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari Pertanyaan, Jawaban, atau Pengirim..."
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

                <div className="flex justify-between gap-3">
                    <Dropdown
                        value={state.date}
                        onChange={(v) =>
                            dispatch({ type: "SET_DATE", value: v })
                        }
                        options={[
                            "Semua Tanggal",
                            "Hari Ini",
                            "Minggu Ini",
                            "Bulan Ini",
                        ]}
                    />
                    <Dropdown
                        value={status}
                        onChange={(v) =>
                            dispatch({ type: "SET_STATUS", value: v })
                        }
                        options={[
                            "Semua Status",
                            "answered",
                            "pending",
                            "rejected",
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
                                "Kategori",
                                "Pertanyaan",
                                "Jawaban",
                                "Pengirim",
                                "Tanggal Masuk",
                                "Terakhir Edit",
                                "Status",
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
                        {currentData.map((faq, i) => (
                            <tr key={faq.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {faq.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {faq.kategori || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                    <div
                                        className="truncate"
                                        title={faq.pertanyaan}
                                    >
                                        {faq.pertanyaan}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                    <div
                                        className="truncate"
                                        title={faq.jawaban}
                                    >
                                        {faq.jawaban || "-"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {faq.nama}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {formatDate(faq.created_at)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {formatDate(faq.updated_at)}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                            faq.status
                                        )}`}
                                    >
                                        {faq.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(faq)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit FAQ"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(faq)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete FAQ"
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
                        Tidak ada data FAQ yang ditemukan.
                    </div>
                )}
            </div>

            {faqList.length > itemsPerPage && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) =>
                        dispatch({ type: "SET_PAGE", value: p })
                    }
                />
            )}

            {/* Add Modal */}
            <AddModal isOpen={addModal} onClose={() => setAddModal(false)} />

            {/* Edit Modal */}
            <EditModal
                faq={editModal.faq}
                isOpen={editModal.isOpen}
                onClose={closeEditModal}
            />

            {/* Delete Modal */}
            <DeleteModal
                faq={deleteModal.faq}
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
            />
        </section>
    );
}
