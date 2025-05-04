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

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="md:h-screen flex justify-center justify-items-center bg-white w-full">
            <div className="w-1/2 h-fit my-auto">
                <div className="mx-auto w-8/12 text-3xl font-bold">
                    Selamat Datang Kembali
                </div>
                <div className="mx-auto w-8/12 text-lg mt-2">
                    Akses koleksi buku digital favoritmu dan lanjutkan
                    petualangan membaca. Masuk untuk menikmati pengalaman
                    membaca yang praktis dan menyenangkan!
                </div>
            </div>
            <div className="w-1/2 h-fit my-auto">
                <div className="w-fit mx-auto font-bold text-2xl">
                    Masuk Akun Sekolah
                </div>
                <div className="w-8/12 mx-auto">
                    <form onSubmit={submit}>
                        <div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={data.email}
                                className="mt-1 block w-full border-2 border-black"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border-2 border-black"
                                autoComplete="current-password"
                                placeholder="Kata Sandi"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 justify-between flex">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Forgot your password?
                                </Link>
                            )}
                        </div>

                        <div className="mt-4 w-full items-center">
                            <PrimaryButton
                                className="w-full text-center py-3"
                                disabled={processing}
                            >
                                <div className="mx-auto w-fit">Masuk</div>
                            </PrimaryButton>
                        </div>
                    </form>
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
