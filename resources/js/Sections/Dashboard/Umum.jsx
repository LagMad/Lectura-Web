import React from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";

const Umum = ({ auth }) => {
    return (
        <div className="flex flex-col gap-16 w-full bg-white p-10 rounded-2xl">
            <div className="flex flex-col gap-5 w-full">
                <div className="text-3xl font-bold">Umum</div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="w-full col-span-2">
                        <Input
                            label={"Nama"}
                            placeholder={"John Doe"}
                            value={auth.user.name}
                        />
                    </div>
                    {/* <Input label={"Nama Akhir"} placeholder={"... Doe"} /> */}
                    <Input
                        label={"Email"}
                        placeholder={"john.doe123@gmail.com"}
                        value={auth.user.email}
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
