import React, { useState } from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/Button";
import {
    AiFillTwitterCircle,
    AiFillInstagram,
    AiFillTikTok,
    AiFillLinkedin,
} from "react-icons/ai";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { useForm } from "@inertiajs/inertia-react";

const MediaSosial = ({ auth }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        instagram: auth.user.instagram || "",
        x: auth.user.x || "",
        linkedin: auth.user.linkedin || "",
        tiktok: auth.user.tiktok || "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("profile.update.socials"), {
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
                <div className="text-3xl font-bold">Media Sosial</div>
                <div className="flex flex-col lg:w-full gap-5">
                    <Input
                        name={"Instagram"}
                        isSocialMedia={true}
                        icon={<AiFillInstagram color="#0081FC" size={32} />}
                        placeholder="Instagram"
                        value={data.instagram}
                        onChange={(e) => setData("instagram", e.target.value)}
                    />

                    <Input
                        name={"X"}
                        isSocialMedia={true}
                        icon={<AiFillTwitterCircle color="#0081FC" size={32} />}
                        placeholder="X / Twitter"
                        value={data.x}
                        onChange={(e) => setData("x", e.target.value)}
                    />

                    <Input
                        name={"LinkedIn"}
                        isSocialMedia={true}
                        icon={<AiFillLinkedin color="#0081FC" size={32} />}
                        placeholder="LinkedIn"
                        value={data.linkedin}
                        onChange={(e) => setData("linkedin", e.target.value)}
                    />

                    <Input
                        name={"TikTok"}
                        isSocialMedia={true}
                        icon={<AiFillTikTok color="#0081FC" size={32} />}
                        placeholder="TikTok"
                        value={data.tiktok}
                        onChange={(e) => setData("tiktok", e.target.value)}
                    />
                </div>
            </div>
            <div className="relative">
                <div className="w-full">
                    <TextInput
                        id="password"
                        type="password"
                        label="Masukkan kata sandi untuk konfirmasi perubahan"
                        placeholder={"Kata sandi saat ini..."}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <InputError message={errors.password} className="mt-2" />
            </div>
            <div className="w-full md:w-auto ml-auto">
                <Button
                    variant="filled"
                    className={"w-full md:w-auto text-center justify-center"}
                >
                    Simpan
                </Button>
            </div>
        </form>
    );
};

export default MediaSosial;
