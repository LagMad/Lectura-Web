import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Layout = ({ children }) => {
    return (
        <div className="font-[poppins]">
            <header>
                <Navbar />
            </header>

            <main className="min-h-screen z-0">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
