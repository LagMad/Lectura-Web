import { useState, useEffect, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, X, FileText, Eye } from "lucide-react";

const ITEMS_PER_PAGE = 10;

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
export default function StaffPerpustakaan({ staff = [] }) {
    const [modal, setModal] = useState({ type: null, item: null });
    const [page, setPage] = useState(1);

    /* ---------- PAGINATION ---------- */
    const totalPages = Math.ceil(staff.length / ITEMS_PER_PAGE);
    const currentStaff = useMemo(
        () => staff.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
        [staff, page]
    );

    // reset ke halaman 1 kalau data berubah (mis. habis tambah / hapus)
    useEffect(() => setPage(1), [staff]);

    /* ------------------ ADD / EDIT FORM ------------------ */
    const { data, setData, reset, errors, processing, post, put } = useForm({
        nama: "",
        jabatan: "",
        photo: null,
        file_cv: null,
    });

    /* Prefill form when editing */
    useEffect(() => {
        if (modal.type === "edit" && modal.item) {
            setData({
                nama: modal.item.nama ?? "",
                jabatan: modal.item.jabatan ?? "",
                photo: null,
                file_cv: null,
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
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                reset();
            },
            onError: (errors) => {
                console.log("Form errors:", errors);
            },
        };

        /* --- TAMBAH --- */
        if (modal.type === "add") {
            post(route("staff.store"), options);
            return;
        }

        /* --- EDIT --- */
        if (modal.type === "edit" && modal.item) {
            // For Laravel, we need to use POST with _method spoofing for file uploads
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("nama", data.nama);
            formData.append("jabatan", data.jabatan);
            if (data.photo) formData.append("photo", data.photo);
            if (data.file_cv) formData.append("file_cv", data.file_cv);

            router.post(route("staff.update", modal.item.id), formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                    reset();
                },
                onError: (errors) => {
                    console.log("Update errors:", errors);
                },
            });
        }
    };

    /* ------------------ DELETE ------------------ */
    const confirmDelete = (item) => {
        router.delete(route("staff.destroy", item.id), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Delete success");
            },
            onError: (errors) => {
                console.log("Delete errors:", errors);
            },
        });
        closeModal();
    };

    /* ------------------ JSX ------------------ */
    return (
        <section className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-5">
                <div>
                    <h2 className="text-2xl font-bold">Staf Perpustakaan</h2>
                    <p className="text-sm text-gray-500">
                        Kelola staf perpustakaan yang akan ditampilkan di
                        halaman "tentang."
                    </p>
                </div>
                <button
                    onClick={() => setModal({ type: "add", item: null })}
                    className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Tambah Staff
                </button>
            </div>

            <div className="relative overflow-x-scroll bg-white shadow rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {["#", "Foto", "Nama", "Jabatan", "CV", "Aksi"].map(
                                (h) => (
                                    <th
                                        key={h}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {h}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {currentStaff.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{s.id}</td>
                                <td className="px-6 py-4">
                                    {s.photo_path ? (
                                        <img
                                            src={s.photo_path}
                                            alt={s.nama}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-xs">
                                                No Photo
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">{s.nama}</td>
                                <td className="px-6 py-4">{s.jabatan}</td>
                                <td className="px-6 py-4">
                                    {s.link ? (
                                        <a
                                            href={s.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <FileText className="w-4 h-4" />
                                            <span className="text-xs">
                                                {s.original_filename || "CV"}
                                            </span>
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-xs">
                                            No CV
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                setModal({
                                                    type: "edit",
                                                    item: s,
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
                                                    item: s,
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
                        {staff.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-8 text-gray-500"
                                >
                                    Belum ada data staf.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                />
            </div>

            {/* ---------------- ADD / EDIT MODAL ---------------- */}
            <Modal
                show={modal.type === "add" || modal.type === "edit"}
                onClose={closeModal}
            >
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold">
                        {modal.type === "add" ? "Tambah Staf" : "Edit Staf"}
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.nama}
                            onChange={(e) => setData("nama", e.target.value)}
                            required
                        />
                        {errors.nama && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.nama}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jabatan
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.jabatan}
                            onChange={(e) => setData("jabatan", e.target.value)}
                            required
                        />
                        {errors.jabatan && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.jabatan}
                            </p>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                            Masukkan "Kepala Perpustakaan" agar posisi di paling
                            atas
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Foto
                        </label>
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="file_foto"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition-colors"
                            >
                                Pilih Foto
                            </label>
                            <input
                                id="file_foto"
                                name="file_foto"
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={(e) =>
                                    setData("photo", e.target.files[0])
                                }
                            />
                            <span className="text-sm text-gray-600 truncate max-w-[250px]">
                                {data.photo?.name ||
                                    "Tidak ada file yang dipilih"}
                            </span>
                        </div>
                        {modal.type === "edit" && modal.item?.photo_path && (
                            <div className="mt-2">
                                <img
                                    src={modal.item.photo_path}
                                    alt="Current photo"
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Foto saat ini
                                </p>
                            </div>
                        )}
                        {errors.photo && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.photo}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            File CV
                        </label>
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="file_cv"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition-colors"
                            >
                                Pilih File CV
                            </label>
                            <input
                                id="file_cv"
                                name="file_cv"
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) =>
                                    setData("file_cv", e.target.files[0])
                                }
                            />
                            <span className="text-sm text-gray-600 truncate max-w-[250px]">
                                {data.file_cv?.name ||
                                    "Tidak ada file yang dipilih"}
                            </span>
                        </div>
                        {modal.type === "edit" && modal.item?.link && (
                            <div className="mt-2">
                                <a
                                    href={modal.item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    <FileText className="w-4 h-4" />
                                    {modal.item.original_filename ||
                                        "CV saat ini"}
                                </a>
                            </div>
                        )}
                        {errors.file_cv && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.file_cv}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ---------------- DELETE MODAL ---------------- */}
            <Modal show={modal.type === "delete"} onClose={closeModal}>
                <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-red-600">
                        Hapus Staf
                    </h3>
                    <p className="text-gray-600">
                        Apakah Anda yakin ingin menghapus staf&nbsp;
                        <strong>{modal.item?.nama}</strong>?
                    </p>
                    <p className="text-sm text-gray-500">
                        Foto dan file CV yang terkait juga akan dihapus secara
                        permanen.
                    </p>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => confirmDelete(modal.item)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
