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
import { Star } from "lucide-react";

const Buku = ({ books, kategori, filters = {}, topRatedBooks }) => {
    // Get initial category from URL parameters or default to "Semua Buku"
    const initialCategory = filters.category || "Semua Buku";

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [isMobile, setIsMobile] = useState(false);
    const [processing, setProcessing] = useState({});
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTimeoutId, setSearchTimeoutId] = useState(null);

    const [bookmarks, setBookmarks] = useState(() => {
        const initialBookmarks = {};
        books.data.forEach((book) => {
            initialBookmarks[book.id] = book.isFavorited ?? false;
        });
        return initialBookmarks;
    });

    // Auto search with debounce
    useEffect(() => {
        // Clear existing timeout
        if (searchTimeoutId) {
            clearTimeout(searchTimeoutId);
        }

        // Don't trigger search on initial load if there's already a search filter
        if (searchQuery === (filters.search || "")) {
            return;
        }

        // Set new timeout for auto search
        const timeoutId = setTimeout(() => {
            performSearch(searchQuery);
        }, 100);

        setSearchTimeoutId(timeoutId);

        // Cleanup function
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [searchQuery, activeCategory]);

    const performSearch = (query) => {
        const params = {
            ...(activeCategory !== "Semua Buku" && { category: activeCategory }),
            ...(query.trim() && { search: query.trim() })
        };

        router.visit(route("books.index"), {
            data: params,
            preserveState: true,
            preserveScroll: false,
        });
    };

    useEffect(() => {
        let filtered = books.data;
        
        setFilteredBooks(filtered);
    }, [books.data]);

    // Update active category when filters change
    useEffect(() => {
        if (filters.category) {
            setActiveCategory(filters.category);
        }
    }, [filters.category]);

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
        
        // Clear any pending auto-search timeout
        if (searchTimeoutId) {
            clearTimeout(searchTimeoutId);
            setSearchTimeoutId(null);
        }

        // Perform immediate search
        performSearch(searchQuery);
    };

    // Handler for search input changes
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle Enter key in search input
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleCategoryChange = (newCategory) => {
        setActiveCategory(newCategory);

        // Clear any pending search timeout
        if (searchTimeoutId) {
            clearTimeout(searchTimeoutId);
            setSearchTimeoutId(null);
        }

        // Update URL with new category parameter and preserve search
        const params = {
            ...(newCategory !== "Semua Buku" && { category: newCategory }),
            ...(searchQuery.trim() && { search: searchQuery.trim() })
        };

        router.visit(route("books.index"), {
            data: params,
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle pagination
    const handlePageChange = (page) => {
        const params = {
            page,
            ...(activeCategory !== "Semua Buku" && { category: activeCategory }),
            ...(searchQuery.trim() && { search: searchQuery.trim() })
        };

        router.visit(route("books.index"), {
            data: params,
            preserveState: true,
            preserveScroll: false,
        });
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const allCategories = [
        { id: "Semua Buku", nama: "Semua Buku" },
        ...kategori.map((k) => ({
            id: k.id,
            nama: k.kategori,
        })),
    ];

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

    const isCloudinaryUrl = (url) => {
        if (!url) return false;
        const pattern =
            /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/v\d+\/[^/]+\/[^/]+\.(jpg|jpeg|png|gif|webp)$/i;
        return pattern.test(url);
    };

    const isValidImageUrl = (url) => {
        if (!url) return false;
        // Check if it's a Cloudinary URL or any other valid image URL
        return isCloudinaryUrl(url) || 
               /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url) ||
               url.startsWith('/') || // Local image paths
               url.startsWith('data:image/'); // Base64 images
    };

    // Generate pagination buttons
    const renderPaginationButtons = () => {
        const currentPage = books.current_page;
        const lastPage = books.last_page;
        const buttons = [];
        
        // Determine the range of page numbers to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(lastPage, currentPage + 2);
        
        // Adjust the range to always show 5 buttons if possible
        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(lastPage, startPage + 4);
            } else {
                startPage = Math.max(1, endPage - 4);
            }
        }
        
        // Add first page and ellipsis if needed
        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="cursor-pointer w-8 h-8 flex items-center justify-center text-base rounded-full bg-cust-light-gray hover:bg-cust-gray hover:text-white transition-all duration-300 ease-in-out"
                >
                    1
                </button>
            );
            
            if (startPage > 2) {
                buttons.push(
                    <span key="ellipsis1" className="w-8 h-8 flex items-center justify-center">
                        ...
                    </span>
                );
            }
        }
        
        // Add page buttons
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`cursor-pointer w-8 h-8 flex items-center justify-center text-base rounded-full ${
                        currentPage === i
                            ? "bg-cust-blue text-white font-bold"
                            : "bg-cust-light-gray"
                    } hover:bg-cust-gray hover:text-white transition-all duration-300 ease-in-out`}
                >
                    {i}
                </button>
            );
        }
        
        // Add last page and ellipsis if needed
        if (endPage < lastPage) {
            if (endPage < lastPage - 1) {
                buttons.push(
                    <span key="ellipsis2" className="w-8 h-8 flex items-center justify-center">
                        ...
                    </span>
                );
            }
            
            buttons.push(
                <button
                    key={lastPage}
                    onClick={() => handlePageChange(lastPage)}
                    className="cursor-pointer w-8 h-8 flex items-center justify-center text-base rounded-full bg-cust-light-gray hover:bg-cust-gray hover:text-white transition-all duration-300 ease-in-out"
                >
                    {lastPage}
                </button>
            );
        }
        
        return buttons;
    };

    return (
        <Layout>
            <div className="flex flex-col items-start w-full">
                <div className="flex flex-col justify-end items-center gap-5 md:gap-10 bg-cust-light-blue px-10 lg:px-0 h-auto md:h-96 w-full pt-32 pb-12 md:py-12">
                    <div className="text-3xl md:text-5xl font-bold text-center">
                        Koleksi Buku Perpustakaan
                    </div>
                    <div className="flex flex-col md:flex-row w-full md:w-3/5 bg-white px-10 md:px-12 py-5 rounded-lg gap-3">
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Cari berdasarkan judul atau penulis..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyPress={handleSearchKeyPress}
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

                    {/* Show pagination info */}
                    <div className="flex justify-between items-center w-full">
                        <div className="text-sm text-gray-600">
                            Menampilkan {books.from || 0} - {books.to || 0} dari {books.total || 0} buku
                        </div>
                    </div>

                    {filteredBooks.length === 0 ? (
                        <div className="flex justify-center items-center w-full py-10">
                            <p className="flex flex-col text-center text-xl text-gray-500">
                                Tidak ada buku yang ditemukan.
                                <span className="text-base">
                                    {searchQuery ? 
                                        `Coba kata kunci lain atau ubah kategori pencarian.` :
                                        `Minta staf perpustakaan atau gurumu untuk menambahkan buku dengan kategori ${activeCategory}!`
                                    }
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7 w-full ">
                            {filteredBooks.map((book) => (
                                <div
                                    key={book.id}
                                    onClick={() =>
                                        router.visit(
                                            route("books.show", book.id)
                                        )
                                    }
                                    className="relative flex cursor-pointer flex-col justify-between px-5 pb-4 min-h-[350px] rounded-xl drop-shadow-xl hover:drop-shadow-2xl transition-[filter] gap-1 bg-white group"
                                >
                                    <div className="flex flex-col justify-start gap-3">
                                        <div className="flex flex-row justify-center items-center self-center text-sm gap-2 px-4 py-2 min-w-16 rounded-b-2xl bg-cust-primary-color text-white text-center">
                                            {parseFloat(
                                                book.average_rating
                                            ).toFixed(1)}
                                            <Star
                                                size={20}
                                                fill="#facc15"
                                                stroke="#facc15"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            {isValidImageUrl(book.cover_path) ? (
                                                <img
                                                    src={book.cover_path}
                                                    className="w-full h-52 object-cover mb-2 rounded-lg"
                                                    alt={book.judul}
                                                    onError={(e) => {
                                                        // If image fails to load, show placeholder
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            
                                            {!isValidImageUrl(book.cover_path) ? (
                                                <div className="flex justify-center items-center w-full h-52 mb-2 bg-gray-200 text-gray-500 rounded-lg">
                                                    <div className="text-center">
                                                        {/* <div className="text-2xl mb-2">📚</div> */}
                                                        <div className="text-sm">No Cover</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div 
                                                    className="justify-center items-center w-full h-52 mb-2 bg-gray-200 text-gray-500 rounded-lg"
                                                    style={{ display: 'none' }}
                                                >
                                                    <div className="text-center">
                                                        {/* <div className="text-2xl mb-2">📚</div> */}
                                                        <div className="text-sm">Image Not Found</div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="text-xs text-cust-gray line-clamp-1 group-hover:line-clamp-none">
                                                {book.penulis}
                                            </div>
                                            <div className="text-xs text-black font-semibold line-clamp-2 group-hover:line-clamp-none">
                                                {book.judul}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <button
                                            className="self-end md:self-center cursor-pointer"
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
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Laravel Pagination Controls */}
                    {books.last_page > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            <button
                                disabled={!books.prev_page_url}
                                onClick={() => handlePageChange(books.current_page - 1)}
                                className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                            >
                                <MdOutlineKeyboardArrowLeft />
                            </button>
                            
                            {renderPaginationButtons()}
                            
                            <button
                                disabled={!books.next_page_url}
                                onClick={() => handlePageChange(books.current_page + 1)}
                                className="cursor-pointer w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
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