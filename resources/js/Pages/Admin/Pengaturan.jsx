import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pengaturan from "@/Sections/AdminPengaturan/Pengaturan";

export default function Buku() {
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
            <Pengaturan />
        </AdminLayout>
    );
}
