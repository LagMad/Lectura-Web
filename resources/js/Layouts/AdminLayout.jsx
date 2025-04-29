import { Menu, LogOut, User, BookOpen, Settings, Bell } from "lucide-react";

export default function AdminLayout({
    children,
    isSidebarOpen,
    toggleSidebar,
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-[poppins]">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
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
                                <h1 className="text-cust-blue text-2xl font-bold ml-2 sm:ml-0 ">
                                    E-Library
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-1">
                                <Bell size={20} className="text-gray-500" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-medium text-gray-700">
                                    Ahmad Irza
                                </span>
                                <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                    <User size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1">
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
                                <a
                                    href="#"
                                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    <BookOpen
                                        size={18}
                                        className="mr-3 text-gray-500"
                                    />
                                    <span>Manajemen Buku</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
                                >
                                    <User
                                        size={18}
                                        className="mr-3 text-blue-500"
                                    />
                                    <span>Pengguna</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    <Settings
                                        size={18}
                                        className="mr-3 text-gray-500"
                                    />
                                    <span>Pengaturan</span>
                                </a>
                            </li>
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
