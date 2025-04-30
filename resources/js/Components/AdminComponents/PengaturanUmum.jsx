import { ChevronDown } from "lucide-react";

export default function PengaturanUmum() {
    return (
        <div className="mb-8">
            <h3 className="text-md font-medium mb-4">Pengaturan Umum</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Nama Perpustakaan
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        defaultValue="Tanoto E-Library"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Kontak Email
                    </label>
                    <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        defaultValue="tanotofoundation@org"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Zona Waktu
                    </label>
                    <div className="relative">
                        <select className="w-full p-2 border border-gray-300 rounded appearance-none text-sm">
                            <option>UTC +7 (Eastern Time)</option>
                        </select>
                        <ChevronDown
                            size={16}
                            className="absolute right-3 top-3 text-gray-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
