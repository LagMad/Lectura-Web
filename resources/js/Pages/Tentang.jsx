import Layout from "@/Layouts/Layout";
import Hero from "@/Sections/Tentang/Hero";
import MediaLibrary from "@/Sections/Tentang/MediaLibrary";
import Mitra from "@/Sections/Tentang/Mitra";
import Pelayanan from "@/Sections/Tentang/Pelayanan";
import Staff from "@/Sections/Tentang/Staff";
import React, { useEffect } from "react";

const Tentang = ({ staff }) => {
    useEffect(() => {
        console.log("staff", staff);
    }, [staff]);

    return (
        <Layout>
            <div className="pt-20">
                <Hero />
                {/* <Pelayanan /> */}
                <Staff staff={staff}/>
                <MediaLibrary />
                <Mitra />
            </div>
        </Layout>
    );
};

export default Tentang;
