import Input from "@/Components/ui/Input";
import Layout from "@/Layouts/Layout";
import React, { useState, useEffect } from "react";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { router } from "@inertiajs/react";

const Buku = ({ books, kategori }) => {
    const [activeCategory, setActiveCategory] = useState("Semua Buku");
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [processing, setProcessing] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBooks, setFilteredBooks] = useState([]);

    const [bookmarks, setBookmarks] = useState(() => {
        const initialBookmarks = {};
        books.data.forEach((book) => {
            initialBookmarks[book.id] = book.isFavorited ?? false;
        });
        return initialBookmarks;
    });

    useEffect(() => {
        setFilteredBooks(books.data);
    }, [books]);

    useEffect(() => {}, [books.data, kategori]);

    useEffect(() => {
        let filtered = books.data;

        // Filter by search query
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(
                (book) =>
                    (book.judul &&
                        book.judul
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())) ||
                    (book.penulis &&
                        book.penulis
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()))
            );
        }

        // Filter by category
        if (activeCategory !== "Semua Buku") {
            filtered = filtered.filter((book) => {
                // Handle null or undefined kategori values
                const bookCategory = book.kategori || "";
                return bookCategory === activeCategory;
            });
        }

        setFilteredBooks(filtered);
        setCurrentPage(1);
    }, [searchQuery, activeCategory, books.data, kategori]);

    const handleBookmarkToggle = (bookId) => {
        if (processing[bookId]) return;

        setProcessing((prev) => ({ ...prev, [bookId]: true }));

        const isCurrentlyFavorited = bookmarks[bookId];

        if (isCurrentlyFavorited) {
            router.delete("/favorites", {
                data: { book_id: bookId },
                preserveScroll: true,
                onFinish: () => {
                    setBookmarks((prev) => ({ ...prev, [bookId]: false }));
                    setProcessing((prev) => ({ ...prev, [bookId]: false }));
                },
            });
        } else {
            router.post(
                "/favorites",
                { book_id: bookId },
                {
                    preserveScroll: true,
                    onFinish: () => {
                        setBookmarks((prev) => ({ ...prev, [bookId]: true }));
                        setProcessing((prev) => ({ ...prev, [bookId]: false }));
                    },
                }
            );
        }
    };

    const handleSearch = (e) => {
        // Prevent form submission if button is clicked
        if (e) e.preventDefault();
    };

    // Handler for search input changes
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const booksPerPage = 10;

    const allCategories = [
        { id: "Semua Buku", nama: "Semua Buku" },
        ...kategori.map((k) => ({
            id: k.id,
            nama: k.kategori,
        })),
    ];

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const currentBooks = filteredBooks.slice(
        (currentPage - 1) * booksPerPage,
        currentPage * booksPerPage
    );

    const categoryMenu = (
        <Menu>
            {allCategories.map((item) => (
                <Menu.Item
                    key={item.id}
                    onClick={() => {
                        setActiveCategory(
                            item.id === "Semua Buku" ? item.id : item.nama
                        );
                        setCurrentPage(1);
                    }}
                >
                    {item.nama}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Layout>
            <div className="flex flex-col items-start w-full">
                <div className="flex flex-col justify-end items-center gap-5 md:gap-10 bg-cust-light-blue px-10 lg:px-0 h-auto md:h-96 w-full pt-32 pb-12 md:py-12">
                    <div className="text-3xl md:text-5xl font-bold text-center">
                        Buku Favorit Sepanjang Semester
                    </div>
                    <div className="flex flex-col md:flex-row w-full md:w-3/5 bg-white px-10 md:px-12 py-5 rounded-lg gap-3">
                        {/* Option 1: Try with direct input */}
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Cari berdasarkan judul atau penulis..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />

                        <button
                            className="h-full w-full md:w-32 md:h-full py-2 md:py-0 flex justify-center items-center bg-cust-blue text-white rounded-lg text-xl font-bold active:opacity-50 hover:opacity-80 transition-all duration-300 ease-in-out cursor-pointer"
                            onClick={handleSearch}
                        >
                            Cari
                        </button>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center gap-10 px-10 md:px-20 xl:px-40 py-10 w-full">
                    <div className="flex flex-row justify-start items-center gap-7 flex-wrap w-full">
                        {isMobile ? (
                            <div className="w-full">
                                <Dropdown
                                    overlay={categoryMenu}
                                    trigger={["click"]}
                                    className="w-full"
                                >
                                    <button className="bg-cust-light-gray text-black px-7 py-1.5 rounded-full font-semibold border-1 active:opacity-50 transition-opacity duration-300">
                                        {activeCategory} <DownOutlined />
                                    </button>
                                </Dropdown>
                            </div>
                        ) : (
                            <div className="flex flex-row justify-center items-center gap-7 flex-wrap">
                                {allCategories.map((item) => (
                                    <button
                                        key={item.id}
                                        className={`${
                                            activeCategory ===
                                            (item.id === "Semua Buku"
                                                ? item.id
                                                : item.nama)
                                                ? "bg-cust-blue text-white"
                                                : "bg-[#DEDEDE] text-black"
                                        } px-7 py-1.5 rounded-full font-semibold cursor-pointer hover:opacity-80 transition-opacity duration-300 ease-in-out`}
                                        onClick={() => {
                                            setActiveCategory(
                                                item.id === "Semua Buku"
                                                    ? item.id
                                                    : item.nama
                                            );
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {item.nama}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {filteredBooks.length === 0 ? (
                        <div className="flex justify-center items-center w-full py-10">
                            <p className="text-xl text-gray-500">
                                Tidak ada buku yang ditemukan
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7 w-full ">
                            {currentBooks.map((book) => (
                                <div
                                    key={book.id}
                                    onClick={() =>
                                        router.visit(
                                            route("books.show", book.id)
                                        )
                                    }
                                    className="flex cursor-pointer flex-col justify-between px-5 py-4 min-h-[350px] rounded-xl drop-shadow-xl hover:drop-shadow-2xl transition-[filter] gap-1 bg-white group"
                                >
                                    <div className="flex flex-col gap-1">
                                        <img
                                            src={
                                                book.cover_path ||
                                                "/default-cover.png"
                                            }
                                            className="w-full h-52 object-contain mb-2"
                                            alt={book.judul}
                                        />
                                        <div className="text-xs text-cust-gray line-clamp-1 group-hover:line-clamp-none">
                                            {book.penulis}
                                        </div>
                                        <div className="text-xs text-black font-semibold line-clamp-2 group-hover:line-clamp-none">
                                            {book.judul}
                                        </div>
                                    </div>
                                    <button
                                        className="self-end md:self-start cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBookmarkToggle(book.id);
                                        }}
                                    >
                                        {bookmarks[book.id] ? (
                                            <FaBookmark
                                                size={24}
                                                className="text-cust-blue"
                                            />
                                        ) : (
                                            <FaRegBookmark
                                                size={24}
                                                className="text-cust-blue"
                                            />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredBooks.length > 0 && (
                        <div className="flex justify-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) => prev - 1)
                                }
                                className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition-all duration-300 ease-in-out"
                            >
                                <MdOutlineKeyboardArrowLeft />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`cursor-pointer w-8 h-8 flex items-center justify-center text-base rounded-full ${
                                        currentPage === i + 1
                                            ? "bg-cust-blue text-white font-bold"
                                            : "bg-cust-light-gray"
                                    } hover:bg-cust-gray hover:text-white transition-all duration-300 ease-in-out`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((prev) => prev + 1)
                                }
                                className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition-all duration-300 ease-in-out"
                            >
                                <MdOutlineKeyboardArrowRight />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Buku;
