import React, { useState } from "react";
import Umum from "../Sections/Dashboard/Umum";
import MediaSosial from "../Sections/Dashboard/MediaSosial";
import KataSandi from "../Sections/Dashboard/KataSandi";

const Dashboard = () => {
    const [activeTitle, setActiveTitle] = useState("Umum");

    const sections = [
        {
            title: "Umum",
            component: <Umum />,
        },
        {
            title: "Kata Sandi",
            component: <KataSandi />,
        },
        {
            title: "Media Sosial",
            component: <MediaSosial />,
        },
    ];

    const activeSection = sections.find(
        (section) => section.title === activeTitle
    );

    return (
        <div className="flex flex-row justify-center items-start gap-10 px-20 py-24 w-full bg-cust-light-gray">
            <div className="flex flex-col justify-start items-start gap-8 w-1/6 bg-white p-10 rounded-2xl">
                <div className="flex flex-col justify-center items-center gap-3 w-full">
                    <img
                        className="w-16 h-auto"
                        src="/profile.svg"
                        alt="profile-pict"
                    />
                    <div className="flex flex-col justify-center items-center gap-0 w-full">
                        <div className="text-2xl font-medium">
                            Krisna Liantara
                        </div>
                        <div className="text-sm font-medium text-cust-dark-gray">
                            Anggota Sejak 2024
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-3 w-full">
                    {sections.map((section, index) => (
                        <button
                            key={index}
                            className={`cursor-pointer text-lg ${
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
            <div className="w-5/6 bg-white p-10 rounded-2xl">{activeSection.component}</div>
        </div>
    );
};

export default Dashboard;
