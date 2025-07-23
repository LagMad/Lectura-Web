import { useState, useEffect, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    X,
    Eye,
    EyeOff,
    Save,
    Search,
    Upload,
    User,
} from "lucide-react";

/* ------------ Modal Wrapper ------------ */
const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-auto py-16">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>
                {children}
            </div>
        </div>
    );
};

/* ------------ Pagination helper ------------- */
const ITEMS_PER_PAGE = 10;
function Pagination({ page, totalPages, onChange }) {
    return (
        <div className="flex sticky left-0 items-center justify-between px-6 py-3">
            <div className="text-sm text-gray-700">
                Halaman {page} dari {totalPages}
            </div>
            <div className="flex space-x-1">
                <button
                    onClick={() => onChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300"
                >
                    ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => onChange(i + 1)}
                        className={`px-3 py-2 text-sm rounded ${
                            page === i + 1
                                ? "bg-blue-500 text-white"
                                : "text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => onChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300"
                >
                    ›
                </button>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------ */
export default function ManajemenPoster({ posters = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    /* ---------- pagination ---------- */
    const [page, setPage] = useState(1);
    const filteredPosters = useMemo(() => {
        return posters.filter(
            (item) =>
                item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.karya_oleh
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
    }, [posters, searchTerm]);

    const totalPages = Math.ceil(filteredPosters.length / ITEMS_PER_PAGE);

    const currentData = useMemo(
        () =>
            filteredPosters.slice(
                (page - 1) * ITEMS_PER_PAGE,
                page * ITEMS_PER_PAGE
            ),
        [page, filteredPosters]
    );

    useEffect(() => setPage(1), [posters]);

    /* ---------- modal state ---------- */
    const [modal, setModal] = useState({ type: null, item: null });

    /* ---------- form (add / edit) ---------- */
    const { data, setData, reset, errors, processing, post } = useForm({
        judul: "",
        karya_oleh: "",
        image: null,
        is_active: false,
    });

    /* Prefill ketika 'edit' */
    useEffect(() => {
        if (modal.type === "edit" && modal.item) {
            setData({
                judul: modal.item.judul,
                karya_oleh: modal.item.karya_oleh,
                image: null,
                is_active: modal.item.is_active,
            });
            setImagePreview(modal.item.image_path || null);
        }
    }, [modal]);

    useEffect(() => {
        if (modal.type === "add") {
            reset();
            setData({
                judul: "",
                karya_oleh: "",
                image: null,
                is_active: false,
            });
            setImagePreview(null);
        }
    }, [modal]);

    const closeModal = () => {
        setModal({ type: null, item: null });
        reset();
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (modal.type === "edit") {
            const fd = new FormData();
            fd.append("_method", "PUT"); // <-- spoof
            fd.append("judul", data.judul);
            fd.append("karya_oleh", data.karya_oleh);
            fd.append("is_active", data.is_active ? 1 : 0);
            if (data.image) fd.append("image", data.image);

            router.post(route("poster.update", modal.item.id), fd, {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    reset();
                    setImagePreview(null);
                },
            });
        } else {
            post(route("poster.store"), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    reset();
                    setImagePreview(null);
                },
            });
        }
    };

    /* ---------- delete ---------- */
    const confirmDelete = (item) => {
        router.delete(route("poster.destroy", item.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    return (
        <section className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-5">
                <div>
                    <h2 className="text-2xl font-bold">Manajemen Poster</h2>
                    <p className="text-sm text-gray-500">
                        Kelola poster untuk ditampilkan di beranda.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setModal({ type: "add", item: null });
                    }}
                    className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" /> Tambah Poster
                </button>
            </div>

            <div className="relative w-full mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Cari poster berdasarkan judul atau pembuat karya..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        {[
                            "#",
                            "Gambar",
                            "Judul",
                            "Karya Oleh",
                            "Status",
                            "Aksi",
                        ].map((h) => (
                            <th
                                key={h}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {h}
                            </th>
                        ))}
                    </thead>
                    <tbody>
                        {currentData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{item.id}</td>
                                <td className="px-6 py-4">
                                    {item.image_path ? (
                                        <img
                                            src={item.image_path}
                                            alt={item.judul}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">
                                                No img
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="truncate" title={item.judul}>
                                        {item.judul}
                                    </div>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div
                                        className="truncate inline-flex items-center gap-1"
                                        title={item.karya_oleh}
                                    >
                                        <User className="w-3 h-3 text-gray-400" />
                                        {item.karya_oleh}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {item.is_active ? (
                                        <Eye className="w-4 h-4 text-green-600 inline" />
                                    ) : (
                                        <EyeOff className="w-4 h-4 text-gray-400 inline" />
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
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                setModal({
                                                    type: "edit",
                                                    item: item,
                                                })
                                            }
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setModal({
                                                    type: "delete",
                                                    item: item,
                                                })
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {currentData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-8 text-gray-500"
                                >
                                    Belum ada poster.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* Pagination */}
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                />
            </div>

            {/* ------------------ ADD / EDIT MODAL ------------------ */}
            <Modal
                show={modal.type === "add" || modal.type === "edit"}
                onClose={closeModal}
            >
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-4"
                    encType="multipart/form-data"
                >
                    <h3 className="text-lg font-semibold">
                        {modal.type === "add"
                            ? "Tambah Poster"
                            : "Edit Poster"}
                    </h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Judul Poster
                        </label>
                        <input
                            type="text"
                            value={data.judul}
                            onChange={(e) => setData("judul", e.target.value)}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Judul poster "
                            required
                        />
                        {errors.judul && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.judul}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Karya Oleh
                        </label>
                        <input
                            type="text"
                            value={data.karya_oleh}
                            onChange={(e) =>
                                setData("karya_oleh", e.target.value)
                            }
                            placeholder="Nama pembuat karya"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.karya_oleh && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.karya_oleh}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Gambar Poster
                        </label>
                        <div className="space-y-2">
                        {modal.type === "add" && (
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleImageChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            )}
                            {modal.type === "edit" && (
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleImageChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                            <div className="text-xs text-gray-500">
                                Format: JPEG, JPG, PNG. Maksimal 10MB.
                            </div>
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-48 h-48 object-cover rounded border"
                                    />
                                </div>
                            )}
                        </div>
                        {errors.image && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.image}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.checked)
                            }
                            className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="is_active" className="text-sm">
                            Aktif
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
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
            </Modal>

            {/* ------------------ DELETE MODAL ------------------ */}
            <Modal show={modal.type === "delete"} onClose={closeModal}>
                <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-red-600">
                        Hapus Poster 
                    </h3>
                    <p className="text-gray-600">
                        Yakin ingin menghapus poster &nbsp;
                        <strong>{modal.item?.judul}</strong>?
                    </p>
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => confirmDelete(modal.item)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    );
}