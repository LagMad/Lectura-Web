import { useState, useRef } from "react";

export default function TambahBuku() {
    const [formValues, setFormValues] = useState({
        judul: "",
        penulis: "",
        jumlahHalaman: "",
        kategori: "",
        penerbit: "",
        tahunTerbit: "",
        bahasa: "",
        deskripsi: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleNumericInput = (e) => {
        const { name, value } = e.target;
        if (/^\d*$/.test(value)) {
            setFormValues({
                ...formValues,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form values:", formValues);
        // Add your submission logic here
    };

    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full lg:ml-8 lg:mr-0 ml-4 mr-4 my-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Tambah Buku Baru</h1>
                <p className="text-gray-600">
                    Masukkan Detail Buku Baru yang akan dipilih
                </p>
            </div>

            <div className="w-full max-w-4xl py-8 px-4 sm:px-6 lg:px-8 bg-white rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Cover Upload Section */}
                        <div className="w-full md:w-1/4">
                            <div
                                className="bg-gray-200 rounded md:w-full mx-auto sm:w-1/2 w-3/4 aspect-[8/8] md:aspect-[11/12] flex items-center justify-center mb-2 overflow-hidden"
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
                                className="block text-center text-sm text-cust-blue cursor-pointer mt-2"
                            >
                                Pilih File
                            </label>
                        </div>

                        {/* Form Fields */}
                        <div className="flex-1">
                            <div className="space-y-4">
                                {/* Judul Buku */}
                                <div>
                                    <label
                                        htmlFor="judul"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Judul Buku
                                    </label>
                                    <input
                                        type="text"
                                        id="judul"
                                        name="judul"
                                        value={formValues.judul}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                {/* Penulis */}
                                <div>
                                    <label
                                        htmlFor="penulis"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Penulis
                                    </label>
                                    <input
                                        type="text"
                                        id="penulis"
                                        name="penulis"
                                        value={formValues.penulis}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                {/* Jumlah Halaman - Numbers Only */}
                                <div>
                                    <label
                                        htmlFor="jumlahHalaman"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Jumlah Halaman
                                    </label>
                                    <input
                                        type="text"
                                        id="jumlahHalaman"
                                        name="jumlahHalaman"
                                        value={formValues.jumlahHalaman}
                                        onChange={handleNumericInput}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                                className="w-full p-2 border border-gray-300 rounded"
                            />
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
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        {/* Tahun Terbit - Numbers Only */}
                        <div>
                            <label
                                htmlFor="tahunTerbit"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Tahun Terbit
                            </label>
                            <input
                                type="text"
                                id="tahunTerbit"
                                name="tahunTerbit"
                                value={formValues.tahunTerbit}
                                onChange={handleNumericInput}
                                className="w-full p-2 border border-gray-300 rounded"
                                maxLength={4}
                            />
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
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
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
                            className="w-full p-2 border border-gray-300 rounded"
                        ></textarea>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-cust-blue text-white rounded hover:bg-blue-700"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
