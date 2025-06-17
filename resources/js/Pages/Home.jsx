import React from "react";
import Layout from "../Layouts/Layout";
import BukuMinggu from "../Sections/Home/BukuMinggu";
import BukuPekan from "../Sections/Home/BukuPekan";
import BukuSemester from "../Sections/Home/BukuSemester";
import HeroSection from "../Sections/Home/HeroSection";
import SloganSection from "../Sections/Home/SloganSection";
import BookShowcase from "@/Sections/Home/BookShowcase";

const Home = ({ books }) => {
    return (
        <Layout>
            <div className="flex flex-col gap-7 lg:gap-16 px-5 sm:px-10 md:px-16 lg:px-20 xl:px-40 py-28 bg-cust-background-color">
                <HeroSection />
                <SloganSection />
                <BookShowcase
                    books={books}
                    judul={"Buku Terlaris Minggu Ini"}
                    subjudul={
                        <>
                            SEPANJANG{" "}
                            <span className="text-[#F0F1C5]">TERLARIS</span>{" "}
                            MINGGU INI
                        </>
                    }
                    deskripsi={
                        "Lagi rame dibaca! Buku-buku ini lagi jadi incaran para pembaca e-library minggu ini. Sudah baca belum?"
                    }
                    image={"/girl-reading-on-sofa.svg"}
                />
                <BookShowcase
                    books={books}
                    judul={"Bacaan Favorit Pekan Ini"}
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
                    judul={"Buku Favorit Sepanjang Semester"}
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
