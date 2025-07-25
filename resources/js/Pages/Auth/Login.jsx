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
            <div className="relative w-full md:w-1/2 h-fit md:h-screen flex flex-col py-10 md:py-10 justify-center items-center bg-[url('/auth-page.jpg')] bg-no-repeat bg-cover bg-center">
                <div className="absolute inset-0 bg-black/50 z-0" />
                <div className="flex flex-col justify-between items-center z-10 px-5 md:px-20 gap-3 h-full pb-0 md:pb-16">
                    <div className="hidden md:block" />
                    <div className="space-y-5">
                        <div className="text-2xl md:text-4xl text-[#E9DFC3] font-bold text-center md:text-justify">
                            Daftarkan Dirimu di Lectura!
                        </div>
                        <div className="text-base md:text-xl mt-2 text-center md:text-justify text-white">
                            Buka akses ke ribuan buku digital, artikel, dan
                            referensi berkualitas. Buat akun sekarang dan mulai
                            menjelajah dunia pengetahuan tanpa batas!
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-3 w-full">
                        <img
                            className="w-1/3 ml-0 md:-ml-3"
                            src="/logo_smansa_batu.png"
                        />
                        <img
                            className="w-1/3 ml-0 md:-ml-3"
                            src="/logo_puma_rymba.png"
                        />
                        <img
                            className="w-1/3 ml-0 md:-ml-3"
                            src="/Logo-lectura-full-transparent-white.svg"
                        />
                    </div>
                </div>
            </div>
            <div className="md:w-1/2 h-fit w-full px-8 md:px-0 my-auto bg-white">
                <div className="flex flex-col sm:justify-center items-center bg-white">
                    <div className="w-full sm:w-2/3 mt-0 md:mt-6 md:px-6 py-8 md:py-4 overflow-hidden sm:rounded-lg">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-blue-600 mb-1">
                                Masuk E-Library Lectura
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
                                <TextInput
                                    id="password"
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

                            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={handleOnChange}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Ingat Saya
                                    </span>
                                </label>

                                <p
                                    href={route("password.request")}
                                    className="text-sm text-center md:text-right text-gray-600"
                                >
                                    Lupa Kata Sandi? <br />
                                    Kontak staf perpustakaan!
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
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
