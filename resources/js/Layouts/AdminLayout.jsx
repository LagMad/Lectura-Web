import { Menu, LogOut, User, BookOpen, Settings, Bell, LayoutDashboardIcon, LayoutDashboard } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

export default function AdminLayout({
    children,
    isSidebarOpen,
    toggleSidebar,
}) {
    const { url } = usePage();
    const { auth } = usePage().props;

    // Function to check if a route is active
    const isActive = (path) => {
        return url.startsWith(path);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-[poppins]">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                className="p-2 rounded-md text-gray-500 lg:hidden"
                                onClick={toggleSidebar}
                            >
                                <Menu size={24} />
                            </button>
                            <div className="flex-shrink-0 flex items-center">
                                <a
                                    href="/"
                                    className="text-cust-blue text-2xl font-bold ml-2 sm:ml-0 no-underline hover:opacity-80 transition-opacity"
                                >
                                    E-Library
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-1">
                                <Bell size={20} className="text-gray-500" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-medium text-gray-700">
                                    {auth.user.name.split(" ")[0]}
                                </span>
                                <div className="h-8 w-8 rounded-full bg-cust-blue text-white flex items-center justify-center">
                                    <User size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 z-0">
                {/* Overlay for mobile - only visible when sidebar is open */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={toggleSidebar}
                    ></div>
                )}

                {/* Sidebar */}
                <div
                    className={`${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out`}
                >
                    <div className="h-16 flex items-center justify-center lg:justify-start px-4 border-b border-gray-200">
                        <h2 className="font-semibold text-lg">MENU</h2>
                    </div>
                    <div className="py-4">
                        <ul className="space-y-1">
                            <li>
                                <Link
                                    href="/admin-dashboard"
                                    className={`flex items-center px-4 py-2 text-sm font-medium ${
                                        isActive("/admin-dashboard")
                                            ? "text-cust-blue bg-blue-50 hover:bg-blue-100"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <LayoutDashboard
                                        size={18}
                                        className={`mr-3 ${
                                            isActive("/admin-dashboard")
                                                ? "text-cust-blue"
                                                : "text-gray-500"
                                        }`}
                                    />
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin-buku"
                                    className={`flex items-center px-4 py-2 text-sm font-medium ${
                                        isActive("/admin-buku") ||
                                        isActive("/admin-tambah-buku") ||
                                        isActive("/admin-edit-buku/")
                                            ? "text-cust-blue bg-blue-50 hover:bg-blue-100"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <BookOpen
                                        size={18}
                                        className={`mr-3 ${
                                            isActive("/admin-buku") ||
                                            isActive("/admin-tambah-buku")
                                                ? "text-cust-blue"
                                                : "text-gray-500"
                                        }`}
                                    />
                                    <span>Buku</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin-pengguna"
                                    className={`flex items-center px-4 py-2 text-sm font-medium ${
                                        isActive("/admin-pengguna")
                                            ? "text-cust-blue bg-blue-50 hover:bg-blue-100"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <User
                                        size={18}
                                        className={`mr-3 ${
                                            isActive("/admin-pengguna")
                                                ? "text-cust-blue"
                                                : "text-gray-500"
                                        }`}
                                    />
                                    <span>Pengguna</span>
                                </Link>
                            </li>
                            {/* <li>
                                <Link
                                    href="/admin-pengaturan"
                                    className={`flex items-center px-4 py-2 text-sm font-medium ${
                                        isActive("/admin-pengaturan")
                                            ? "text-cust-blue bg-blue-50 hover:bg-blue-100"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <Settings
                                        size={18}
                                        className={`mr-3 ${
                                            isActive("/admin-pengaturan")
                                                ? "text-cust-blue"
                                                : "text-gray-500"
                                        }`}
                                    />
                                    <span>Pengaturan</span>
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                    <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
                        <button className="flex items-center text-red-500 hover:text-red-700">
                            <LogOut size={18} className="mr-2" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                {children}
            </div>
        </div>
    );
}
