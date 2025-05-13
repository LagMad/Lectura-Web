import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import TambahBuku from "@/Sections/AdminBuku/TambahBuku";

export default function Buku({ kategori }) {
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
            <TambahBuku kategori={kategori} />
        </AdminLayout>
    );
}
