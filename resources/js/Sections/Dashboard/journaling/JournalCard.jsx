import React, { useState } from "react";
import { Icon } from "@iconify/react";
import DetailJournal from "./DetailJournal";
import { router } from "@inertiajs/react";

const truncateContent = (content, wordLimit = 10) => {
    const words = content.split(" ");
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + "...";
    }
    return content;
};

const JournalCard = ({
    id,
    book_cover,
    book_title,
    date,
    description,
    start_page,
    end_page,
    created_at,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const handleEdit = (id) => {
        alert(`Edit jurnal ${id}`);
    };

    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus jurnal ini?")) {
            alert(`Delete jurnal ${id}`);
        }
    };

    const handlePublish = (id) => {
        alert(`Publikasikan jurnal ${id}`);
    };

    const handleOpenDetail = (journal) => {
        setSelectedEntry(journal);
        setShowDetailModal(true);
    };

    const handleCloseDetail = () => {
        setSelectedEntry(null);
        setShowDetailModal(false);
    };

    return (
        <>
            <div className="bg-white px-10 py-5 rounded-2xl">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={toggleExpand}
                >
                    <div className="flex items-center gap-5">
                        <img
                            src={book_cover}
                            alt="book cover"
                            className="w-20 rounded-xl"
                        />
                        <div>
                            <h2 className="font-medium">{book_title}</h2>
                            {/* <p className="text-sm text-gray-500">author</p> */}
                            <p className="text-xs text-gray-600 mt-3">count</p>
                        </div>
                    </div>
                    <Icon
                        icon={
                            isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"
                        }
                        className="text-2xl text-gray-400"
                    />
                </div>

                {isExpanded && (
                    <div className="mt-6 space-y-6 pt-4">
                        {/* {entries.map((entry) => (
                            <div key={entry.id} className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div onClick={() => handleOpenDetail(entry)} className="cursor-pointer">
                                        <h3 className="font-semibold text-sm">{entry.title}</h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {truncateContent(entry.content)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-5">{entry.date}</p>
                                    </div>

                                    <div className="flex flex-col items-end gap-5">
                                        {entry.published && (
                                            <span className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                                                Dipublikasi
                                            </span>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => handleEdit(entry.id)} title="Edit">
                                                <Icon icon="lucide:edit" className="text-blue-600 text-lg hover:scale-110" />
                                            </button>
                                            <button onClick={() => handleDelete(entry.id)} title="Hapus">
                                                <Icon icon="tabler:trash" className="text-red-600 text-lg hover:scale-110" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))} */}
                        <div key={id} className="pb-4">
                            <div className="flex justify-between items-start">
                                <div
                                    onClick={() => handleOpenDetail()}
                                    className="cursor-pointer"
                                >
                                    <h3 className="font-semibold text-sm">
                                        {book_title}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">
                                        {truncateContent(description)}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-5">
                                        Ditulis pada tanggal{" "}
                                        {new Date(
                                            created_at
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-5">
                                    {created_at && (
                                        <span className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                                            Dipublikasi
                                        </span>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleEdit(id)}
                                            title="Edit"
                                        >
                                            <Icon
                                                icon="lucide:edit"
                                                className="text-blue-600 text-lg hover:scale-110"
                                            />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(id)}
                                            title="Hapus"
                                        >
                                            <Icon
                                                icon="tabler:trash"
                                                className="text-red-600 text-lg hover:scale-110"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p
                            onClick={() => router.visit("/semua-jurnal")}
                            className="text-blue-500 text-center text-sm font-medium cursor-pointer hover:underline"
                        >
                            Lihat semua jurnal
                        </p>
                    </div>
                )}
            </div>

            <DetailJournal
                open={showDetailModal}
                onClose={handleCloseDetail}
                journalEntry={selectedEntry}
                bookTitle={book_title}
                // bookAuthor={author}
                bookImage={book_cover}
            />
        </>
    );
};

export default JournalCard;
