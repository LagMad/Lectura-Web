import React, { useState } from "react";
import General from "../Sections/Dashboard/General";
import EditProfile from "../Sections/Dashboard/EditProfile";
import Password from "../Sections/Dashboard/Password";
import SocialProfiles from "../Sections/Dashboard/SocialProfiles";
import PinjamanBuku from "../Sections/Dashboard/PinjamanBuku";

const Dashboard = () => {
    const [activeTitle, setActiveTitle] = useState("General");

    const sections = [
        {
            title: "General",
            component: <General />,
            titleDesc: "Update your username and manage your account",
        },
        {
            title: "Edit Profile",
            component: <EditProfile />,
            titleDesc: "Setup your Account presence and hiring needs",
        },
        {
            title: "Password",
            component: <Password />,
            titleDesc: "Manage your password",
        },
        {
            title: "Social Profiles",
            component: <SocialProfiles />,
            titleDesc: "Add elsewhere links to your profile",
        },
        {
            title: "Pinjaman Buku",
            component: <PinjamanBuku />,
            titleDesc: "Borrowed books",
        },
    ];

    const activeSection = sections.find(
        (section) => section.title === activeTitle
    );

    return (
        <div className="flex flex-col justify-start items-start gap-10 px-36 py-24 w-full">
            <div className="flex flex-row justify-center items-stretch gap-5 w-full">
                <img
                    className="w-16 h-auto"
                    src="/profile.svg"
                    alt="profile-pict"
                />
                <div className="flex flex-col justify-center items-start gap-0 w-full">
                    <div className="text-2xl font-medium">
                        Krisna Liantara{" "}
                        <span className="text-cust-gray font-light">/</span>{" "}
                        {activeSection.title}
                    </div>
                    <div className="text-sm font-medium text-cust-dark-gray">
                        {activeSection.titleDesc}
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-start items-start gap-10 w-full">
                <div className="flex flex-col justify-start items-start gap-3 w-1/6">
                    {sections.map((section, index) => (
                        <button
                            key={index}
                            className={`cursor-pointer text-lg ${
                                activeTitle === section.title
                                    ? "font-bold text-black"
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
                <div className="w-5/6">{activeSection.component}</div>
            </div>
        </div>
    );
};

export default Dashboard;
