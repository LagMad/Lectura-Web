import React from "react";

const journals = [
    {
        title: "Ayo Berolahraga Silat",
        author: "Ahmad Fuadi",
        cover: "/path/to/cover.jpg",
        entries: 3,
    },
];

const ReadingJournal = () => {
    return (
        <main className="md:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-blue-600">
                    Jurnal Membaca Saya
                </h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                    + Tambah Jurnal
                </button>
            </div>

            <div className="bg-white p-4 rounded shadow-md">
                <input
                    type="text"
                    placeholder="Cari Jurnal..."
                    className="w-full border rounded px-3 py-2 text-sm mb-4"
                />
                <div className="flex gap-2 mb-4">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                        Semua Jurnal
                    </button>
                    <button className="bg-gray-200 text-black px-3 py-1 rounded text-xs">
                        Terbaru
                    </button>
                    <button className="bg-gray-200 text-black px-3 py-1 rounded text-xs">
                        Belum Selesai
                    </button>
                </div>

                <div className="space-y-4">
                    {journals.map((journal, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 bg-gray-50 p-4 rounded shadow-sm"
                        >
                            <img
                                src={journal.cover}
                                alt="Cover Buku"
                                className="w-14 h-20 object-cover rounded"
                            />
                            <div>
                                <h3 className="text-sm font-semibold">
                                    {journal.title}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {journal.author}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {journal.entries} jurnal dibuat
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ReadingJournal;
// test
