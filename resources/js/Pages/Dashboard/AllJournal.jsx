import React, { useEffect } from 'react';
import { ArrowLeft, Search, BookOpen } from 'lucide-react';
import { Icon } from '@iconify/react';
import Button from '@/Components/Button';
import { Link } from '@inertiajs/react';

const AllJournal = ({ auth, journals, categories, stats, filters }) => {
    const book = {
        title: "Ayo Berlatih Silat",
        author: "Ahmad Fuadi",
        journalCount: 8,
        description: "Novel ini mengisahkan tentang kehidupan 10 anak dari keluarga miskin yang bersekolah di SD Muhammadiyah di Belitung Timur. Mereka bersekolah dan belajar pada kondisi yang sangat memprihatinkan. Namun, mereka memiliki semangat yang kuat, serta seorang guru yang bernama Bu Muslimah yang memberikan motivasi."
    };

    const journalEntries = [
        {
            id: 1,
            title: "Refleksi Bab 1-3: Perjuangan Pendidikan",
            description: "Membaca kisah anak-anak di Belitung yang berjuang untuk mendapatkan pendidikan membuat saya sangat tersentuh. Mereka...",
            date: "7 Mar 2025",
            status: "Dipublikasi"
        },
        {
            id: 2,
            title: "Refleksi Bab 1-3: Perjuangan Pendidikan",
            description: "Membaca kisah anak-anak di Belitung yang berjuang untuk mendapatkan pendidikan membuat saya sangat tersentuh. Mereka...",
            date: "7 Mar 2025",
            status: "Dipublikasi"
        },
        {
            id: 3,
            title: "Refleksi Bab 1-3: Perjuangan Pendidikan",
            description: "Membaca kisah anak-anak di Belitung yang berjuang untuk mendapatkan pendidikan membuat saya sangat tersentuh. Mereka...",
            date: "7 Mar 2025",
            status: "Draft"
        },
        {
            id: 4,
            title: "Refleksi Bab 1-3: Perjuangan Pendidikan",
            description: "Membaca kisah anak-anak di Belitung yang berjuang untuk mendapatkan pendidikan membuat saya sangat tersentuh. Mereka...",
            date: "7 Mar 2025",
            status: "Dipublikasi"
        },
        {
            id: 5,
            title: "Refleksi Bab 1-3: Perjuangan Pendidikan",
            description: "Membaca kisah anak-anak di Belitung yang berjuang untuk mendapatkan pendidikan membuat saya sangat tersentuh. Mereka...",
            date: "7 Mar 2025",
            status: "Dipublikasi"
        },
        {
            id: 6,
            title: "Refleksi Bab 1-3: Perjuangan Pendidikan",
            description: "Membaca kisah anak-anak di Belitung yang berjuang untuk mendapatkan pendidikan membuat saya sangat tersentuh. Mereka...",
            date: "7 Mar 2025",
            status: "Dipublikasi"
        }
    ];

    useEffect(() => {
        console.log("journals", journals)
    }, [journals])

    return (
        <div className="container py-10 bg-gray-50 min-h-screen font-[poppins] space-y-6">
            <div className="flex items-center">
                <Link href={"/dashboard"} className="flex items-center">
                    <ArrowLeft size={18} className="mr-1" />
                    <span>Kembali</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-40 bg-orange-100 rounded overflow-hidden relative">
                            <img src="./silat.png" alt="" />
                        </div>
                    </div>

                    <div className="flex-grow">
                        <h1 className="text-2xl font-bold mb-1">{book.title}</h1>
                        <p className="text-gray-600 mb-2">{book.author}</p>
                        <div className="flex items-center mb-3">
                            <div className="text-sm flex items-center">
                                <BookOpen size={14} className="mr-1 text-blue-700" />
                                <span>{book.journalCount} Jurnal dibuat</span>
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm">{book.description}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white px-10 py-5 rounded-2xl space-y-8">
                <div className="bg-white py-4 font-medium flex items-center gap-5">
                    <Icon icon="mynaui:search" className="text-xl text-cust-gray" />
                    <input
                        type="text"
                        placeholder="Cari Jurnal..."
                        className="w-full focus:outline-none focus:ring-0"
                    />
                </div>
                <div className="space-x-2 lg:space-x-8 space-y-2 lg:space-y-0">
                    <Button variant="filled">Semua Jurnal</Button>
                    <Button variant="secondary">Terbaru</Button>
                    <Button variant="secondary">Belum Selesai</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {journalEntries.map((entry) => (
                    <div key={entry.id} className="bg-white npp-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-800">{entry.title}</h3>
                            <span className={`text-xs px-3 py-1 rounded-full ${entry.status === 'Dipublikasi'
                                ? 'bg-green-100 text-green-700'
                                : entry.status === 'Draft'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                {entry.status}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{entry.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{entry.date}</span>
                            <div className="flex gap-2">
                                <button className="text-blue-500">
                                    <Icon icon="lucide:edit" className="text-blue-600 text-lg hover:scale-110" />
                                </button>
                                <button className="text-red-500">
                                    <Icon icon="tabler:trash" className="text-red-600 text-lg hover:scale-110" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                    Muat Lebih Banyak
                    <Icon icon="mdi:chevron-down" />
                </button>
            </div>
        </div>
    );
};

export default AllJournal;