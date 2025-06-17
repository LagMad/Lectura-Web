import React, { useReducer, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Search, ChevronDown, Edit, Trash2 } from "lucide-react";

const faqData = [
    { id: '#FAQ001', question: 'Bagaimana cara meminjam buku di perpustakaan?', author: 'Budi Santoso', date: '08 Mei 2025', status: 'Sudah Dijawab' },
    { id: '#FAQ002', question: 'Berapa lama batas waktu peminjaman buku?', author: 'Dewi Lestari', date: '06 Mei 2025', status: 'Belum Dijawab' },
    { id: '#FAQ003', question: 'Apakah ada denda jika terlambat mengembalikan buku?', author: 'Eja Sutedja', date: '03 Mei 2025', status: 'Belum Dijawab' },
    { id: '#FAQ004', question: 'Bagaimana cara mengakses e-book di perpustakaan digital?', author: 'Anita Wijaya', date: '03 Mei 2025', status: 'Sudah Dijawab' },
    { id: '#FAQ005', question: 'Apakah perpustakaan buka pada hari libur nasional?', author: 'Siti Nurmaliza', date: '02 Mei 2025', status: 'Sudah Dijawab' },
    { id: '#FAQ006', question: 'Bagaimana cara mendaftar menjadi anggota perpustakaan?', author: 'Ahmad Rizki', date: '01 Mei 2025', status: 'Belum Dijawab' },
    { id: '#FAQ007', question: 'Apakah bisa meminjam buku tanpa kartu perpustakaan?', author: 'Maya Sari', date: '30 Apr 2025', status: 'Sudah Dijawab' },
    { id: '#FAQ008', question: 'Dimana lokasi perpustakaan cabang terdekat?', author: 'Rudi Hartono', date: '29 Apr 2025', status: 'Belum Dijawab' },
    { id: '#FAQ009', question: 'Apakah ada layanan reservasi buku online?', author: 'Linda Putri', date: '28 Apr 2025', status: 'Sudah Dijawab' },
    { id: '#FAQ012', question: 'Bagaimana cara mengunduh e-book gratis?', author: 'Bayu Setiawan', date: '25 Apr 2025', status: 'Belum Dijawab' }
];

const initialState = {
    search: '',
    status: 'Semua Status',
    date: 'Semua Tanggal',
    page: 1,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_SEARCH': return { ...state, search: action.value, page: 1 };
        case 'SET_STATUS': return { ...state, status: action.value, page: 1 };
        case 'SET_DATE': return { ...state, date: action.value };
        case 'SET_PAGE': return { ...state, page: action.value };
        default: return state;
    }
}

const itemsPerPage = 5;

export default function ManajemenFaq() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { search, status, page } = state;

    const filteredData = useMemo(() => {
        return faqData.filter(faq => {
            const matchSearch = faq.question.toLowerCase().includes(search.toLowerCase()) || faq.author.toLowerCase().includes(search.toLowerCase());
            const matchStatus = status === 'Semua Status' || faq.status === status;
            return matchSearch && matchStatus;
        });
    }, [search, status]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, page]);

    const getStatusColor = (status) => status === 'Sudah Dijawab' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50';

    return (
        <section className="w-full mx-auto pt-8 px-4 sm:px-6 lg:px-8 font-[poppins]">
            <Head title="Manajemen FAQ" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold">Managemen FAQ</h2>
                <p className="text-sm text-gray-500">Kelola pertanyaan yang sering diajukan oleh pengguna</p>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari Pertanyaan..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => dispatch({ type: 'SET_SEARCH', value: e.target.value })}
                    />
                </div>

                <div className="flex gap-3">
                    <Dropdown value={state.date} onChange={(v) => dispatch({ type: 'SET_DATE', value: v })} options={['Semua Tanggal', 'Hari Ini', 'Minggu Ini', 'Bulan Ini']} />
                    <Dropdown value={status} onChange={(v) => dispatch({ type: 'SET_STATUS', value: v })} options={['Semua Status', 'Sudah Dijawab', 'Belum Dijawab']} />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {['ID', 'Pertanyaan', 'Pengirim', 'Tanggal Masuk', 'Status', 'Aksi'].map((h, i) => (
                                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.map((faq, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{faq.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">{faq.question}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{faq.author}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{faq.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(faq.status)}`}>
                                        {faq.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex space-x-2 text-gray-500">
                                        <button><EyeIcon /></button>
                                        <button><Edit className="w-4 h-4 text-green-500" /></button>
                                        <button><Trash2 className="w-4 h-4 text-red-500" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={(p) => dispatch({ type: 'SET_PAGE', value: p })} />
        </section>
    );
}

const Dropdown = ({ value, onChange, options }) => (
    <div className="relative">
        <select
            className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
    </div>
);

const Pagination = ({ page, totalPages, onPageChange }) => (
    <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700">
            Halaman {page} dari {totalPages}
        </div>
        <div className="flex space-x-1">
            <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300">‹</button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-3 py-2 text-sm rounded ${page === i + 1 ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    {i + 1}
                </button>
            ))}
            <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300">›</button>
        </div>
    </div>
);

const EyeIcon = () => (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);