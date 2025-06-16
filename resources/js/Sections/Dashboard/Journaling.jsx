import React, { useEffect, useState } from "react";
import Button from "@/Components/Button";
import { Icon } from "@iconify/react";
import AddJournal from "./journaling/AddJournal";
import JournalCard from "./journaling/JournalCard";

// const journals = [
//     {
//         id: 1,
//         title: "Ayo Berlatih Silat",
//         author: "Ahmad Fuadi",
//         image: "/silat.png",
//         count: "3 Jurnal dibuat",
//         entries: [
//             {
//                 id: 1,
//                 title: "Refleksi Bab 1-3: Perjuangan Pendidikan",
//                 content:
//                     "Membaca kisah anak-anak di Belitung yang berjuang untuk mendapatkan pendidikan membuat saya sangat tersentuh. Mereka harus berjalan jauh setiap hari, belajar di sekolah yang hampir roboh, dan dengan fasilitas yang sangat minim. Namun, semangat belajar mereka luar biasa.",
//                 date: "7 Mei 2025",
//                 published: true,
//             },
//             {
//                 id: 2,
//                 title: "Karakter Favorit: Lintang",
//                 content: "Lintang adalah karakter yang sangat menginspirasi...",
//                 date: "7 Mei 2025",
//                 published: false,
//             },
//         ],
//     },
//     {
//         id: 2,
//         title: "Laut Bercerita",
//         author: "Leila S. Chudori",
//         image: "/laut-bercerita.png",
//         count: "3 Jurnal dibuat",
//         entries: [
//             {
//                 id: 1,
//                 title: "Kehilangan dan Harapan",
//                 content:
//                     "Cerita ini memberikan gambaran menyentuh tentang kehilangan dan perjuangan...",
//                 date: "7 Mei 2025",
//                 published: true,
//             },
//         ],
//     },
// ];

const Journaling = ({ books, journals }) => {
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        console.log("books", books)
    }, [books])

    useEffect(() => {
        console.log("journalssss", journals)
    }, [journals])

    return (
        <section>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-cust-primary-color font-bold text-xl">
                        Jurnal Membaca Saya
                    </h1>
                    <Button variant="filled" onClick={handleOpenModal}>
                        + Tambah Jurnal
                    </Button>
                </div>

                <div className="bg-white px-10 py-5 rounded-2xl space-y-8">
                    <div className="bg-white py-4 font-medium flex items-center gap-5">
                        <Icon
                            icon="mynaui:search"
                            className="text-xl text-cust-gray"
                        />
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

                <div className="space-y-5">
                    {journals.map((journal) => (
                        <JournalCard key={journal.id} {...journal} />
                    ))}
                </div>
            </div>

            {showModal && (
                <AddJournal onClose={handleCloseModal} books={books} />
            )}
        </section>
    );
};

export default Journaling;
