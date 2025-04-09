import React from "react";

const Layout = ({ children }) => {
    return (
        <>
            <header>
                {/* <NavBar /> */}
            </header>

            <main>
                {children}
            </main>
            {/* <Footer /> */}
        </>
    );
};

export default Layout;
