import React from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";

const KataSandi = () => {
    return (
        <div className="flex flex-col gap-16 w-full bg-white p-10 rounded-2xl">
            <div className="flex flex-col gap-5 w-full">
                <div className="text-3xl font-bold">Ganti Kata Sandi</div>
                <div className="flex flex-col lg:w-1/2 gap-5">
                    <Input
                        label={"Sandi Sekarang"}
                        placeholder={"John ..."}
                        isPassword={true}
                        required={true}
                    />
                    <Input
                        label={"Sandi Baru"}
                        placeholder={"... Doe"}
                        isPassword={true}
                        required={true}
                    />
                    <Input
                        label={"Konfirmasi Kata Sandi"}
                        placeholder={"john.doe123@gmail.com"}
                        isPassword={true}
                        required={true}
                    />
                </div>
            </div>
            <div className="flex self-start">
                <Button>Simpan</Button>
            </div>
        </div>
    );
};

export default KataSandi;
