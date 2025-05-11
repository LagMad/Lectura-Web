import React from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";

const Umum = () => {
    return (
        <div className="flex flex-col gap-16 w-full bg-white p-10 rounded-2xl">
            <div className="flex flex-col gap-5 w-full">
                <div className="text-3xl font-bold">Umum</div>
                <div className="grid grid-cols-2 gap-5">
                    <Input label={"Nama Awal"} placeholder={"John ..."} />
                    <Input label={"Nama Akhir"} placeholder={"... Doe"} />
                    <Input
                        label={"Email"}
                        placeholder={"john.doe123@gmail.com"}
                    />
                    <Input label={"Telepon"} placeholder={"081234567890"} />
                </div>
            </div>
            <div className="flex self-start">
                <Button>Simpan</Button>
            </div>
        </div>
    );
};

export default Umum;
