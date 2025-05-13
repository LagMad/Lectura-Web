import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ManajemenBuku from "@/Sections/AdminBuku/ManajemenBuku";
import JurnalingSiswa from "@/Sections/AdminBuku/JurnalingSiswa";
import ManajemenKategori from "@/Sections/AdminBuku/ManajemenKategori";
import { usePage } from "@inertiajs/react";

export default function Buku({
    books,
    booksJurnaling,
    totalBooks,
    kategoriBuku,
    filters,
    pagination,
    kategoriAll,
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { auth } = usePage().props;

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
                {auth.user.role === "admin" && (
                    <ManajemenKategori categories={kategoriAll} />
                )}
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
