import React, { useEffect, useState } from "react";
import Button from "@/Components/Button";
import { Icon } from "@iconify/react";
import AddJournal from "./journaling/AddJournal";
import JournalCard from "./journaling/JournalCard";
import EditJournal from "./journaling/EditJournal";

const Journaling = ({ books, jurnaling }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState(null);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [transformedJournals, setTransformedJournals] = useState([]);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleEditJournal = (journal) => {
        setSelectedJournal(journal);
        setShowModalEdit(true);
    };

    const handleCloseEdit = () => {
        setShowModalEdit(false);
        setSelectedJournal(null);
    };

    useEffect(() => {
        console.log("jurnaling data:", jurnaling);

        // Transform jurnaling data ke format yang dibutuhkan JournalCard
        if (jurnaling) {
            // Group jurnaling berdasarkan buku
            const groupedByBook = jurnaling.reduce((acc, jurnal) => {
                const bookId = jurnal.id_buku;

                if (!acc[bookId]) {
                    acc[bookId] = {
                        id: bookId,
                        title: jurnal.buku?.judul || "Judul tidak tersedia",
                        author:
                            jurnal.buku?.penulis || "Penulis tidak tersedia",
                        image: jurnal.buku?.cover_path || "/default-book.png",
                        count: `1 Jurnal dibuat`,
                        entries: [],
                    };
                }

                // Tambahkan entry jurnal
                acc[bookId].entries.push({
                    id: jurnal.id,
                    title: `Halaman ${jurnal.halaman_awal}-${jurnal.halaman_akhir}`,
                    content: jurnal.deskripsi || "Tidak ada deskripsi",
                    date: new Date(jurnal.created_at).toLocaleDateString(
                        "id-ID",
                        {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        }
                    ),
                    published: true,
                    halaman_awal: jurnal.halaman_awal,
                    halaman_akhir: jurnal.halaman_akhir,
                });

                // Update count
                acc[
                    bookId
                ].count = `${acc[bookId].entries.length} Jurnal dibuat`;

                return acc;
            }, {});

            // Convert object to array
            const journalsArray = Object.values(groupedByBook);
            setTransformedJournals(journalsArray);
        }
    }, [jurnaling]);

    return (
        <section className="flex flex-col gap-16 w-full bg-white p-10 rounded-2xl">
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-black font-bold text-3xl">
                        Jurnal Membaca Saya
                    </h1>
                    <Button variant="filled" onClick={handleOpenModal}>
                        + Tambah Jurnal
                    </Button>
                </div>

                <div className=" py-5 rounded-2xl space-y-8">
                    <div className="bg-gray-100 rounded-lg px-8 py-4 font-medium flex items-center gap-5">
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
                        {/* <Button variant="secondary">Terbaru</Button>
                        <Button variant="secondary">Belum Selesai</Button> */}
                    </div>
                </div>

                <div className="space-y-5">
                    {transformedJournals.length > 0 ? (
                        transformedJournals.map((journal) => (
                            <JournalCard
                                key={journal.id}
                                {...journal}
                                onEditJournal={handleEditJournal}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Belum ada jurnal yang dibuat
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <AddJournal onClose={handleCloseModal} books={books} />
            )}

            {showModalEdit && selectedJournal && (
                <EditJournal
                    journal={selectedJournal}
                    onClose={handleCloseEdit}
                />
            )}
        </section>
    );
};

export default Journaling;
