/* ------------------------------------------------------------------
   components/Admin/ManajemenYoutube.jsx
------------------------------------------------------------------ */
import { useState, useEffect, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, X, Eye, EyeOff, Save } from "lucide-react";

/* ------------ Modal Wrapper (re‑use dari komponen Anda) ------------ */
const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-auto py-16">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl relative">
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

/* ------------ Pagination helper (optional client‑side) ------------- */
const PAGE_SIZE = 10;
const Pagination = ({ page, total, onChange }) => {
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between mt-4 text-sm">
            <button
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 text-gray-500 disabled:text-gray-300"
            >
                ‹
            </button>
            <div className="space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => onChange(i + 1)}
                        className={`px-3 py-2 rounded ${
                            page === i + 1
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 text-gray-500 disabled:text-gray-300"
            >
                ›
            </button>
        </div>
    );
};

/* ------------------------------------------------------------------
   MAIN SECTION
------------------------------------------------------------------ */
export default function ManajemenYoutube({ videos = [] }) {
    /* ---------- pagination ---------- */
    const [page, setPage] = useState(1);
    const currentData = useMemo(
        () => videos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [page, videos]
    );
    useEffect(() => setPage(1), [videos]);

    /* ---------- modal state ---------- */
    const [modal, setModal] = useState({ type: null, item: null });

    /* ---------- form (add / edit) ---------- */
    const { data, setData, reset, errors, processing, post, put } = useForm({
        judul: "",
        link: "",
        is_active: false,
        pengunggah: "",
    });

    /* Prefill ketika ‘edit’ */
    useEffect(() => {
        if (modal.type === "edit" && modal.item) {
            setData({
                judul: modal.item.judul,
                link: modal.item.link,
                is_active: modal.item.is_active,
                pengunggah: modal.item.pengunggah ?? "",
            });
        }
    }, [modal]);

    useEffect(() => {
        if (modal.type === "add") {
            reset();
            setData({
                judul: "",
                link: "",
                is_active: false,
                pengunggah: "",
            });
        }
    }, [modal])

    const closeModal = () => {
        setModal({ type: null, item: null });
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                reset();
            },
        };

        if (modal.type === "add") {
            post(route("admin.video.store"), options);
        } else if (modal.type === "edit") {
            put(route("admin.video.update", modal.item.id), options);
        }
    };

    /* ---------- delete ---------- */
    const confirmDelete = (item) => {
        router.delete(route("admin.video.destroy", item.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    /* ---------------------------- RENDER ---------------------------- */
    return (
        <section className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Video YouTube</h2>
                <button
                    onClick={() => {
                        setModal({ type: "add", item: null });
                    }}
                    className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" /> Tambah Video
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        {[
                            "#",
                            "Judul",
                            "Link",
                            "Pengunggah",
                            "Diunggah Menggunakan Akun",
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
                        {currentData.map((v) => (
                            <tr key={v.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{v.id}</td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="truncate" title={v.judul}>
                                        {v.judul}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-blue-600 underline">
                                    <a
                                        href={v.link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {v.link}
                                    </a>
                                </td>
                                <td className="px-6 py-4">{v.pengunggah}</td>
                                <td className="px-6 py-4">{v.created_by}</td>
                                <td className="px-6 py-4">
                                    {v.is_active ? (
                                        <Eye className="w-4 h-4 text-green-600 inline" />
                                    ) : (
                                        <EyeOff className="w-4 h-4 text-gray-400 inline" />
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                setModal({
                                                    type: "edit",
                                                    item: v,
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
                                                    item: v,
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
                                    colSpan={5}
                                    className="text-center py-8 text-gray-500"
                                >
                                    Belum ada video.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination page={page} total={videos.length} onChange={setPage} />

            {/* ------------------ ADD / EDIT MODAL ------------------ */}
            <Modal
                show={modal.type === "add" || modal.type === "edit"}
                onClose={closeModal}
            >
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold">
                        {modal.type === "add" ? "Tambah Video" : "Edit Video"}
                    </h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Judul
                        </label>
                        <input
                            type="text"
                            value={data.judul}
                            onChange={(e) => setData("judul", e.target.value)}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.judul && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.judul}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            URL YouTube
                        </label>
                        <div className="text-gray-500 text-xs mb-1">
                            Pastikan video tersebut sudah dicentang perizinan untuk dapat dipasang (embed) atau akan tampil "Video Unavailable".
                        </div>
                        <input
                            type="url"
                            value={data.link}
                            onChange={(e) => setData("link", e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=XXXX"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.link && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.link}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Pengunggah
                        </label>
                        <input
                            type="text"
                            value={data.pengunggah}
                            onChange={(e) =>
                                setData("pengunggah", e.target.value)
                            }
                            placeholder="Nama pengunggah"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.pengunggah && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.pengunggah}
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
                        Hapus Video
                    </h3>
                    <p className="text-gray-600">
                        Yakin ingin menghapus video&nbsp;
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
