import { useState, useRef } from "react";
import axios from "axios";

export default function EditBuku({ book }) {
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
        judul: book.judul || "",
        penulis: book.penulis || "",
        jumlah_halaman: book.jumlah_halaman?.toString() || "",
        kategori: book.kategori || "",
        penerbit: book.penerbit || "",
        tahun_terbit: book.tahun_terbit?.toString() || "",
        bahasa: book.bahasa || "",
        deskripsi: book.deskripsi || "",
        link: book.link || "",
        status: book.status || "Tersedia", // Use existing status or default to "Tersedia"
    });

    // State untuk error handling
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Ref untuk file input
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(book.cover_url || null);
    const bookId = book.id;

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

    // Handle file upload preview
    const handleFileChange = (e) => {
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

    // Form submission
    // Fix for the handleSubmit function in your EditBuku component

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData();

        // Add method spoofing for Laravel
        formData.append("_method", "PUT");

        // Add all form fields
        formData.append("judul", formValues.judul);
        formData.append("penulis", formValues.penulis);
        formData.append("jumlah_halaman", formValues.jumlah_halaman);
        formData.append("kategori", formValues.kategori);
        formData.append("penerbit", formValues.penerbit);
        formData.append("tahun_terbit", formValues.tahun_terbit);
        formData.append("bahasa", formValues.bahasa);
        formData.append("deskripsi", formValues.deskripsi);
        formData.append("link", formValues.link);
        formData.append("status", formValues.status);

        if (fileInputRef.current?.files[0]) {
            formData.append("cover", fileInputRef.current.files[0]);
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

            console.log("Submitting update for book ID:", bookId);

            // Use POST with method spoofing instead of PUT for form data
            const response = await axios.post(
                `/update-buku/${bookId}`,
                formData,
                { headers }
            );

            console.log("Update response:", response.data);

            setSubmitSuccess(true);

            // Scroll to top to show success message
            window.scrollTo(0, 0);

            // Optional: Reload the page after a short delay to show updated data
            // setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error("Terjadi kesalahan:", error);

            if (
                error.response &&
                error.response.data &&
                error.response.data.errors
            ) {
                setErrors(error.response.data.errors);
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
        window.location.href = "/admin-buku";
    };

    return (
        <div className="w-full lg:ml-8 lg:mr-0 ml-4 mr-4 my-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Buku</h1>
                <p className="text-gray-600">
                    Perbarui informasi buku yang ada
                </p>
            </div>

            {submitSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 w-fit">
                    Buku berhasil diperbarui!
                </div>
            )}

            {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-fit">
                    {errors.general}
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
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="coverUpload"
                                className="block text-center text-sm text-blue-600 cursor-pointer mt-2 hover:text-blue-800"
                            >
                                {previewUrl ? "Ganti Cover" : "Pilih File"}
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
                                    />
                                    {errors.jumlah_halaman && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.jumlah_halaman}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="link"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Link Buku{" "}
                                    </label>
                                    <input
                                        type="text"
                                        id="link"
                                        name="link"
                                        value={formValues.link}
                                        onChange={handleInputChange}
                                        className={`w-full p-2 border ${
                                            errors.link
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded`}
                                    />
                                    {errors.link && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.link}
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
                            <input
                                type="text"
                                id="kategori"
                                name="kategori"
                                value={formValues.kategori}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${
                                    errors.kategori
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded`}
                            />
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

                        {/* Status Dropdown - New field */}
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formValues.status}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${
                                    errors.status
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded`}
                            >
                                <option value="Tersedia">Tersedia</option>
                                <option value="Tidak Tersedia">
                                    Tidak Tersedia
                                </option>
                                <option value="Terkendala">Terkendala</option>
                            </select>
                            {errors.status && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.status}
                                </p>
                            )}
                        </div>
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
                            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
