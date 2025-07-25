import React, { useEffect, useState } from "react";
import Umum from "../Sections/Dashboard/Umum";
import MediaSosial from "../Sections/Dashboard/MediaSosial";
import KataSandi from "../Sections/Dashboard/KataSandi";
import Layout from "@/Layouts/Layout";
import Journaling from "@/Sections/Dashboard/Journaling";
import BukuFavorit from "@/Sections/Dashboard/BukuFavorit";

const Dashboard = ({
    auth,
    books,
    jurnaling,
    favoriteBooks,
    kategori,
    filters = {},
}) => {
    const [activeTitle, setActiveTitle] = useState("Umum");

    const sections = [
        {
            title: "Umum",
            component: <Umum auth={auth} />,
        },
        {
            title: "Kata Sandi",
            component: <KataSandi auth={auth} />,
        },
        {
            title: "Media Sosial",
            component: <MediaSosial auth={auth} />,
        },
        {
            title: "Jurnal",
            component: (
                <Journaling
                    auth={auth}
                    books={books.data}
                    jurnaling={jurnaling.data}
                />
            ),
        },
        {
            title: "Buku Favorit",
            component: (
                <BukuFavorit
                    favoriteBooks={favoriteBooks}
                    kategori={kategori}
                    filters={filters}
                />
            ),
        },
    ];

    const activeSection = sections.find(
        (section) => section.title === activeTitle
    );

    return (
        <Layout>
            <div className="relative flex flex-col lg:flex-row justify-center items-start gap-10 min-h-screen px-5 md:px-20 pt-28 pb-10 bg-[#F5F5F5]">
                <div className="flex md:sticky top-24 flex-col justify-start items-start gap-8 bg-white p-10 rounded-2xl w-full lg:w-1/5">
                    <div className="flex flex-col justify-center items-center gap-3 w-full">
                        <img
                            className="w-16 h-auto"
                            src="/profile.svg"
                            alt="profile-pict"
                        />
                        <div className="flex flex-col justify-center text-center items-center gap-0 w-full">
                            <div className="text-2xl font-medium">
                                {auth.user.name}
                            </div>
                            <div className="text-sm font-medium text-cust-dark-gray">
                                Anggota Sejak{" "}
                                {new Date(
                                    auth.user.created_at
                                ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-3 w-full">
                        {sections.map((section, index) => (
                            <button
                                key={index}
                                className={`cursor-pointer text-lg text-center md:text-left w-full md:w-auto ${
                                    activeTitle === section.title
                                        ? "font-bold text-cust-blue"
                                        : "font-normal text-cust-gray"
                                }`}
                                onClick={() => {
                                    setActiveTitle(section.title);
                                }}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-4/5">{activeSection.component}</div>
            </div>
        </Layout>
    );
};

export default Dashboard;
