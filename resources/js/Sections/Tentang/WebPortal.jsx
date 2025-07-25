import React, { useState, useMemo } from "react";

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
        <div className="flex items-center justify-center mt-8">
            <div className="flex space-x-1">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent rounded"
                >
                    ‹
                </button>

                {/* Page numbers with ellipsis */}
                {pageNumbers.map((pageNum, index) => {
                    if (pageNum === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-sm text-gray-500"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`px-3 py-2 text-sm rounded ${
                                page === pageNum
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                {/* Next button */}
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-2 text-sm text-gray-500 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent rounded"
                >
                    ›
                </button>
            </div>
        </div>
    );
};

const WebPortal = ({ web }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Show 8 items per page (2 rows x 4 columns)

    // Calculate pagination
    const totalItems = web.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Get current page items
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return web.slice(startIndex, endIndex);
    }, [web, currentPage, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top of the section when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section>
            <div className="container mx-auto py-20 space-y-10 lg:space-y-6">
                <div className="text-center mb-12">
                    <div className="font-bold text-3xl">Portal Web</div>
                    <p className="text-sm sm:text-base lg:text-lg mt-2 text-cust-dark-gray">
                        Kunjungi website SMAN 1 Batu yang lainnya!
                    </p>
                </div>
                
                {totalItems > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-10 justify-center items-center w-full">
                            {currentItems.map((webItem, index) => (
                                <button
                                    key={webItem.id || index}
                                    onClick={() =>
                                        window.open(webItem.web_link, "_blank")
                                    }
                                    className="flex flex-col justify-center items-center gap-5 p-5 shadow-lg hover:shadow-xl rounded-2xl cursor-pointer scale-100 hover:scale-105 transition-all duration-300 ease-in-out"
                                >
                                    <img
                                        src={webItem.image_path}
                                        alt={webItem.nama}
                                        className="w-2/3"
                                    />
                                    <div className="flex flex-col justify-center items-center gap-0">
                                        <span className="font-semibold text-2xl">
                                            {webItem.nama}
                                        </span>
                                        <span className="font-normal text-base text-gray-500">
                                            {webItem.deskripsi}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        {/* Pagination Component */}
                        <Pagination 
                            page={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                        
                        {/* Items info */}
                        <div className="text-center text-sm text-gray-500 mt-4">
                            Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} website
                        </div>
                    </>
                ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center w-full">
                        Tidak ada website portal yang ditemukan
                    </div>
                )}
            </div>
        </section>
    );
};

export default WebPortal;