import React, { useEffect, useState } from "react";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { router } from "@inertiajs/react";
import { Icon } from "@iconify/react";

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
        <div className="flex items-center justify-center gap-2">
            <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
            >
                <MdOutlineKeyboardArrowLeft />
            </button>
            
            {pageNumbers.map((pageNum, index) => {
                if (pageNum === '...') {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="w-8 h-8 flex items-center justify-center text-base text-gray-500"
                        >
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`cursor-pointer w-8 h-8 flex items-center justify-center text-base rounded-full ${
                            page === pageNum
                                ? "bg-cust-blue text-white font-bold"
                                : "bg-cust-light-gray hover:bg-cust-gray hover:text-white"
                        } transition-all duration-300 ease-in-out`}
                    >
                        {pageNum}
                    </button>
                );
            })}
            
            <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
            >
                <MdOutlineKeyboardArrowRight />
            </button>
        </div>
    );
};

const BukuFavorit = ({ favoriteBooks, kategori, filters = {} }) => {
    const initialCategory = filters.category || "Semua Buku";

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [processing, setProcessing] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBooks, setFilteredBooks] = useState([]);

    const [bookmarks, setBookmarks] = useState(() => {
        const initialBookmarks = {};
        favoriteBooks.forEach((book) => {
            initialBookmarks[book.id] = book.isFavorited ?? false;
        });
        return initialBookmarks;
    });

    useEffect(() => {
        setFilteredBooks(favoriteBooks);
    }, [favoriteBooks]);

    // Update active category when filters change
    useEffect(() => {
        if (filters.category) {
            setActiveCategory(filters.category);
        }
    }, [filters.category]);

    useEffect(() => {
        let filtered = favoriteBooks;

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
    }, [searchQuery, activeCategory, favoriteBooks, kategori]);

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

    const handleCategoryChange = (newCategory) => {
        setActiveCategory(newCategory);
        setCurrentPage(1);

        // Update URL with new category parameter
        const categoryParam =
            newCategory === "Semua Buku" ? {} : { category: newCategory };
        router.visit(route("buku.index"), {
            data: categoryParam,
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top of books section when page changes
        const booksSection = document.querySelector('.books-grid-section');
        if (booksSection) {
            booksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Fallback: scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
            nama: k,
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
                        const categoryName =
                            item.id === "Semua Buku" ? item.id : item.nama;
                        handleCategoryChange(categoryName);
                    }}
                >
                    {item.nama}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <div className="flex flex-col gap-5 w-full bg-white p-10 rounded-2xl">
            <div className="flex flex-col gap-5 md:gap-10">
                <div className="text-3xl font-bold text-center md:text-left">
                    Buku Favorit
                </div>
                <div className="flex flex-col md:flex-row w-full bg-white rounded-lg gap-3 items-stretch">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 font-medium flex items-center gap-5 w-full">
                        <Icon
                            icon="mynaui:search"
                            className="text-xl text-cust-gray"
                        />
                        <input
                            type="text"
                            className="w-full rounded-lg focus:outline-none focus:ring-0 bg-transparent"
                            placeholder="Cari berdasarkan judul atau penulis..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <button
                        className=" h-full w-auto px-4 py-2 flex justify-center items-center bg-cust-blue text-white rounded-lg text-base active:opacity-50 hover:opacity-80 transition-all duration-300 ease-in-out cursor-pointer"
                        onClick={handleSearch}
                    >
                        Cari
                    </button>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-10 w-full">
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
                                        const categoryName =
                                            item.id === "Semua Buku"
                                                ? item.id
                                                : item.nama;
                                        handleCategoryChange(categoryName);
                                    }}
                                >
                                    {item.nama}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results info */}
                {filteredBooks.length > 0 && (
                    <div className="flex justify-between items-center w-full text-sm text-gray-600">
                        <span>
                            {searchQuery ? (
                                <>Menampilkan {filteredBooks.length} hasil untuk "{searchQuery}"</>
                            ) : (
                                <>Total {filteredBooks.length} buku favorit</>
                            )}
                        </span>
                        <span>
                            Halaman {currentPage} dari {totalPages} | Menampilkan {((currentPage - 1) * booksPerPage) + 1} - {Math.min(currentPage * booksPerPage, filteredBooks.length)} dari {filteredBooks.length}
                        </span>
                    </div>
                )}

                <div className="books-grid-section w-full">
                    {filteredBooks.length === 0 ? (
                        <div className="flex justify-center items-center w-full py-10">
                            <p className="flex flex-col text-center text-xl text-gray-500">
                                {searchQuery ? (
                                    <>
                                        Tidak ada buku favorit yang cocok dengan pencarian "{searchQuery}".
                                        <span className="text-base">
                                            Coba kata kunci yang berbeda atau ubah kategori filter.
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Tidak ada buku favorit yang ditemukan.
                                        <span className="text-base">
                                            Minta staf perpustakaan atau gurumu untuk
                                            menambahkan buku dengan kategori{" "}
                                            <span className="font-bold">
                                                {activeCategory}
                                            </span>
                                            !
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7 w-full">
                            {currentBooks.map((book) => {
                                const isCloudinaryUrl = (url) => {
                                    const pattern =
                                        /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/v\d+\/[^/]+\/[^/]+\.(jpg|jpeg|png|gif)$/i;
                                    return pattern.test(url);
                                };
                                const isValidImage =
                                    book.cover_path &&
                                    isCloudinaryUrl(book.cover_path);

                                return (
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
                                            {isValidImage ? (
                                                <img
                                                    className="w-full h-52 object-contain"
                                                    src={book.cover_path}
                                                    alt={book.judul}
                                                />
                                            ) : (
                                                <div className="flex justify-center items-center text-center w-full h-52 object-contain mb-2 bg-gray-300 text-gray-500">
                                                    No Cover
                                                </div>
                                            )}
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
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Enhanced Pagination with Ellipsis */}
                <Pagination 
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default BukuFavorit;