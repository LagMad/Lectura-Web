import React from "react";
import HeroImage from "../../../../public/hero-profile.webp";
import Button from "@/Components/Button";

const Hero = ({ staff, books, user }) => {
    const stats = [
        { value: staff.length, label: "Staff Perpustakaan" },
        { value: books.length, label: "Koleksi Buku" },
        { value: "24/7", label: "Akses E-Library" },
        { value: user.length, label: "Pengguna Terdaftar" },
    ];

    return (
        <section className="">
            <div className="relative flex justify-start items-center bg-[url('/hero-profile.webp')] bg-center bg-cover bg-no-repeat h-screen px-5 sm:px-10 md:px-16 lg:px-20 xl:px-40 py-6">
                {/* Overlay */}
                <div className="absolute inset-0 bg-white/80 z-0" />

                {/* Content */}
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-start gap-10 w-full lg:w-1/2">
                    <div className="w-full space-y-4 text-center lg:text-left">
                        <h1 className="font-bold text-3xl lg:text-4xl">
                            Bertemu dengan Tim Perpustakaan
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-700">
                            Profesional yang berdedikasi berkomitmen untuk
                            mendukung perjalanan akademik dan kebutuhan
                            penelitian Anda.
                        </p>
                        <div className="flex flex-row justify-center lg:justify-start gap-3 mt-6">
                            <Button variant="filled">Mulai Perjalanan</Button>
                            <Button variant="filledReverse">
                                Jam Perpustakaan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center py-20 px-5 sm:px-10 md:px-16 lg:px-20 xl:px-40 w-full">
                <div className="grid grid-cols-4 gap-24 w-full">
                    {stats.map((item, index) => (
                        <div key={index} className="flex flex-col justify-center items-center w-auto">
                            <h1 className="text-cust-blue font-bold text-2xl lg:text-4xl">
                                {item.value}
                            </h1>
                            <p className="text-cust-dark-gray font-medium mt-2">
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
