import React, { useState, useMemo, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

/* ───── util sederhana untuk mengambil video‑ID ───── */
const getId = (url) => {
    try {
        // 1) https://youtu.be/ID
        const short = /youtu\.be\/([a-zA-Z0-9_-]{11})/.exec(url);
        if (short) return short[1];

        // 2) https://www.youtube.com/watch?v=ID
        const long = /v=([a-zA-Z0-9_-]{11})/.exec(url);
        if (long) return long[1];

        // 3) format embed atau lainnya
        const embed = /embed\/([a-zA-Z0-9_-]{11})/.exec(url);
        if (embed) return embed[1];
    } catch (_) {}
    return "";
};

/* --- Pagination UI sama seperti sebelumnya --- */
const Pagination = ({ page, totalPages, onPageChange }) => (
    <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
            Halaman {page} dari {totalPages}
        </div>
        <div className="flex space-x-1">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300"
            >
                ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-3 py-2 text-sm rounded ${
                        page === i + 1
                            ? "bg-blue-500 text-white"
                            : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                    {i + 1}
                </button>
            ))}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300"
            >
                ›
            </button>
        </div>
    </div>
);

/* --------------- MAIN --------------- */
const MediaLibrary = ({ videos }) => {
    const perPage = 6;
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const searchRef = useRef(null);
    const [showDrop, setShowDrop] = useState(false);

    /* filter berdasarkan judul / pengunggah */
    const filtered = useMemo(() => {
        if (!search.trim()) return videos;
        return videos.filter(
            (v) =>
                v.judul.toLowerCase().includes(search.toLowerCase()) ||
                v.pengunggah.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    useEffect(() => setPage(1), [search]);

    useEffect(() => {
        const h = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target))
                setShowDrop(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    return (
        <section className="bg-[#F9FAFB]">
            <div className="container mx-auto py-20 space-y-10 lg:space-y-6">
                {/* TITLE + SEARCH */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl">
                        Galeri Video
                    </h2>

                    <div className="relative w-full md:w-80" ref={searchRef}>
                        <input
                            type="text"
                            placeholder="Cari video atau pengunggah..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setShowDrop(true);
                            }}
                            className="w-full border border-gray-400 rounded-lg py-2 px-4 pr-10 text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        />
                        <Icon
                            icon="mdi:magnify"
                            className="absolute right-3 top-2.5 text-gray-500 text-lg"
                        />

                        {showDrop && search && (
                            <div className="absolute left-0 right-0 mt-2 bg-white rounded-md shadow-lg z-20 border border-gray-200 max-h-60 overflow-y-auto">
                                {filtered.length ? (
                                    filtered.slice(0, 6).map((v) => (
                                        <div
                                            key={v.link}
                                            onClick={() => {
                                                document
                                                    .getElementById(
                                                        getId(v.link)
                                                    )
                                                    ?.scrollIntoView({
                                                        behavior: "smooth",
                                                    });
                                                setShowDrop(false);
                                            }}
                                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {v.judul}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                        Tidak ada video ditemukan
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* GRID VIDEO */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 col-span-5">
                            Belum ada video.
                        </div>
                    ) : (
                        paginated.map((v) => (
                            <div
                                key={v.link}
                                id={getId(v.link)}
                                className="flex flex-col gap-2"
                            >
                                <div className="relative bg-gray-200 aspect-video">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getId(
                                            v.link
                                        )}`}
                                        title={v.judul}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 leading-tight">
                                        {v.judul}
                                    </h3>
                                    <div className="text-xs text-gray-500">
                                        {v.pengunggah || "Admin"}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* PAGINATION */}
                {videos.length != 0 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </section>
    );
};

export default MediaLibrary;
