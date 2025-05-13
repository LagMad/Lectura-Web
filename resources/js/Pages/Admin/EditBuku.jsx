import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import EditBuku from "@/Sections/AdminBuku/EditBuku";

export default function Buku({ book, kategori }) {
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
            <EditBuku book={book} kategori={kategori} />
        </AdminLayout>
    );
}
