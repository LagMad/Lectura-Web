import React from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import {
    AiFillTwitterCircle,
    AiFillInstagram,
    AiFillFacebook,
    AiFillTikTok,
} from "react-icons/ai";

const MediaSosial = () => {
    return (
        <div className="flex flex-col gap-16 w-full bg-white p-10 rounded-2xl">
            <div className="flex flex-col gap-5 w-full">
                <div className="text-3xl font-bold">Media Sosial</div>
                <div className="flex flex-col lg:w-1/2 gap-5">
                    <Input
                        isSocialMedia={true}
                        icon={<AiFillInstagram color="#0081FC" size={32} />}
                    />
                    <Input
                        isSocialMedia={true}
                        icon={<AiFillTwitterCircle color="#0081FC" size={32} />}
                    />
                    <Input
                        isSocialMedia={true}
                        icon={<AiFillFacebook color="#0081FC" size={32} />}
                    />
                    <Input
                        isSocialMedia={true}
                        icon={<AiFillTikTok color="#0081FC" size={32} />}
                    />
                </div>
            </div>
            <div className="flex self-start">
                <Button>Simpan</Button>
            </div>
        </div>
    );
};

export default MediaSosial;
