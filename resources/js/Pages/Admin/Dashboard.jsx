import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ManajemenPengguna from "@/Sections/AdminPengguna/ManajemenPengguna";
import PengaturanSistem from "@/Sections/AdminPengguna/PengaturanSistem";
import Statistik from "@/Sections/AdminDashboard/Statistik";
import TabelKonten from "@/Sections/AdminBuku/TabelKonten";
import Title from "@/Sections/AdminDashboard/Title";
import StaffPerpustakaan from "@/Sections/AdminDashboard/StaffPerpustakaan";
import ManajemenPengumuman from "@/Sections/AdminDashboard/ManajemenPengumuman";
import ManajemenYoutube from "@/Sections/AdminDashboard/ManajemenYoutube";
import ManajemenWeb from "@/Sections/AdminDashboard/ManajemenWeb";

export default function Dashboard({ users, staff, pengumuman, videos, books, booksTabelKonten, statistik, web }) {
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
                <Title />
                <Statistik statistik={statistik}/>
                <ManajemenPengumuman pengumuman={pengumuman}/>
                <StaffPerpustakaan staff={staff} />
                <ManajemenYoutube videos={videos}/>
                <ManajemenWeb web={web}/>
            </div>
        </AdminLayout>
    );
}
