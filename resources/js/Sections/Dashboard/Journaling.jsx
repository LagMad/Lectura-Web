import React, { useEffect, useState, useMemo } from "react";
import Button from "@/Components/Button";
import { Icon } from "@iconify/react";
import AddJournal from "./journaling/AddJournal";
import JournalCard from "./journaling/JournalCard";
import EditJournal from "./journaling/EditJournal";

const Pagination = ({ page, totalPages, onPageChange }) => {
    const generatePageNumbers = () => {
        const delta = 2; // Number of pages to show around current page
        const range = [];
        const rangeWithDots = [];

        // Always show first page
        range.push(1);

        // Calculate range around current page
        for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
            range.push(i);
        }

        // Always show last page (if totalPages > 1)
        if (totalPages > 1) {
            range.push(totalPages);
        }

        // Remove duplicates and sort
        const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

        // Add ellipsis where there are gaps
        let prev = 0;
        for (const current of uniqueRange) {
            if (current - prev === 2) {
                rangeWithDots.push(prev + 1);
            } else if (current - prev !== 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(current);
            prev = current;
        }

        return rangeWithDots;
    };

    const pageNumbers = generatePageNumbers();

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-700">
                Halaman {page} dari {totalPages}
            </div>
            <div className="flex space-x-1">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent rounded"
                >
                    ‹
                </button>

                {/* Page numbers with ellipsis */}
                {pageNumbers.map((pageNum, index) => {
                    if (pageNum === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-sm text-gray-500"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`px-3 py-2 text-sm rounded ${
                                page === pageNum
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                {/* Next button */}
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent rounded"
                >
                    ›
                </button>
            </div>
        </div>
    );
};

const Journaling = ({ books, jurnaling }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState(null);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [transformedJournals, setTransformedJournals] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Show 5 journals per page

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

    // Filter journals based on search term
    const filteredJournals = useMemo(() => {
        return transformedJournals.filter((journal) =>
            journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            journal.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [transformedJournals, searchTerm]);

    // Calculate pagination
    const totalItems = filteredJournals.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Get current page items
    const currentJournals = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredJournals.slice(startIndex, endIndex);
    }, [filteredJournals, currentPage, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top of journals section when page changes
        const journalsSection = document.querySelector('.journals-section');
        if (journalsSection) {
            journalsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
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

    // Reset to first page when journals data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [transformedJournals]);

    return (
        <section className="flex flex-col gap-16 w-full bg-white p-10 rounded-2xl">
            <div className="space-y-5 md:space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-5">
                    <h1 className="text-black font-bold text-2xl md:text-3xl text-center md:text-left">
                        Jurnal Membaca Saya
                    </h1>
                    <Button variant="filled" onClick={handleOpenModal}>
                        + Tambah Jurnal
                    </Button>
                </div>

                <div className="py-5 rounded-2xl space-y-8">
                    <div className="bg-gray-100 rounded-lg px-8 py-4 font-medium flex items-center gap-5">
                        <Icon
                            icon="mynaui:search"
                            className="text-xl text-cust-gray"
                        />
                        <input
                            type="text"
                            placeholder="Cari Jurnal..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full focus:outline-none focus:ring-0 bg-transparent"
                        />
                    </div>
                    <div className="space-x-2 lg:space-x-8 space-y-2 lg:space-y-0">
                        <Button variant="filled">Semua Jurnal</Button>
                        {/* <Button variant="secondary">Terbaru</Button>
                        <Button variant="secondary">Belum Selesai</Button> */}
                    </div>
                </div>

                <div className="journals-section space-y-5">
                    {/* Results info */}
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>
                            {searchTerm ? (
                                <>Menampilkan {totalItems} hasil untuk "{searchTerm}"</>
                            ) : (
                                <>Total {totalItems} jurnal</>
                            )}
                        </span>
                        {totalItems > 0 && (
                            <span>
                                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems}
                            </span>
                        )}
                    </div>

                    {/* Journal Cards */}
                    {currentJournals.length > 0 ? (
                        currentJournals.map((journal) => (
                            <JournalCard
                                key={journal.id}
                                {...journal}
                                onEditJournal={handleEditJournal}
                            />
                        ))
                    ) : searchTerm ? (
                        <div className="text-center py-8 text-gray-500">
                            Tidak ada jurnal yang cocok dengan pencarian "{searchTerm}"
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Belum ada jurnal yang dibuat
                        </div>
                    )}

                    {/* Pagination Component */}
                    <Pagination 
                        page={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
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