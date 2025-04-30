import PengaturanNotifikasi from "@/Components/AdminComponents/PengaturanNotifikasi";
import PengaturanUmum from "@/Components/AdminComponents/PengaturanUmum";

export default function PengaturanSistem() {
    return (
        <div className="w-full mx-auto pb-8 px-4 sm:px-6 lg:px-8 font-[poppins]">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Pengaturan Sistem</h2>
                <p className="text-sm text-gray-500">
                    Konfigurasikan sistem manajemen perpustakaan Anda
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <PengaturanUmum />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <PengaturanUmum />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <PengaturanNotifikasi />
                    </div>
                </div>
            </div>
        </div>
    );
}
