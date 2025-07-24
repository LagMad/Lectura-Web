import React from "react";
import MitraImage from "../../../../public/mitra.webp";

const WebPortal = ({ web }) => {
    return (
        <section>
            <div className="container mx-auto py-20 space-y-10 lg:space-y-6">
                <div className="text-center mb-12">
                    <div className="font-bold text-3xl">Portal Web</div>
                    <p className="text-sm sm:text-base lg:text-lg mt-2 text-cust-dark-gray">
                        Kunjungi website SMAN 1 Batu yang lainnya!
                    </p>
                </div>
                {web.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-10 justify-center items-center w-full">
                        {web.map((web) => (
                            <button
                                onClick={() =>
                                    window.open(web.web_link, "_blank")
                                }
                                className="flex flex-col justify-center items-center gap-5 p-5 shadow-lg hover:shadow-xl rounded-2xl cursor-pointer scale-100 hover:scale-105 transition-all duration-300 ease-in-out"
                            >
                                <img
                                    src={web.image_path}
                                    alt="Mitra Kami"
                                    className="w-2/3"
                                />
                                <div className="flex flex-col justify-center items-center gap-0">
                                    <span className="font-semibold text-2xl">
                                        {web.nama}
                                    </span>
                                    <span className="font-normal text-base text-gray-500">
                                        {web.deskripsi}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center w-full">
                        Tidak ada website portal yang ditemukan
                    </div>
                )}
            </div>
        </section>
    );
};

export default WebPortal;
