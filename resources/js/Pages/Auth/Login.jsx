import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleOnChange = (event) => {
        setData(
            event.target.name,
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="md:h-screen md:flex justify-center justify-items-center bg-white w-full">
            <div className="w-1/2 h-fit my-auto md:block hidden">
                <div className="mx-auto w-8/12 text-3xl font-bold">
                    Selamat Datang Kembali
                </div>
                <div className="mx-auto w-8/12 text-lg mt-2">
                    Akses koleksi buku digital favoritmu dan lanjutkan
                    petualangan membaca. Masuk untuk menikmati pengalaman
                    membaca yang praktis dan menyenangkan!
                </div>
            </div>
            <div className="md:w-1/2 h-fit w-full px-8 md:px-0 my-auto bg-white">
                <div className="flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-white">
                    <div className="w-full sm:max-w-md mt-6 md:px-6 py-4 overflow-hidden sm:rounded-lg">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-blue-600 mb-1">
                                Masuk E-Library
                            </h1>
                            <p className="text-gray-600">
                                Masuk ke akun sekolah mu
                            </p>
                        </div>

                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 mb-2"
                                    htmlFor="email"
                                >
                                    Alamat Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleOnChange}
                                    required
                                    autoFocus
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 mb-2"
                                    htmlFor="password"
                                >
                                    Kata Sandi
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleOnChange}
                                    required
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={handleOnChange}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Ingat Saya
                                    </span>
                                </label>

                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Lupa Kata Sandi?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Masuk
                            </button>

                            <div className="flex items-center justify-center mt-4">
                                <span className="text-sm text-gray-600">
                                    Belum Punya Akun?
                                </span>
                                <Link
                                    href={route("register")}
                                    className="ml-1 text-sm text-blue-600 hover:underline"
                                >
                                    Daftar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </div>
    );
}
