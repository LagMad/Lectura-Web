import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Layout = ({ children }) => {
    return (
        <>
            <header>
                <Navbar />
            </header>

            <main className="min-h-screen z-0 bg-cust-light-gray overflow-hidden">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;
