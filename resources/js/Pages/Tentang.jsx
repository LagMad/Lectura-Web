import Layout from "@/Layouts/Layout";
import Hero from "@/Sections/Tentang/Hero";
import MediaLibrary from "@/Sections/Tentang/MediaLibrary";
import Mitra from "@/Sections/Tentang/Mitra";
import Pelayanan from "@/Sections/Tentang/Pelayanan";
import Staff from "@/Sections/Tentang/Staff";
import WebPortal from "@/Sections/Tentang/WebPortal";
import React, { useEffect } from "react";

const Tentang = ({ staff, books, user, videos, web }) => {
    return (
        <Layout>
            <div className="">
                <Hero staff={staff} books={books} user={user} />
                {/* <Pelayanan /> */}
                <Staff staff={staff} />
                <MediaLibrary videos={videos} />
                <Mitra />
                <WebPortal web={web} />
            </div>
        </Layout>
    );
};

export default Tentang;
