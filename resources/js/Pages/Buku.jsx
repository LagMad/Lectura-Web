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

const Buku = ({ books }) => {
    const [activeCategory, setActiveCategory] = useState("Semua Buku");
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [bookmarks, setBookmarks] = useState({});

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const booksPerPage = 10;

    const categories = [
        {
            category: "Semua Buku",
        },
        {
            category: "Fiksi",
        },
        {
            category: "Non Fiksi",
        },
        {
            category: "Akademik",
        },
        {
            category: "Sains",
        },
        {
            category: "Teknologi",
        },
        {
            category: "Literatur",
        },
    ];

    // Calculate total pages from the actual data
    const totalPages = Math.ceil(books.data.length / booksPerPage);

    // Get current books for the page
    const currentBooks = books.data.slice(
        (currentPage - 1) * booksPerPage,
        currentPage * booksPerPage
    );

    const handleBookmarkToggle = (bookId) => {
        setBookmarks((prevBookmarks) => ({
            ...prevBookmarks,
            [bookId]: !prevBookmarks[bookId],
        }));
    };

    const categoryMenu = (
        <Menu>
            {categories.map((item, index) => (
                <Menu.Item
                    key={index}
                    onClick={() => {
                        setActiveCategory(item.category);
                        setCurrentPage(1);
                    }}
                >
                    {item.category}
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
                        <Input
                            placeholder={
                                "Cari berdasarkan judul atau penulis..."
                            }
                        />
                        <button className="h-full w-full md:w-32 md:h-full py-2 md:py-0 flex justify-center items-center bg-cust-blue text-white rounded-lg text-xl font-bold active:opacity-50 hover:opacity-80 transition-all duration-300 ease-in-out cursor-pointer">
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
                                {categories.map((item, index) => (
                                    <button
                                        key={index}
                                        className={`${
                                            activeCategory === item.category
                                                ? "bg-cust-blue text-white"
                                                : "bg-[#DEDEDE] text-black"
                                        } px-7 py-1.5 rounded-full font-semibold cursor-pointer hover:opacity-80 transition-opacity duration-300 ease-in-out`}
                                        onClick={() => {
                                            setActiveCategory(item.category);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {item.category}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7 w-full ">
                        {currentBooks.map((book) => (
                            <div
                                key={book.id}
                                className="flex flex-col justify-between px-5 py-4 min-h-[350px] rounded-xl drop-shadow-xl hover:drop-shadow-2xl transition-[filter] gap-1 bg-white group"
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
                                    className="self-end md:self-start"
                                    onClick={() =>
                                        handleBookmarkToggle(book.id)
                                    }
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

                    {/* Pagination Controls */}
                    <div className="flex justify-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
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
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition-all duration-300 ease-in-out"
                        >
                            <MdOutlineKeyboardArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Buku;
