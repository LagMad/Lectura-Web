import Layout from "@/Layouts/Layout";
import Hero from "@/Sections/Tentang/Hero";
import MediaLibrary from "@/Sections/Tentang/MediaLibrary";
import Mitra from "@/Sections/Tentang/Mitra";
import Pelayanan from "@/Sections/Tentang/Pelayanan";
import Staff from "@/Sections/Tentang/Staff";
import React, { useEffect } from "react";

const Tentang = ({ staff, books, user, videos }) => {

    useEffect(() => {
        console.log("videos", videos)
    }, [videos])

    return (
        <Layout>
            <div className="">
                <Hero staff={staff} books={books} user={user}/>
                {/* <Pelayanan /> */}
                <Staff staff={staff}/>
                <MediaLibrary videos={videos}/>
                <Mitra />
            </div>
        </Layout>
    );
};

export default Tentang;
