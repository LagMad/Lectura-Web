import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ManajemenPengguna from "@/Sections/AdminPengguna/ManajemenPengguna";
import PengaturanSistem from "@/Sections/AdminPengguna/PengaturanSistem";
import ManajemenFaq from "@/Sections/AdminPengguna/ManajemenFaq";
import ManajemenNipd from "@/Sections/AdminPengguna/ManajemenNipd";

export default function Pengguna({ users, faqList = [], nipdList = [] }) {
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
            <div className="flex flex-col w-full font-[poppins] py-10">
                <ManajemenPengguna users={users} />
                <ManajemenNipd nipdList={nipdList} />
                <ManajemenFaq faqList={faqList} />
                {/* <PengaturanSistem /> */}
            </div>
        </AdminLayout>
    );
}
