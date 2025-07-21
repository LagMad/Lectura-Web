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
    image,
    title,
    author,
    count,
    entries,
    onEditJournal,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const handleEdit = (entry) => {
        if (onEditJournal) {
            onEditJournal(entry); // Pass entry object lengkap
        } else {
            // Fallback ke navigate jika prop tidak ada
            router.visit(`/jurnal/${entry.id}/edit`);
        }
    };

    const handleDelete = (entryId) => {
        if (confirm("Yakin ingin menghapus jurnal ini?")) {
            setIsDeleting(entryId);

            router.delete(`/jurnal/${entryId}`, {
                onSuccess: () => {
                    setIsDeleting(null);
                },
                onError: (errors) => {
                    console.error("Error deleting journal:", errors);
                    alert("Gagal menghapus jurnal. Silakan coba lagi.");
                    setIsDeleting(null);
                },
                onFinish: () => {
                    setIsDeleting(null);
                },
            });
        }
    };

    const handlePublish = (entryId) => {
        router.patch(
            `/jurnal/${entryId}/toggle-publish`,
            {},
            {
                onSuccess: () => {
                    // Success message will be handled by Laravel
                },
                onError: (errors) => {
                    console.error("Error publishing journal:", errors);
                    alert("Gagal mengubah status publikasi.");
                },
            }
        );
    };

    const handleOpenDetail = (entry) => {
        setSelectedEntry(entry);
        setShowDetailModal(true);
    };

    const handleCloseDetail = () => {
        setSelectedEntry(null);
        setShowDetailModal(false);
    };

    const isCloudinaryUrl = (url) => {
        const pattern =
            /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/v\d+\/[^/]+\/[^/]+\.(jpg|jpeg|png|gif)$/i;
        return pattern.test(url);
    };
    const isValidImage = image && isCloudinaryUrl(image);

    return (
        <>
            <div className="bg-white px-10 py-5 rounded-2xl shadow-xl">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={toggleExpand}
                >
                    <div className="flex items-center gap-5">
                        {isValidImage ? (
                            <img
                                className="w-20 rounded-xl"
                                src={image}
                                alt={title}
                            />
                        ) : (
                            <div className="flex justify-center items-center p-2 text-xs w-20 h-28 rounded-xl bg-gray-300 text-gray-500">
                                No Cover
                            </div>
                        )}
                        <div>
                            <h2 className="font-medium">{title}</h2>
                            <p className="text-sm text-gray-500">{author}</p>
                            <p className="text-xs text-gray-600 mt-3">
                                {count}
                            </p>
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
                        {entries.map((entry) => (
                            <div key={entry.id} className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div
                                        onClick={() => handleOpenDetail(entry)}
                                        className="cursor-pointer"
                                    >
                                        <h3 className="font-semibold text-sm">
                                            {entry.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {truncateContent(entry.content)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-5">
                                            {entry.date}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-5">
                                        {entry.published && (
                                            <span className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                                                Dipublikasi
                                            </span>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() =>
                                                    handleEdit(entry)
                                                } // Pass entry object
                                                title="Edit"
                                                disabled={
                                                    isDeleting === entry.id
                                                }
                                                className="disabled:opacity-50"
                                            >
                                                <Icon
                                                    icon="lucide:edit"
                                                    className="text-blue-600 text-lg hover:scale-110"
                                                />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(entry.id)
                                                }
                                                title="Hapus"
                                                disabled={
                                                    isDeleting === entry.id
                                                }
                                                className="disabled:opacity-50"
                                            >
                                                {isDeleting === entry.id ? (
                                                    <Icon
                                                        icon="eos-icons:loading"
                                                        className="text-red-600 text-lg animate-spin"
                                                    />
                                                ) : (
                                                    <Icon
                                                        icon="tabler:trash"
                                                        className="text-red-600 text-lg hover:scale-110"
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* <p
                            onClick={() => router.visit("/semua-jurnal")}
                            className="text-blue-500 text-center text-sm font-medium cursor-pointer hover:underline"
                        >
                            Lihat semua jurnal
                        </p> */}
                    </div>
                )}
            </div>

            <DetailJournal
                open={showDetailModal}
                onClose={handleCloseDetail}
                journalEntry={selectedEntry}
                bookTitle={title}
                bookAuthor={author}
                bookImage={image}
            />
        </>
    );
};

export default JournalCard;
