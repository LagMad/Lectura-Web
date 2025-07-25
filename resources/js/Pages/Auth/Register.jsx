import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import axios from "axios";
import { Icon } from "@iconify/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        nipd: "",
        role: "siswa",
    });

    const [registrationStatus, setRegistrationStatus] = useState({
        success: false,
        message: "",
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
                message: "NIPD tidak ditemukan atau sudah teregistrasi.",
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

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = (field) => {
        if (field === "password") {
            setShowPassword(!showPassword);
        } else if (field === "confirmation") {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        setRegistrationStatus({ success: false, message: "" });

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
            onSuccess: (page) => {
                // Registration successful
                setRegistrationStatus({
                    success: true,
                    message:
                        "Pendaftaran berhasil! Silahkan login dengan akun baru Anda.",
                });
                reset("password", "password_confirmation");

                // Optionally, redirect after a short delay
                setTimeout(() => {
                    window.location.href = route("login");
                }, 3000);
            },
            onError: (errors) => {
                // Registration failed with validation errors
                setRegistrationStatus({
                    success: false,
                    message: "Pendaftaran gagal. Silahkan periksa form Anda.",
                });
                console.error("Registration errors:", errors);
            },
            onFinish: () => {
                reset("password", "password_confirmation");
            },
        });
    };

    return (
        <div className="min-h-screen md:h-screen flex flex-col md:flex-row justify-center justify-items-center bg-white w-full">
            <div className="relative flex justify-center items-center w-full md:w-1/2 h-fit md:h-screen py-10 md:py-0 bg-[url(/auth-page.jpg)] bg-no-repeat bg-cover bg-center">
                <div className="absolute inset-0 bg-black/50 z-0" />
                <div className="flex flex-col justify-between items-center z-10 px-5 md:px-20 gap-3 h-full pb-0 md:pb-16">
                    <div className="hidden md:block"/>
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
            <div className="md:w-1/2 h-fit my-auto">
                <div className="flex flex-col items-center justify-center md:min-h-screen bg-gray-50 py-10 md:py-0 px-4 sm:px-6 lg:px-8">
                    <div className="w-full md:w-2/3">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-blue-600">
                                Daftar E-Library
                            </h1>
                            <p className="text-sm text-gray-600">
                                Buatlah Akun mu Sekarang Juga
                            </p>
                        </div>

                        {/* Registration Status Message */}
                        {registrationStatus.message && (
                            <div
                                className={`mb-4 p-4 rounded-md ${
                                    registrationStatus.success
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                            >
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Icon
                                            icon={
                                                registrationStatus.success
                                                    ? "mdi:check-circle"
                                                    : "mdi:alert-circle"
                                            }
                                            className="h-5 w-5"
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium">
                                            {registrationStatus.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                <div className="flex w-full">
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
                                        className="cursor-pointer ml-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10"
                                        autoComplete="new-password"
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-600 focus:outline-none mt-1"
                                        onClick={() =>
                                            togglePasswordVisibility("password")
                                        }
                                        tabIndex="-1"
                                    >
                                        <Icon
                                            icon={
                                                !showPassword
                                                    ? "mdi:eye-off"
                                                    : "mdi:eye"
                                            }
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
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
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-600 focus:outline-none mt-1"
                                        onClick={() =>
                                            togglePasswordVisibility(
                                                "confirmation"
                                            )
                                        }
                                        tabIndex="-1"
                                    >
                                        <Icon
                                            icon={
                                                !showConfirmPassword
                                                    ? "mdi:eye-off"
                                                    : "mdi:eye"
                                            }
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
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
                                    className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {processing ? "Mendaftar..." : "Daftar"}
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
