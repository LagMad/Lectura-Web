import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="md:h-screen flex justify-center justify-items-center bg-white w-full">
            <div className="w-1/2 h-fit my-auto">
                <div className="mx-auto w-8/12 text-3xl font-bold">
                    Daftarkan Dirimu E-Library!
                </div>
                <div className="mx-auto w-8/12 text-lg mt-2">
                    Buka akses ke ribuan buku digital, artikel, dan referensi
                    berkualitas. Buat akun sekarang dan mulai menjelajah dunia
                    pengetahuan tanpa batas!
                </div>
            </div>
            <div className="w-1/2 h-fit my-auto">
                <div className="w-fit mx-auto font-bold text-2xl">
                    Daftar Akun Sekolah
                </div>
                <div className="w-8/12 mx-auto">
                    <form onSubmit={submit}>
                        <div className="mt-4">
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border-2 border-black"
                                placeholder="Email"
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

                        <div className="mt-4">
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full border-2 border-black"
                                autoComplete="name"
                                placeholder="Nama Lengkap"
                                isFocused={true}
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

                        <div className="mt-4">
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border-2 border-black"
                                autoComplete="new-password"
                                placeholder="Kata Sandi"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full border-2 border-black"
                                autoComplete="new-password"
                                placeholder="Konfirmasi Kata Sandi"
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

                        <div className="mt-4 w-full items-center">
                            <PrimaryButton
                                className="w-full text-center py-3"
                                disabled={processing}
                            >
                                <div className="mx-auto w-fit">Daftar</div>
                            </PrimaryButton>
                        </div>
                        <div className="mt-3 w-fit mx-auto">
                            <Link
                                href={route("login")}
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Already registered?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

{
}
