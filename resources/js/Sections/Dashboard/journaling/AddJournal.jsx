import React, { useEffect, useState } from "react";
import Button from "@/Components/Button";
import { router } from "@inertiajs/react";

const AddJournal = ({ onClose, books }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        id_buku: "",
        halaman_awal: "",
        halaman_akhir: "",
        deskripsi: "",
    });

    // Handle book selection change
    const handleBookChange = (e) => {
        setFormData({
            ...formData,
            id_buku: e.target.value
        });
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.id_buku) {
            newErrors.id_buku = 'Silakan pilih buku';
        }
        
        if (!formData.halaman_awal) {
            newErrors.halaman_awal = 'Halaman awal harus diisi';
        } else if (isNaN(formData.halaman_awal) || parseInt(formData.halaman_awal) < 1) {
            newErrors.halaman_awal = 'Halaman awal harus berupa angka positif';
        }
        
        if (!formData.halaman_akhir) {
            newErrors.halaman_akhir = 'Halaman akhir harus diisi';
        } else if (isNaN(formData.halaman_akhir) || parseInt(formData.halaman_akhir) < 1) {
            newErrors.halaman_akhir = 'Halaman akhir harus berupa angka positif';
        } else if (parseInt(formData.halaman_akhir) < parseInt(formData.halaman_awal)) {
            newErrors.halaman_akhir = 'Halaman akhir harus lebih besar dari halaman awal';
        }
        
        if (!formData.deskripsi.trim()) {
            newErrors.deskripsi = 'Isi jurnal harus diisi';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        // Use Inertia router to submit the form
        router.post(route('jurnal.store'), formData, {
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
            },
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-30"
                onClick={onClose}
            />
            <div className="relative bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg z-10">
                <button
                    className="absolute top-4 right-4 text-2xl"
                    onClick={onClose}
                >
                    ×
                </button>
                <h2 className="text-lg font-bold mb-10">Tambah Jurnal Baru</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">
                            Pilih Buku
                        </label>
                        <select 
                            className={`w-full border ${errors.id_buku ? 'border-red-500' : 'border-gray-400'} rounded-md p-2 mt-1 text-sm`}
                            value={formData.id_buku}
                            name="id_buku"
                            onChange={handleBookChange}
                        >
                            <option value="">Pilih Buku</option>
                            {books ? (
                                books.map((book) => (
                                    <option key={book.id} value={book.id} >
                                        {book.judul}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Tidak ada buku tersedia</option>
                            )}
                        </select>
                        {errors.id_buku && (
                            <p className="text-red-500 text-xs mt-1">{errors.id_buku}</p>
                        )}
                    </div>
                    <div className="flex flex-row w-full gap-5">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium">
                                Halaman Awal
                            </label>
                            <input
                                type="number"
                                name="halaman_awal"
                                className={`w-full border ${errors.halaman_awal ? 'border-red-500' : 'border-gray-400'} rounded-md p-2 mt-1 text-sm`}
                                value={formData.halaman_awal}
                                onChange={handleInputChange}
                                min="1"
                            />
                            {errors.halaman_awal && (
                                <p className="text-red-500 text-xs mt-1">{errors.halaman_awal}</p>
                            )}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium">
                                Halaman Akhir
                            </label>
                            <input
                                type="number"
                                name="halaman_akhir"
                                className={`w-full border ${errors.halaman_akhir ? 'border-red-500' : 'border-gray-400'} rounded-md p-2 mt-1 text-sm`}
                                value={formData.halaman_akhir}
                                onChange={handleInputChange}
                                min="1"
                            />
                            {errors.halaman_akhir && (
                                <p className="text-red-500 text-xs mt-1">{errors.halaman_akhir}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Isi Jurnal
                        </label>
                        <textarea
                            name="deskripsi"
                            className={`w-full border ${errors.deskripsi ? 'border-red-500' : 'border-gray-400'} rounded-md p-2 mt-1 text-sm`}
                            rows={8}
                            placeholder="Tulis refleksi, pemikiran, atau analisis kamu tentang buku ini"
                            value={formData.deskripsi}
                            onChange={handleInputChange}
                        />
                        {errors.deskripsi && (
                            <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button 
                            type="button" 
                            variant="outlined" 
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button 
                            type="submit" 
                            variant="filled"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Jurnal'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddJournal;