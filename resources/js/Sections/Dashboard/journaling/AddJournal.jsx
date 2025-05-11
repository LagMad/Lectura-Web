import React, { useState } from 'react';
import Button from '@/Components/Button';

const AddJournal = ({ onClose }) => {
    const [isPublished, setIsPublished] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
            <div className="relative bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg z-10">
                <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>×</button>
                <h2 className="text-lg font-bold mb-10">Tambah Jurnal Baru</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Pilih Buku</label>
                        <select className="w-full border border-gray-400 rounded-md p-2 mt-1 text-sm">
                            <option value="">Pilih Buku</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Judul Jurnal</label>
                        <input type="text" className="w-full border border-gray-400 rounded-md p-2 mt-1 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Isi Jurnal</label>
                        <textarea
                            className="w-full border border-gray-400 rounded-md p-2 mt-1 text-sm text-xs"
                            rows={8}
                            placeholder="Tulis refleksi, pemikiran, atau analisis kamu tentang buku ini"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsPublished(!isPublished)}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isPublished ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isPublished ? 'translate-x-6' : ''
                                    }`}
                            />
                        </button>
                        <span className="text-sm">Publikasikan jurnal</span>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="secondary">Simpan Sebagai Draft</Button>
                        <Button variant="filled">Publikasikan</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddJournal;