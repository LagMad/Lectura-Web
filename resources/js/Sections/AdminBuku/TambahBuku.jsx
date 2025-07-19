import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function TambahBuku({ kategori }) {
    const getCsrfToken = () => {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
            return metaTag.getAttribute("content");
        }

        // Jika tidak ada meta tag, coba dapatkan dari cookie (Laravel biasanya menyimpan XSRF-TOKEN cookie)
        const getCookieValue = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
        };

        return getCookieValue("XSRF-TOKEN");
    };

    // State untuk form values
    const [formValues, setFormValues] = useState({
        judul: "",
        penulis: "",
        jumlah_halaman: "",
        kategori: "",
        penerbit: "",
        tahun_terbit: "",
        bahasa: "",
        karya_oleh: "Koleksi Perpustakaan",
        deskripsi: "",
    });

    // State untuk error handling
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [duplicateBooks, setDuplicateBooks] = useState(null);

    // Ref untuk file input
    const coverInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState("");

    // Handle regular input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }
    };

    // Handle numeric input validation
    const handleNumericInput = (e) => {
        const { name, value } = e.target;
        if (/^\d*$/.test(value)) {
            setFormValues({
                ...formValues,
                [name]: value,
            });

            // Clear error when field is edited
            if (errors[name]) {
                setErrors({
                    ...errors,
                    [name]: null,
                });
            }
        }
    };

    // Handle cover file upload preview
    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);

                // Clear cover error if exists
                if (errors.cover) {
                    setErrors({
                        ...errors,
                        cover: null,
                    });
                }
            } else {
                setErrors({
                    ...errors,
                    cover: "File harus berupa gambar (JPG, PNG, GIF)",
                });
                e.target.value = ""; // Reset the input
            }
        }
    };

    // Handle buku file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if file is allowed type
            const allowedTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            ];

            if (allowedTypes.includes(file.type)) {
                setSelectedFileName(file.name);

                // Clear file error if exists
                if (errors.file_buku) {
                    setErrors({
                        ...errors,
                        file_buku: null,
                    });
                }
            } else {
                setErrors({
                    ...errors,
                    file_buku:
                        "File harus berupa PDF, DOC, DOCX, XLS, XLSX, PPT, atau PPTX",
                });
                e.target.value = ""; // Reset the input
                setSelectedFileName("");
            }
        }
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        // Reset any previous duplicate warning
        setDuplicateBooks(null);

        const formData = new FormData();
        formData.append("judul", formValues.judul);
        formData.append("penulis", formValues.penulis);
        formData.append("jumlah_halaman", formValues.jumlah_halaman);
        formData.append("kategori", formValues.kategori);
        formData.append("penerbit", formValues.penerbit);
        formData.append("tahun_terbit", formValues.tahun_terbit);
        formData.append("bahasa", formValues.bahasa);
        formData.append("karya_oleh", formValues.karya_oleh);
        formData.append("deskripsi", formValues.deskripsi);

        // Check if file is uploaded and set status accordingly
        const hasFile = fileInputRef.current?.files[0];
        const status = hasFile ? "Tersedia" : "Tidak Tersedia";
        formData.append("status", status);

        if (coverInputRef.current?.files[0]) {
            formData.append("cover", coverInputRef.current.files[0]);
        }

        // Append the file_buku if present
        if (fileInputRef.current?.files[0]) {
            formData.append("file_buku", fileInputRef.current.files[0]);
        }

        try {
            const csrfToken = getCsrfToken();

            const headers = {
                "Content-Type": "multipart/form-data",
            };

            // Only add CSRF token if it exists
            if (csrfToken) {
                headers["X-CSRF-TOKEN"] = csrfToken;
            }

            const response = await axios.post("/simpan-buku", formData, {
                headers,
            });

            // Check if the response indicates duplicate books
            if (!response.data.success && response.data.potential_duplicates) {
                // Set duplicate books to show the warning
                setDuplicateBooks(response.data);
                return;
            }

            // Only proceed if the operation was successful
            if (response.data.success) {
                setSubmitSuccess(true);
                setPreviewUrl(null);
                setSelectedFileName("");
                if (coverInputRef.current) coverInputRef.current.value = "";
                if (fileInputRef.current) fileInputRef.current.value = "";

                // Reset form values
                setFormValues({
                    judul: "",
                    penulis: "",
                    jumlah_halaman: "",
                    kategori: "",
                    penerbit: "",
                    tahun_terbit: "",
                    bahasa: "",
                    karya_oleh: "",
                    deskripsi: "",
                });
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);

            if (error.response) {
                if (
                    error.response.data &&
                    error.response.data.potential_duplicates
                ) {
                    // Ada buku serupa, tampilkan informasi
                    setDuplicateBooks(error.response.data);
                } else if (error.response.data && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    setErrors({
                        general:
                            error.response.data.message ||
                            "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
                    });
                }
            } else {
                setErrors({
                    general:
                        "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel button
    const handleCancel = () => {
        window.location.href = "/admin-tambah-buku";
    };

    return (
        <div className="w-full lg:ml-8 lg:mr-0 ml-4 mr-4 my-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Tambah Buku Baru</h1>
                <p className="text-gray-600">
                    Masukkan Detail Buku Baru yang akan ditambahkan
                </p>
            </div>

            {submitSuccess && !duplicateBooks && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 w-fit">
                    Buku berhasil disimpan!
                </div>
            )}

            {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-fit">
                    {errors.general}
                </div>
            )}

            {duplicateBooks && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4 w-fit">
                    <h3 className="font-bold">Buku serupa sudah diupload!</h3>

                    <p className="mb-2">
                        Kami menemukan{" "}
                        {duplicateBooks.potential_duplicates.length} buku serupa
                        dalam sistem:
                    </p>

                    <div className="max-h-60 overflow-y-auto bg-white p-3 rounded border border-yellow-300 mb-3">
                        {duplicateBooks.potential_duplicates.map(
                            (book, index) => (
                                <div
                                    key={index}
                                    className="mb-2 pb-2 border-b border-yellow-200 last:border-b-0"
                                >
                                    <p className="font-semibold">
                                        {book.judul}
                                    </p>
                                    <p>Penulis: {book.penulis}</p>
                                    <p>Jumlah halaman: {book.jumlah_halaman}</p>
                                    {book.penerbit && (
                                        <p>Penerbit: {book.penerbit}</p>
                                    )}
                                    {book.tahun_terbit && (
                                        <p>Tahun terbit: {book.tahun_terbit}</p>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            <div className="w-full max-w-4xl py-8 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Cover Upload Section */}
                        <div className="w-full md:w-1/4">
                            <div
                                className="bg-gray-200 rounded md:w-full mx-auto sm:w-1/2 w-3/4 aspect-[8/8] md:aspect-[10/12] flex items-center justify-center mb-2 overflow-hidden"
                                style={{ position: "relative" }}
                            >
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Cover Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500 text-sm text-center px-4">
                                        Unggah Cover
                                    </span>
                                )}
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                id="coverUpload"
                                accept="image/*"
                                ref={coverInputRef}
                                onChange={handleCoverChange}
                            />
                            <label
                                htmlFor="coverUpload"
                                className="block text-center text-sm text-blue-600 cursor-pointer mt-2 hover:text-blue-800"
                            >
                                Pilih File
                            </label>
                            {errors.cover && (
                                <p className="text-red-500 text-xs mt-1 text-center">
                                    {errors.cover}
                                </p>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="flex-1">
                            <div className="space-y-2">
                                {/* Judul Buku */}
                                <div>
                                    <label
                                        htmlFor="judul"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Judul Buku{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="judul"
                                        name="judul"
                                        value={formValues.judul}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border ${
                                            errors.judul
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded`}
                                        required
                                    />
                                    {errors.judul && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.judul}
                                        </p>
                                    )}
                                </div>

                                {/* Penulis */}
                                <div>
                                    <label
                                        htmlFor="penulis"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Penulis{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="penulis"
                                        name="penulis"
                                        value={formValues.penulis}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border ${
                                            errors.penulis
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded`}
                                        required
                                    />
                                    {errors.penulis && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.penulis}
                                        </p>
                                    )}
                                </div>

                                {/* Jumlah Halaman - Numbers Only */}
                                <div>
                                    <label
                                        htmlFor="jumlah_halaman"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Jumlah Halaman{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="jumlah_halaman"
                                        name="jumlah_halaman"
                                        value={formValues.jumlah_halaman}
                                        onChange={handleNumericInput}
                                        className={`w-full p-2 border ${
                                            errors.jumlah_halaman
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded`}
                                        required
                                    />
                                    {errors.jumlah_halaman && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.jumlah_halaman}
                                        </p>
                                    )}
                                </div>

                                {/* File Buku Upload - Replaced Link input */}
                                <div>
                                    <label
                                        htmlFor="file_buku"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        File Buku (PDF, DOC, DOCX, XLS, XLSX,
                                        PPT, PPTX)
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="file_buku"
                                            name="file_buku"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                        />
                                        <label
                                            htmlFor="file_buku"
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300"
                                        >
                                            Pilih File
                                        </label>
                                        <span className="ml-3 text-sm text-gray-600 truncate max-w-[250px]">
                                            {selectedFileName ||
                                                "Tidak ada file yang dipilih"}
                                        </span>
                                    </div>
                                    {errors.file_buku && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.file_buku}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {/* Kategori */}
                        <div>
                            <label
                                htmlFor="kategori"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Kategori
                            </label>
                            <select
                                id="kategori"
                                name="kategori"
                                value={formValues.kategori}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${
                                    errors.kategori
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded`}
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {kategori.map((item) => (
                                    <option key={item.id} value={item.kategori}>
                                        {item.kategori}
                                    </option>
                                ))}
                            </select>
                            {errors.kategori && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.kategori}
                                </p>
                            )}
                        </div>

                        {/* Penerbit */}
                        <div>
                            <label
                                htmlFor="penerbit"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Penerbit
                            </label>
                            <input
                                type="text"
                                id="penerbit"
                                name="penerbit"
                                value={formValues.penerbit}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${
                                    errors.penerbit
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded`}
                            />
                            {errors.penerbit && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.penerbit}
                                </p>
                            )}
                        </div>

                        {/* Tahun Terbit - Numbers Only */}
                        <div>
                            <label
                                htmlFor="tahun_terbit"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Tahun Terbit
                            </label>
                            <input
                                type="text"
                                id="tahun_terbit"
                                name="tahun_terbit"
                                value={formValues.tahun_terbit}
                                onChange={handleNumericInput}
                                className={`w-full p-2 border ${
                                    errors.tahun_terbit
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded`}
                                maxLength={4}
                            />
                            {errors.tahun_terbit && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.tahun_terbit}
                                </p>
                            )}
                        </div>

                        {/* Bahasa */}
                        <div>
                            <label
                                htmlFor="bahasa"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Bahasa
                            </label>
                            <input
                                type="text"
                                id="bahasa"
                                name="bahasa"
                                value={formValues.bahasa}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${
                                    errors.bahasa
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded`}
                            />
                            {errors.bahasa && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.bahasa}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Karya Oleh */}
                    <div className="mt-6">
                        <label
                            htmlFor="karya_oleh"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Karya Oleh
                        </label>
                        <select
                            id="karya_oleh"
                            name="karya_oleh"
                            value={formValues.karya_oleh}
                            onChange={handleInputChange}
                            className={`w-full p-2 border ${
                                errors.karya_oleh
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded`}
                        >
                            <option value="Koleksi Perpustakaan">
                                Koleksi Perpustakaan
                            </option>
                            <option value="Siswa">Siswa</option>
                            <option value="Guru">Guru</option>
                        </select>
                        {errors.karya_oleh && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.karya_oleh}
                            </p>
                        )}
                    </div>

                    {/* Deskripsi */}
                    <div className="mt-6">
                        <label
                            htmlFor="deskripsi"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Deskripsi
                        </label>
                        <textarea
                            id="deskripsi"
                            name="deskripsi"
                            value={formValues.deskripsi}
                            onChange={handleInputChange}
                            rows={5}
                            className={`w-full p-2 border ${
                                errors.deskripsi
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded`}
                        ></textarea>
                        {errors.deskripsi && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.deskripsi}
                            </p>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                            onClick={handleCancel}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
