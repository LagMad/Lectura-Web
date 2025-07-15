import React, { useEffect } from "react";
import Layout from "../Layouts/Layout";
import BukuMinggu from "../Sections/Home/BukuMinggu";
import BukuPekan from "../Sections/Home/BukuPekan";
import BukuSemester from "../Sections/Home/BukuSemester";
import HeroSection from "../Sections/Home/HeroSection";
import SloganSection from "../Sections/Home/SloganSection";
import BookShowcase from "@/Sections/Home/BookShowcase";
import KategoriBuku from "@/Sections/Home/KategoriBuku";

const Home = ({ books, pengumuman }) => {

    return (
        <Layout>
            <HeroSection pengumuman={pengumuman}/>
            <div className="flex flex-col gap-7 lg:gap-16 px-5 sm:px-10 md:px-16 lg:px-20 xl:px-40 pt-12 pb-28 bg-cust-background-color">
                <KategoriBuku books={books}/>
                <SloganSection />
                <BookShowcase
                    books={books}
                    judul={"Buku dengan Rating Tertinggi"}
                    subjudul={
                        <>
                            SEPANJANG{" "}
                            <span className="text-[#F0F1C5]">TERLARIS</span>{" "}
                            MINGGU INI
                        </>
                    }
                    deskripsi={
                        "Buku-buku koleksi perpustakaan yang paling populer dan disukai siswa nih! Kamu sendiri udah pernah baca belum?"
                    }
                    image={"/girl-reading-on-sofa.svg"}
                />
                <BookShowcase
                    books={books}
                    judul={"Karya Siswa"}
                    subjudul={
                        <>
                            BACAAN{" "}
                            <span className="text-[#F0F1C5]">FAVORIT</span>{" "}
                            MINGGU INI
                        </>
                    }
                    deskripsi={
                        "Buku-buku yang paling banyak dibaca dan disukai minggu ini. Buktikan sendiri kenapa mereka jadi pilihan favorit para pembaca!"
                    }
                    image={"/boy-reading.svg"}
                />
                <BookShowcase
                    books={books}
                    judul={"Karya Guru"}
                    subjudul={
                        <>
                            SEPANJANG{" "}
                            <span className="text-[#F0F1C5]">SEMESTER</span>{" "}
                        </>
                    }
                    deskripsi={
                        "Deretan buku terbaik pilihan pembaca selama satu semester penuh. Bacaan yang terus relevan, memikat, dan tak terlupakan."
                    }
                    image={"/girl-reading.svg"}
                />
                {/* <BukuMinggu books={books} />
                <BukuPekan books={books} />
                <BukuSemester books={books} /> */}
            </div>
        </Layout>
    );
};

export default Home;
