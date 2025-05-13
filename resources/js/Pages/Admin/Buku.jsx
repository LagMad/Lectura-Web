import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ManajemenBuku from "@/Sections/AdminBuku/ManajemenBuku";
import JurnalingSiswa from "@/Sections/AdminBuku/JurnalingSiswa";
import ManajemenKategori from "@/Sections/AdminBuku/ManajemenKategori";

export default function Buku({
    books,
    booksJurnaling,
    totalBooks,
    kategoriBuku,
    filters,
    pagination,
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleContentClick = (e) => {
        if (isSidebarOpen && window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };
    return (
        <AdminLayout
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
        >
            <div className="flex flex-col w-full">
                <ManajemenBuku books={books} />
                <ManajemenKategori categories={kategoriBuku} />
                <JurnalingSiswa
                    booksJurnaling={booksJurnaling}
                    totalBooks={totalBooks}
                    kategoriBuku={kategoriBuku}
                    filters={filters}
                    pagination={pagination}
                />
            </div>
        </AdminLayout>
    );
}