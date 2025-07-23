import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ManajemenBuku from "@/Sections/AdminBuku/ManajemenBuku";
import JurnalingSiswa from "@/Sections/AdminBuku/JurnalingSiswa";
import ManajemenKategori from "@/Sections/AdminBuku/ManajemenKategori";
import { usePage } from "@inertiajs/react";
import TabelKonten from "@/Sections/AdminBuku/TabelKonten";
import ManajemenPoster from "@/Sections/AdminBuku/ManajemenPoster";

export default function Buku({
    booksTabelKonten,
    books,
    booksJurnaling,
    totalBooks,
    kategoriBuku,
    filters,
    pagination,
    kategoriAll,
    posters
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
                    <ManajemenKategori categories={kategoriAll} books={books} />
                )}
                <ManajemenPoster posters={posters}/>
                <JurnalingSiswa
                    booksJurnaling={booksJurnaling}
                    totalBooks={totalBooks}
                    kategoriBuku={kategoriBuku}
                    filters={filters}
                    pagination={pagination}
                />
                <TabelKonten books={booksTabelKonten} />
            </div>
        </AdminLayout>
    );
}
