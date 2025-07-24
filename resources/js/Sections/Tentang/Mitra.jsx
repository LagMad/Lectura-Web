import React from "react";
import MitraImage from "../../../../public/mitra.webp";

const Mitra = () => {
    return (
        <section>
            <div className="container mx-auto py-20 space-y-10 lg:space-y-6">
                <div className="text-center mb-12">
                    <h1 className="font-bold text-3xl">Mitra Kami</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 justify-center items-center w-full gap-10">
                    <img
                        src={"/logo_smansa_batu.png"}
                        alt="Mitra Kami"
                        className="w-2/3 mx-auto"
                    />
                    <img
                        src={"/logo_puma_rymba.png"}
                        alt="Mitra Kami"
                        className="-mt-10 w-2/3 mx-auto"
                    />
                    <img
                        src={"/logo_lpm_display.png"}
                        alt="Mitra Kami"
                        className="w-2/3 mx-auto"
                    />
                </div>
            </div>
        </section>
    );
};

export default Mitra;
