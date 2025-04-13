import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Layout = ({ children }) => {
    return (
        <div className="">
            <header>
                <Navbar />
            </header>

            <main className="min-h-screen z-0 overflow-hidden">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
