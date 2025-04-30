import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Pengaturan() {
    const [notifications, setNotifications] = useState({
        dueDateReminder: true,
        newBookNotification: false,
        systemMaintenance: false,
    });

    const [twoFactorAuth, setTwoFactorAuth] = useState(true);

    const handleToggle = (setting) => {
        setNotifications((prev) => ({
            ...prev,
            [setting]: !prev[setting],
        }));
    };

    const handleTwoFactorToggle = () => {
        setTwoFactorAuth(!twoFactorAuth);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen w-full">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
                <p className="text-gray-600 mb-8">
                    Kelola pengaturan dan konfigurasi sistem perpustakaan Anda
                </p>

                {/* General Settings */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Pengaturan Umum
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Perpustakaan
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kontak Email
                            </label>
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor Telepon
                            </label>
                            <input
                                type="tel"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Zona Waktu
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Notification Settings - Takes up 3/4 of the width */}
                    <div className="bg-white rounded-lg shadow p-6 xl:col-span-3">
                        <h2 className="text-lg font-semibold mb-4">
                            Pengaturan Notifikasi
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="w-3/4">
                                    <h3 className="font-medium text-gray-800">
                                        Pengingat Tanggal Jatuh Tempo
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Kirim pemberitahuan sebelum buku jatuh
                                        tempo
                                    </p>
                                </div>
                                <button
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                        notifications.dueDateReminder
                                            ? "bg-blue-600"
                                            : "bg-gray-300"
                                    }`}
                                    onClick={() =>
                                        handleToggle("dueDateReminder")
                                    }
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                            notifications.dueDateReminder
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="w-3/4">
                                    <h3 className="font-medium text-gray-800">
                                        Pemberitahuan Buku Baru
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Beri tahu pengguna tentang kedatangan
                                        buku baru
                                    </p>
                                </div>
                                <button
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                        notifications.newBookNotification
                                            ? "bg-blue-600"
                                            : "bg-gray-300"
                                    }`}
                                    onClick={() =>
                                        handleToggle("newBookNotification")
                                    }
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                            notifications.newBookNotification
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="w-3/4">
                                    <h3 className="font-medium text-gray-800">
                                        Pemeliharaan Sistem
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Peringatan tentang waktu henti sistem
                                    </p>
                                </div>
                                <button
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                        notifications.systemMaintenance
                                            ? "bg-blue-600"
                                            : "bg-gray-300"
                                    }`}
                                    onClick={() =>
                                        handleToggle("systemMaintenance")
                                    }
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                            notifications.systemMaintenance
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings - Takes up 1/4 of the width */}
                    <div className="bg-white rounded-lg shadow p-6 xl:col-span-1">
                        <h2 className="text-lg font-semibold mb-4">Keamanan</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kedaluarsa Kata Sandi
                                </label>
                                <div className="relative">
                                    <select className="appearance-none w-full border border-gray-300 rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>30 Hari</option>
                                        <option>60 Hari</option>
                                        <option>90 Hari</option>
                                        <option>Tidak Pernah</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-800">
                                        Autentikasi 2 Faktor
                                    </h3>
                                </div>
                                <button
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                        twoFactorAuth
                                            ? "bg-blue-600"
                                            : "bg-gray-300"
                                    }`}
                                    onClick={handleTwoFactorToggle}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                            twoFactorAuth
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
}
