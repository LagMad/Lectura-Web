import React, { useEffect, useState } from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import { useForm } from "@inertiajs/inertia-react";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

const Umum = ({ auth }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
        setRe,
    } = useForm({
        name: auth.user.name || "",
        email: auth.user.email || "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("profile.update"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <form
            onSubmit={submit}
            className="flex flex-col gap-10 w-full bg-white p-10 rounded-2xl"
        >
            <div className="flex flex-col gap-5 w-full">
                <div className="text-3xl font-bold">Umum</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* <div className="w-full col-span-1 md:col-span-2"> */}
                    <TextInput
                        label={"Nama"}
                        placeholder={"John Doe"}
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* </div> */}
                    {/* <Input label={"Nama Akhir"} placeholder={"... Doe"} /> */}
                    <TextInput
                        label={"Email"}
                        placeholder={"john.doe123@gmail.com"}
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* <Input label={"Telepon"} placeholder={"081234567890"} /> */}
                </div>
            </div>
            <div className="relative">
                <div className="w-1/2">
                    <TextInput
                        id="password"
                        type="password"
                        label="Masukkan kata sandi untuk konfirmasi"
                        placeholder={"Kata sandi saat ini..."}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <InputError message={errors.password} className="mt-2" />
            </div>
            <div className="w-full md:w-auto">
                <Button
                    className={"w-full md:w-auto text-center justify-center"}
                >
                    Simpan
                </Button>
            </div>
            {recentlySuccessful && (
                <div className="text-green-600">
                    Profile updated successfully.
                </div>
            )}
        </form>
    );
};

export default Umum;
