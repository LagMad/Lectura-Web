import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Layout = ({ children }) => {
    return (
        <>
            <header>
                <Navbar />
            </header>

            <main className=" h-max mpred:min-h-screen z-0 bg-cust-white overflow-hidden">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;
