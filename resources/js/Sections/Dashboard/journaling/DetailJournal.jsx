import React from 'react';
import { Icon } from '@iconify/react';
import Button from '@/Components/Button';

const DetailJournal = ({ open, onClose, journalEntry, bookTitle, bookAuthor, bookImage }) => {
    if (!open || !journalEntry) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />

            <div className="relative bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg z-50">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black"
                >
                    ×
                </button>

                <h2 className="text-lg font-semibold mb-4">{journalEntry.title}</h2>

                <div className="flex items-center gap-3 text-sm mb-4 text-gray-600">
                    <img
                        src={bookImage}
                        alt={bookTitle}
                        className="w-10 h-14 rounded-md object-cover"
                    />
                    <div>
                        <p>{bookTitle}</p>
                        <p className="text-xs text-gray-500">{bookAuthor}</p>
                        <p className="text-xs text-gray-400 mt-1">Dibuat pada {journalEntry.date}</p>
                    </div>
                </div>

                <div className="text-gray-700 text-sm whitespace-pre-line">
                    {journalEntry.content}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant='secondary'>Edit Jurnal</Button>
                    <Button variant='filled'>Bagikan Jurnal</Button>
                </div>
            </div>
        </div>
    );
};

export default DetailJournal;