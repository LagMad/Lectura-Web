import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ManajemenBuku from "@/Sections/AdminBuku/ManajemenBuku";
import JurnalingSiswa from "@/Sections/AdminBuku/JurnalingSiswa";
import JurnalSiswaDetail from "@/Sections/AdminBuku/JurnalSiswaDetail";

export default function JurnalSiswa({ book, siswa, totalPages }) {
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
            <JurnalSiswaDetail
                book={book}
                siswa={siswa}
                totalPages={totalPages}
            />
        </AdminLayout>
    );
}
