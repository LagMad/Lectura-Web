import React from "react";
import Button from "@/Components/Button";

const Hero = ({ staff, books, user }) => {
    const stats = [
        { value: staff.length, label: "Staff Perpustakaan" },
        { value: books.length, label: "Koleksi Buku" },
        { value: "24/7", label: "Akses E-Library" },
        { value: user.length, label: "Pengguna Terdaftar" },
    ];

    return (
        <section>
            <div className="relative flex justify-start items-center bg-[url('/fotbar.jpg')] bg-center bg-cover bg-no-repeat h-screen px-5 sm:px-10 md:px-16 lg:px-20 xl:px-40 py-6">
                {/* Overlay */}
                <div className="absolute inset-0 bg-white/80 z-0" />

                {/* Content */}
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-start gap-0 md:gap-10 w-full">
                    <div className="w-full md:w-1/2 space-y-4 text-center lg:text-left">
                        <h1 className="font-bold text-3xl lg:text-4xl text-cust-dark">
                            Selamat Datang di E-Library PUMA Rymba
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                            Perpustakaan digital milik <strong>SMAN 1 Batu</strong> yang
                            dikembangkan oleh <strong>Lectura</strong> dari <strong>Tanoto Foundation</strong>,
                            menghadirkan akses pengetahuan tanpa batas bagi seluruh siswa dan tenaga pendidik.
                        </p>
                        {/* <div className="flex flex-row justify-center lg:justify-start gap-3 mt-6">
                            <Button variant="filled">Jelajahi Koleksi</Button>
                            <Button variant="filledReverse">Tentang Lectura</Button>
                        </div> */}
                    </div>
                    <div className="w-full md:w-1/2 justify-center items-center">
                        <img className="w-full md:w-4/5 lg:w-2/3 self-center mx-auto" src="/Logo-lectura-full-transparent.svg"/>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center pt-12 pb-0 md:py-20 px-5 sm:px-10 md:px-16 lg:px-20 xl:px-40 w-full">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-10 md:gap-24 w-full">
                    {stats.map((item, index) => (
                        <div key={index} className="flex flex-col justify-center items-center w-auto">
                            <h1 className="text-cust-blue font-bold text-2xl lg:text-4xl">
                                {item.value}
                            </h1>
                            <p className="text-cust-dark-gray font-medium text-center mt-2">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
