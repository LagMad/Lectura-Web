import { useState } from "react";

export default function PengaturanNotifikasi() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(false);
    return (
        <div>
            <h3 className="text-md font-medium mb-4">Pengaturan Notifikasi</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Notifikasi Email
                        </p>
                        <p className="text-xs text-gray-500">
                            Kirim email ketika ada peringatan tanggal
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setEmailNotif(!emailNotif)}
                            className={`w-12 h-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none cursor-pointer ${
                                emailNotif ? "bg-blue-500" : "bg-gray-200"
                            }`}
                        >
                            <span
                                className={`block w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ease-in-out ${
                                    emailNotif
                                        ? "translate-x-7"
                                        : "translate-x-1"
                                }`}
                            />
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-700">Notifikasi SMS</p>
                        <p className="text-xs text-gray-500">
                            Kirim SMS ketika ada peringatan tanggal
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setSmsNotif(!smsNotif)}
                            className={`w-12 h-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none cursor-pointer ${
                                smsNotif ? "bg-blue-500" : "bg-gray-200"
                            }`}
                        >
                            <span
                                className={`block w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ease-in-out ${
                                    smsNotif ? "translate-x-7" : "translate-x-1"
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
