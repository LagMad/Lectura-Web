import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import axios from "axios";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        nipd: "",
        role: "siswa",
    });

    const [nipdStatus, setNipdStatus] = useState({
        checked: false,
        valid: false,
        message: "",
    });

    const validateNipd = async () => {
        try {
            const response = await axios.post("/validate-nipd", {
                nipd: data.nipd,
            });

            setNipdStatus({
                checked: true,
                valid: response.data.valid,
                message: response.data.message,
            });
        } catch (error) {
            setNipdStatus({
                checked: true,
                valid: false,
                message: "Terjadi kesalahan saat memvalidasi NIPD.",
            });
        }
    };

    const handleOnChange = (event) => {
        const { name, value } = event.target;

        if (name === "nipd") {
            const numericValue = value.replace(/\D/g, "");

            const truncatedValue = numericValue.slice(0, 5);

            setData(name, truncatedValue);

            setNipdStatus({
                checked: false,
                valid: false,
                message: "",
            });
        } else {
            setData(name, value);
        }
    };

    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasUpperLower: false,
        hasSymbol: false,
    });

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setData("password", password);

        setPasswordRequirements({
            minLength: password.length >= 8,
            hasUpperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
            hasSymbol: /[^A-Za-z0-9]/.test(password),
        });
    };

    const submit = (e) => {
        e.preventDefault();

        // Cek validasi NIPD sebelum submit jika belum divalidasi
        if (!nipdStatus.checked) {
            validateNipd().then(() => {
                if (nipdStatus.valid) {
                    proceedWithSubmit();
                }
            });
        } else if (nipdStatus.valid) {
            proceedWithSubmit();
        } else {
            // Jika NIPD tidak valid, fokus ke field NIPD
            document.getElementById("nipd").focus();
        }
    };

    const proceedWithSubmit = () => {
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="md:h-screen md:flex justify-center justify-items-center bg-white w-full">
            <div className="w-1/2 h-fit my-auto px-4 sm:px-6 lg:px-8 md:block hidden">
                <div className="mx-auto md:w-8/12 md:text-3xl text-2xl font-bold">
                    Daftarkan Dirimu E-Library!
                </div>
                <div className="mx-auto md:w-8/12 md:text-lg text-md mt-2">
                    Buka akses ke ribuan buku digital, artikel, dan referensi
                    berkualitas. Buat akun sekarang dan mulai menjelajah dunia
                    pengetahuan tanpa batas!
                </div>
            </div>
            <div className="md:w-1/2 h-fit my-auto">
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 md:py-12 py-4 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-blue-600">
                                Daftar E-Library
                            </h1>
                            <p className="text-sm text-gray-600">
                                Buatlah Akun mu Sekarang Juga
                            </p>
                        </div>

                        <form
                            onSubmit={submit}
                            className="space-y-4 bg-white p-6 rounded-md shadow"
                        >
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Lengkap"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    autoComplete="name"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="nipd"
                                    value="NIPD (Nomor Induk Peserta Didik)"
                                />
                                <div className="flex">
                                    <TextInput
                                        id="nipd"
                                        name="nipd"
                                        value={data.nipd}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                        onChange={handleOnChange}
                                        required
                                        maxLength={5}
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                    />
                                    <button
                                        type="button"
                                        className="ml-2 mt-1 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        onClick={validateNipd}
                                        disabled={!data.nipd || processing}
                                    >
                                        Validasi
                                    </button>
                                </div>

                                {nipdStatus.checked && (
                                    <div
                                        className={`mt-2 text-sm ${
                                            nipdStatus.valid
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {nipdStatus.message}
                                    </div>
                                )}

                                <InputError
                                    message={errors.nipd}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Kata Sandi"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    autoComplete="new-password"
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Konfirmasi Kata Sandi"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={
                                                passwordRequirements.minLength
                                            }
                                            readOnly
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-2">
                                        <label className="text-gray-600">
                                            Minimum 8 karakter
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={
                                                passwordRequirements.hasUpperLower
                                            }
                                            readOnly
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-2">
                                        <label className="text-gray-600">
                                            Setidaknya harus Kapital & Non -
                                            Kapital
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={
                                                passwordRequirements.hasSymbol
                                            }
                                            readOnly
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-2">
                                        <label className="text-gray-600">
                                            Setidaknya angka dan simbol
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500">
                                <p>
                                    Dengan mendaftar, kamu menyetujui{" "}
                                    <Link className="text-blue-600 hover:underline">
                                        Kebijakan Privasi Sekolah
                                    </Link>
                                </p>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Daftar
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-4 text-sm">
                            <p>
                                Sudah Punya Akun?{" "}
                                <Link
                                    href={route("login")}
                                    className="text-blue-600 hover:underline"
                                >
                                    Masuk
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
