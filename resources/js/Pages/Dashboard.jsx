import React, { useState } from "react";
import Umum from "../Sections/Dashboard/Umum";
import MediaSosial from "../Sections/Dashboard/MediaSosial";
import KataSandi from "../Sections/Dashboard/KataSandi";
import Layout from "@/Layouts/Layout";
import Journaling from "@/Sections/Dashboard/Journaling";

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
        {
            title: "Jurnal",
            component: <Journaling />,
        },
    ];

    const activeSection = sections.find(
        (section) => section.title === activeTitle
    );

    return (
        <Layout>
            <div className="flex flex-col lg:flex-row justify-center items-start gap-10 container py-40 bg-[#F5F5F5]">
                <div className="flex flex-col justify-start items-start gap-8 bg-white p-10 rounded-2xl">
                    <div className="flex flex-col justify-center items-center gap-3 w-full">
                        <img
                            className="w-16 h-auto"
                            src="/profile.svg"
                            alt="profile-pict"
                        />
                        <div className="flex flex-col justify-center text-center items-center gap-0 w-full">
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
                                className={`cursor-pointer text-lg ${activeTitle === section.title
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
                <div className="lg:w-2/3">{activeSection.component}</div>
            </div>
        </Layout>
    );
};

export default Dashboard;


// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head } from '@inertiajs/react';

// export default function Dashboard() {
//     return (
//         <AuthenticatedLayout
//             header={
//                 <h2 className="text-xl font-semibold leading-tight text-gray-800">
//                     Dashboard
//                 </h2>
//             }
//         >
//             <Head title="Dashboard" />

//             <div className="py-12">
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
//                         <div className="p-6 text-gray-900">
//                             You're logged in!
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }
