import { Search, ChevronDown, Edit, Trash2 } from "lucide-react";

export default function ManajemenPengguna() {
    const users = [
        {
            name: "Hizkia Jeremmmy Krisna Ananta",
            email: "jeremmychiaga45@gmail.com",
            role: "Guru",
            status: "Aktif",
        },
        {
            name: "Hans Rattlesnake",
            email: "hans123@devacademy.id",
            role: "Siswa",
            status: "Diblokir",
        },
        {
            name: "Cut Risfa Zuhra",
            email: "cut12345@gmail.com",
            role: "Siswa",
            status: "Perbaikan",
        },
    ];

    return (
        <div className="w-full mx-auto pt-8 px-4 sm:px-6 lg:px-8 font-[poppins]">
            <div className="lg:flex justify-between items-center mb-2">
                <h2 className="text-2xl lg:mb-0 mb-2 font-bold">
                    Managemen Pengguna
                </h2>
                <button className="bg-cust-blue hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center text-sm">
                    <span className="mr-1">+</span> Tambah Pengguna
                </button>
            </div>
            <p className="md:text-sm text-xs text-gray-500 mb-6">
                Kelola anggota perpustakaan dan hak peminjaman mereka
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-grow">
                    <Search
                        size={16}
                        className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Cari Pengguna..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded lg:text-md text-sm"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 rounded flex items-center justify-between min-w-32 md:text-md text-sm md:mr-0 mr-auto">
                        <span>Semua Kategori</span>
                        <ChevronDown size={16} className="ml-2" />
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded flex items-center justify-between min-w-32 md:text-md text-sm md:ml-0 ml-auto">
                        <span>Semua Status</span>
                        <ChevronDown size={16} className="ml-2" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="text-left text-gray-500 text-sm">
                            <th className="py-3 px-4 font-medium">Pengguna</th>
                            <th className="py-3 px-4 font-medium">Email</th>
                            <th className="py-3 px-4 font-medium">
                                Keanggotaan
                            </th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr
                                key={index}
                                className="border-t border-gray-100"
                            >
                                <td className="py-3 px-4 md:text-md text-sm">
                                    {user.name}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="py-3 px-4">
                                    <span className="px-3 py-1 bg-blue-100 text-cust-blue rounded-full text-xs">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs ${
                                            user.status === "Aktif"
                                                ? "bg-green-100 text-green-500"
                                                : user.status === "Diblokir"
                                                ? "bg-red-100 text-red-500"
                                                : "bg-yellow-100 text-yellow-500"
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex gap-2">
                                        <button className="text-cust-blue hover:text-cust-blue">
                                            <Edit size={16} />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="xl:flex items-center justify-between py-4">
                <div className="text-sm text-gray-500 lg:mb-0 mb-2">
                    Showing 1 - 10 of 50 users
                </div>
                <div className="flex mr-auto md:mr-0 w-fit">
                    <button className="px-3 py-1 border border-gray-300 rounded-l hover:bg-gray-50 md:text-md text-sm">
                        Sebelumnya
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-300 bg-cust-blue text-white md:text-md text-sm">
                        1
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-300 hover:bg-gray-50 md:text-md text-sm">
                        2
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-300 hover:bg-gray-50 md:text-md text-sm">
                        3
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-r hover:bg-gray-50 md:text-md text-sm">
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>
    );
}
