import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { Icon } from "@iconify/react";
import { usePage } from "@inertiajs/react";

const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Buku", href: "/buku" },
    { name: "Bantuan", href: "/bantuan" },
    { name: "Tentang", href: "/tentang" },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const { url } = usePage();
    const { auth, books } = usePage().props;
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    const handleLogout = async () => {
        try {
            await fetch("/logout", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Handle search input
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        // Filter books based on search term
        const filteredBooks = books
            ? books.filter(
                  (book) =>
                      book.judul.toLowerCase().includes(value.toLowerCase()) ||
                      (book.penulis &&
                          book.penulis
                              .toLowerCase()
                              .includes(value.toLowerCase()))
              )
            : [];

        // Limit results to 5 books
        setSearchResults(filteredBooks.slice(0, 5));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }

            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setIsSearching(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white fixed w-full z-50 shadow-sm">
            <div className="px-5 sm:px-10 md:px-16 lg:px-20 xl:px-40 py-6 flex justify-between items-center">
                <div className="flex items-center gap-5 xl:gap-10">
                    <h1 className="font-bold text-cust-blue text-2xl xl:text-3xl">
                        E-Library
                    </h1>
                    <ul className="hidden lg:flex font-medium gap-3 xl:gap-6">
                        {navLinks.map((link, idx) => (
                            <li key={idx}>
                                <a
                                    href={link.href}
                                    className={`transition-colors duration-200 hover:text-cust-primary-color ${
                                        url === link.href
                                            ? "text-cust-blue font-bold"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="items-center flex gap-4 w-1/2 justify-end">
                    <div
                        className="relative w-full max-w-xs lg:w-1/3 xl:w-full xl:max-w-xs"
                        ref={searchRef}
                    >
                        <input
                            type="text"
                            placeholder="Cari buku..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full border border-gray-400 rounded-lg py-2 px-4 pr-10 text-sm placeholder-gray-500"
                        />
                        <Icon
                            icon="mdi:magnify"
                            className="absolute right-3 top-2.5 text-gray-500 text-lg"
                        />

                        {/* Search Results Dropdown */}
                        {isSearching && searchResults.length > 0 && (
                            <div className="absolute left-0 right-0 mt-2 bg-white rounded-md shadow-lg z-20 border border-gray-200 max-h-60 overflow-y-auto">
                                {searchResults.map((book) => (
                                    <a
                                        key={book.id}
                                        href={`/buku/${book.id}`}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex items-start">
                                            {book.cover_path ? (
                                                <img
                                                    src={book.cover_path}
                                                    alt={book.judul}
                                                    className="w-10 h-14 object-cover mr-3"
                                                />
                                            ) : (
                                                <div className="w-10 h-14 bg-gray-200 flex items-center justify-center mr-3 text-xs text-gray-500">
                                                    No Cover
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">
                                                    {book.judul}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {book.penulis ||
                                                        "Unknown Author"}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* No Results Message */}
                        {isSearching &&
                            searchTerm &&
                            searchResults.length === 0 && (
                                <div className="absolute left-0 right-0 mt-2 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                        Tidak ada buku yang ditemukan
                                    </div>
                                </div>
                            )}
                    </div>
                    <div className="hidden lg:flex gap-4 items-center">
                        {auth?.user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="flex items-center gap-1 text-gray-700 font-medium cursor-pointer hover:text-cust-primary-color transition-colors"
                                >
                                    <span>
                                        Halo, {auth.user.name.split(" ")[0]}!
                                    </span>
                                    <Icon
                                        icon={
                                            isDropdownOpen
                                                ? "mdi:chevron-up"
                                                : "mdi:chevron-down"
                                        }
                                    />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                        <a
                                            href="/dashboard"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-cust-primary-color transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon icon="mdi:view-dashboard" />
                                                <span>Dashboard</span>
                                            </div>
                                        </a>
                                        {auth?.user.role === "admin" ||
                                            ("guru" && (
                                                <a
                                                    href="/admin-dashboard"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-cust-primary-color transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon icon="mdi:view-dashboard" />
                                                        <span>Dashboard</span>
                                                    </div>
                                                </a>
                                            ))}
                                        <a
                                            href="/admin-dashboard"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-cust-primary-color transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon icon="mdi:view-dashboard" />
                                                <span>Admin</span>
                                            </div>
                                        </a>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-cust-primary-color transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon icon="mdi:logout" />
                                                <span>Logout</span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Button href="/login">Sign In</Button>
                                <Button variant="filled" href="/register">
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden text-2xl text-gray-700"
                    >
                        <Icon icon={isOpen ? "mdi:close" : "mdi:menu"} />
                    </button>
                </div>
            </div>

            <div
                className={`lg:hidden flex flex-col gap-4 container overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-screen py-4" : "max-h-0"
                }`}
            >
                {auth?.user && (
                    <>
                        <div className="text-center text-gray-700 font-medium mb-2">
                            Halo, {auth.user.name.split(" ")[0]}!
                        </div>
                        <Button
                            href="/dashboard"
                            variant="outlined"
                            className="mb-2"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Icon icon="mdi:view-dashboard" />
                                <span>Dashboard</span>
                            </div>
                        </Button>
                        <hr className="w-2/3 h-1 rounded-full self-center" />
                    </>
                )}

                <ul className="flex flex-col gap-4">
                    {navLinks.map((link, idx) => (
                        <li key={idx}>
                            <a
                                href={link.href}
                                className={`block text-center font-medium rounded transition-colors duration-200 ${
                                    url === link.href
                                        ? "text-cust-blue font-bold"
                                        : "text-gray-700"
                                }`}
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>

                <hr className="w-2/3 h-1 rounded-full self-center" />

                <div className="">
                    {auth?.user ? (
                        <div className="flex flex-col gap-2">
                            <Button variant="filled" onClick={handleLogout}>
                                <div className="flex items-center justify-center gap-2">
                                    <Icon icon="mdi:logout" />
                                    <span>Logout</span>
                                </div>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Button href="/login">Sign In</Button>
                            <Button variant="filled" href="/register">
                                Sign Up
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
