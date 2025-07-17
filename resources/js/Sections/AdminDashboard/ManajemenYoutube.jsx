/* ------------------------------------------------------------------
   components/Admin/ManajemenYoutube.jsx
------------------------------------------------------------------ */
import { useState, useEffect, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, X, Eye, EyeOff, Save, Search } from "lucide-react";

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
   MAIN SECTION
------------------------------------------------------------------ */
export default function ManajemenYoutube({ videos = [] }) {
    const [searchTerm, setSearchTerm] = useState("");

    /* ---------- pagination ---------- */
    const [page, setPage] = useState(1);
    const filteredVideos = useMemo(() => {
        return videos.filter(
            (video) =>
                video.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                video.pengunggah
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                video.created_by
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
    }, [videos, searchTerm]);

    const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);

    const currentData = useMemo(
        () =>
            filteredVideos.slice(
                (page - 1) * ITEMS_PER_PAGE,
                page * ITEMS_PER_PAGE
            ),
        [page, filteredVideos]
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
    }, [modal]);

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

    return (
        <section className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-5">
                <div>
                    <h2 className="text-2xl font-bold">Video Youtube</h2>
                    <p className="text-sm text-gray-500">
                        Kelola video youtube untuk ditampilkan di halaman
                        tentang.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setModal({ type: "add", item: null });
                    }}
                    className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" /> Tambah Video
                </button>
            </div>

            <div className="relative w-full mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Cari video berdasarkan judul, pengunggah, atau akun pengunggah..."
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
                            Pastikan video tersebut sudah dicentang perizinan
                            untuk dapat dipasang (embed) atau akan tampil "Video
                            Unavailable".
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
