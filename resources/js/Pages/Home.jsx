import React, { useEffect } from "react";
import Layout from "../Layouts/Layout";
import HeroSection from "../Sections/Home/HeroSection";
import SloganSection from "../Sections/Home/SloganSection";
import BookShowcase from "@/Sections/Home/BookShowcase";
import KategoriBuku from "@/Sections/Home/KategoriBuku";

const Home = ({
    books,
    pengumuman,
    karyaSiswa,
    karyaGuru,
    karyaKoleksiPerpustakaan,
}) => {
    return (
        <Layout>
            <HeroSection pengumuman={pengumuman} />
            <div
                className={`flex flex-col gap-7 lg:gap-16 px-5 sm:px-10 md:px-16 lg:px-20 xl:px-40 pt-12 pb-28 bg-cust-background-color`}
            >
                <KategoriBuku books={books} />
                <SloganSection />
                <BookShowcase
                    books={karyaKoleksiPerpustakaan}
                    judul={"Koleksi Perpustakaan"}
                    subjudul={
                        <>
                            KOLEKSI{" "}
                            <span className="text-[#F0F1C5]">PERPUSTAKAAN</span>{" "}
                        </>
                    }
                    deskripsi={
                        "Buku-buku koleksi perpustakaan yang paling populer dan disukai siswa nih! Kamu sendiri udah pernah baca belum?"
                    }
                    image={"/girl-reading-on-sofa.svg"}
                />
                <BookShowcase
                    books={karyaSiswa}
                    judul={"Karya Siswa"}
                    subjudul={
                        <>
                            KARYA <span className="text-[#F0F1C5]">SISWA</span>{" "}
                        </>
                    }
                    deskripsi={
                        "Buku karya teman-teman siswa dengan review tertinggi! Buktikan sendiri kenapa mereka jadi pilihan favorit!"
                    }
                    image={"/boy-reading.svg"}
                />
                <BookShowcase
                    books={karyaGuru}
                    judul={"Karya Guru"}
                    subjudul={
                        <>
                            KARYA <span className="text-[#F0F1C5]">GURU</span>{" "}
                        </>
                    }
                    deskripsi={
                        "Deretan karya terbaik para pahlawan tanpa tanda jasa SMAN 1 Kota Batu. Bacaan yang terus relevan, memikat, dan tak terlupakan."
                    }
                    image={"/girl-reading.svg"}
                />
            </div>
        </Layout>
    );
};

export default Home;
