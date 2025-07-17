import React from "react";
import { useForm, Head } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import Button from "@/Components/Button";

export default function KataSandi({ auth }) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("password.update"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="p-10 bg-white rounded-2xl w-full">
            <Head title="Ubah Kata Sandi" />

            <h2 className="text-3xl font-bold mb-6">Ubah Kata Sandi</h2>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <TextInput
                        id="current_password"
                        type="password"
                        label="Kata Sandi Saat Ini"
                        placeholder={"Kata sandi saat ini..."}
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <TextInput
                        id="password"
                        type="password"
                        label="Kata Sandi Baru"
                        placeholder={"Kata sandi baru..."}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        label="Konfirmasi Kata Sandi Baru"
                        placeholder={"Konfirmasi kata sandi baru..."}
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {recentlySuccessful && (
                    <div className="text-green-600 text-sm">
                        Kata sandi berhasil diperbarui.
                    </div>
                )}

                <Button variant="filled" disabled={processing}>Simpan</Button>
            </form>
        </div>
    );
}
