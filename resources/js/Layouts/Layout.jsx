import React from "react";

const Layout = ({ children }) => {
    return (
        <>
            <header>
                <NavBar />
            </header>

            <main className=" h-max md:min-h-screen z-0 bg-cust-white overflow-hidden">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;
