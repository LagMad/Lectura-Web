import React, { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";

export default function EditPengguna({ user }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        status: user.status || "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("users.update", user.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Redirect handled by controller
            },
        });
    };

    const handleClose = () => {
        router.visit(route("users.admin"));
    };

    return (
        <AdminLayout
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
        >
            <Head title="Edit Pengguna" />
            <div className="w-full bg-white">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Edit Pengguna
                        </h2>
                        <button 
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full p-2"
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Masukkan nama lengkap"
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full p-2"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="Masukkan email"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="role" value="Keanggotaan" />
                            <select
                                id="role"
                                name="role"
                                value={data.role}
                                onChange={(e) =>
                                    setData("role", e.target.value)
                                }
                                className="p-2 mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            >
                                <option value="">Pilih Keanggotaan</option>
                                <option value="admin">Admin</option>
                                <option value="guru">Guru</option>
                                <option value="siswa">Siswa</option>
                            </select>
                            <InputError
                                message={errors.role}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="status" value="Status" />
                            <select
                                id="status"
                                name="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="p-2 mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            >
                                <option value="">Pilih Status</option>
                                <option value="Aktif">Aktif</option>
                                <option value="NonAktif">NonAktif</option>
                                <option value="Diblokir">Diblokir</option>
                            </select>
                            <InputError
                                message={errors.status}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password Baru (Opsional)" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full p-2"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                placeholder="Kosongkan jika tidak ingin mengubah password"
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Konfirmasi Password Baru"
                            />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full p-2"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                placeholder="Konfirmasi password baru"
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end pt-6 space-x-3">
                            <SecondaryButton onClick={handleClose}>
                                Batal
                            </SecondaryButton>

                            <PrimaryButton
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={processing}
                            >
                                {processing ? "Menyimpan..." : "Perbarui"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}