import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { Search, ChevronDown, Edit, Trash2, Plus } from "lucide-react";

export default function ManajemenPengguna({ users }) {
    // State untuk filter dan pencarian
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("Semua Kategori");
    const [selectedStatus, setSelectedStatus] = useState("Semua Status");

    // State untuk dropdown
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

    // State untuk konfirmasi hapus
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Data untuk role dan status
    const roles = ["Admin", "Guru", "Siswa"];
    const statuses = ["Aktif", "Nonaktif", "Diblokir"];

    // State untuk flash message
    const [flashMessage, setFlashMessage] = useState(null);

    // Set initial filters from URL if present
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const search = params.get("search");
        const role = params.get("role");
        const status = params.get("status");

        if (search) setSearchTerm(search);
        if (role) setSelectedRole(role);
        if (status) setSelectedStatus(status);
    }, []);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    // Apply all filters
    const applyFilters = () => {
        router.get(
            route("users.admin"),
            {
                search: searchTerm || "",
                role: selectedRole !== "Semua Kategori" ? selectedRole : "",
                status: selectedStatus !== "Semua Status" ? selectedStatus : "",
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["users"],
            }
        );
    };

    // Handle role selection
    const handleRoleSelect = (role) => {
        // Langsung terapkan filter dengan menggunakan nilai baru
        router.get(
            route("users.admin"),
            {
                search: searchTerm || "",
                role: role !== "Semua Kategori" ? role : "",
                status: selectedStatus !== "Semua Status" ? selectedStatus : "",
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["users"],
            }
        );

        // Update state setelah mengirim request
        setSelectedRole(role);
        setRoleDropdownOpen(false);
    };

    // Handle status selection
    const handleStatusSelect = (status) => {
        // Langsung terapkan filter dengan menggunakan nilai baru
        router.get(
            route("users.admin"),
            {
                search: searchTerm || "",
                role: selectedRole !== "Semua Kategori" ? selectedRole : "",
                status: status !== "Semua Status" ? status : "",
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["users"],
            }
        );

        // Update state setelah mengirim request
        setSelectedStatus(status);
        setStatusDropdownOpen(false);
    };

    // Handle delete confirmation
    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    // Execute delete
    const executeDelete = () => {
        if (userToDelete) {
            router.delete(route("users.destroy", userToDelete.id), {
                onSuccess: () => {
                    setFlashMessage("Pengguna berhasil dihapus");
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);

                    // Clear flash message after 3 seconds
                    setTimeout(() => {
                        setFlashMessage(null);
                    }, 3000);
                },
            });
        }
    };

    // Handle pagination
    const handlePagination = (url) => {
        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            only: ["users"],
        });
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Jangan tutup dropdown jika klik terjadi di dalam dropdown
            if (!e.target.closest(".dropdown-container")) {
                setRoleDropdownOpen(false);
                setStatusDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Stop propagation to prevent dropdown from closing
    const handleDropdownClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 ">
            <Head title="Manajemen Admin/Guru" />

            {flashMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {flashMessage}
                </div>
            )}

            <div className="lg:flex justify-between items-center mb-2">
                <h2 className="text-2xl lg:mb-0 mb-2 font-bold">
                    Manajemen Admin/Guru
                </h2>
                <button
                    onClick={() => router.visit(route("admin.users.create"))}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center text-sm"
                >
                    <Plus size={16} className="mr-1" /> Tambah Pengguna
                </button>
            </div>

            <p className="md:text-sm text-xs text-gray-500 mb-6">
                Kelola anggota perpustakaan dan hak peminjaman mereka
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-grow">
                    <form onSubmit={handleSearch}>
                        <Search
                            size={16}
                            className="absolute left-3 top-3 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Cari Pengguna..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded lg:text-md text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                <div className="flex gap-3">
                    {/* Role dropdown */}
                    <div
                        className="relative dropdown-container"
                        onClick={handleDropdownClick}
                    >
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded flex items-center justify-between min-w-32 md:text-md text-sm md:mr-0 mr-auto"
                            onClick={() =>
                                setRoleDropdownOpen(!roleDropdownOpen)
                            }
                        >
                            <span>{selectedRole}</span>
                            <ChevronDown size={16} className="ml-2" />
                        </button>

                        {roleDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                                <div
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        handleRoleSelect("Semua Kategori")
                                    }
                                >
                                    Semua Kategori
                                </div>
                                {roles.map((role) => (
                                    <div
                                        key={role}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleRoleSelect(role)}
                                    >
                                        {role}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status dropdown */}
                    <div
                        className="relative dropdown-container"
                        onClick={handleDropdownClick}
                    >
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded flex items-center justify-between min-w-32 md:text-md text-sm md:ml-0 ml-auto"
                            onClick={() =>
                                setStatusDropdownOpen(!statusDropdownOpen)
                            }
                        >
                            <span>{selectedStatus}</span>
                            <ChevronDown size={16} className="ml-2" />
                        </button>

                        {statusDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                                <div
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        handleStatusSelect("Semua Status")
                                    }
                                >
                                    Semua Status
                                </div>
                                {statuses.map((status) => (
                                    <div
                                        key={status}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleStatusSelect(status)
                                        }
                                    >
                                        {status}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
                        {users.data && users.data.length > 0 ? (
                            users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t border-gray-100"
                                >
                                    <td className="py-3 px-4 md:text-md text-sm">
                                        {user.name}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
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
                                            <button
                                                onClick={() =>
                                                    router.visit(
                                                        route(
                                                            "admin.users.edit",
                                                            user.id
                                                        )
                                                    )
                                                }
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    confirmDelete(user)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-4 text-center text-gray-500"
                                >
                                    Tidak ada data pengguna.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="xl:flex items-center justify-between py-4">
                <div className="text-sm text-gray-500 lg:mb-0 mb-2">
                    Showing {users.from || 0} - {users.to || 0} of {users.total}{" "}
                    users
                </div>
                <div className="flex mr-auto md:mr-0 w-fit">
                    {users.links &&
                        users.links.map((link, index) => (
                            <button
                                key={index}
                                className={`px-3 py-1 border ${
                                    index === 0 ? "rounded-l" : ""
                                } ${
                                    index === users.links.length - 1
                                        ? "rounded-r"
                                        : ""
                                } ${
                                    link.active
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-50 border-gray-300"
                                } ${
                                    !link.url
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                } md:text-md text-sm`}
                                onClick={() =>
                                    link.url && handlePagination(link.url)
                                }
                                disabled={!link.url}
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            </button>
                        ))}
                </div>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium mb-4">
                            Konfirmasi Hapus
                        </h3>
                        <p>
                            Apakah Anda yakin ingin menghapus pengguna{" "}
                            <strong>{userToDelete?.name}</strong>?
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={executeDelete}
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
