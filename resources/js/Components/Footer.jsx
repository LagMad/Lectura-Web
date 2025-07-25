import React from "react";
import { Icon } from "@iconify/react";

const Footer = () => {
    return (
        <footer className="bg-cust-secondary-color text-white pt-10 pb-20">
            <div className="container mx-auto">
                <div className="flex flex-col xl:flex-row justify-between items-center gap-8">
                    <a href="/">
                        <img
                            src={"/Logo-lectura-full-transparent-white.svg"}
                            className="w-auto h-40"
                        />
                    </a>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-20">
                        <div className="gap-8">
                            <div className="grid grid-cols-2 md:grid-cols-1 text-sm text-gray-300 gap-5">
                                <a className="text-center md:text-left hover:underline underline-offset-4 text-white hover:text-cust-primary-color transition-all duration-300 ease-in-out cursor-pointer">
                                    Beranda
                                </a>

                                <a className="text-center md:text-left hover:underline underline-offset-4 text-white hover:text-cust-primary-color transition-all duration-300 ease-in-out cursor-pointer">
                                    Buku
                                </a>

                                <a className="text-center md:text-left hover:underline underline-offset-4 text-white hover:text-cust-primary-color transition-all duration-300 ease-in-out cursor-pointer">
                                    Bantuan
                                </a>

                                <a className="text-center md:text-left hover:underline underline-offset-4 text-white hover:text-cust-primary-color transition-all duration-300 ease-in-out cursor-pointer">
                                    Tentang
                                </a>
                            </div>
                        </div>
                        <div className="flex flex-col italic text-sm text-gray-300 relative max-w-md">
                            <Icon
                                icon="mdi:format-quote-open"
                                className="text-xl mb-2"
                            />
                            Tidak ada batas untuk ilmu. Bacalah, pelajari, dan
                            kejarlah ilmu itu seperti mengejar cahaya
                            <br />
                            <span className="block mt-2 text-xs font-light">
                                - Ahmad Fausdi (Negeri 5 Menara)
                            </span>
                            <Icon
                                icon="mdi:format-quote-close"
                                className="text-xl mt-2 self-end float-right"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-600 mt-10 pt-4">
                    <div className="flex flex-col md:flex-row items-center justify-center text-sm text-white gap-4">
                        <p className="text-center md:text-center group">
                            Made with ❤️ by{" "}
                            <a
                                href="https://www.instagram.com/lectura_edu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-cust-primary-color transition-all ease-in-out duration-300 underline underline-offset-4"
                            >
                                Lectura
                            </a>{" "}
                            from{" "}
                            <a
                                href="https://www.instagram.com/tanotoeducation/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-cust-primary-color transition-all ease-in-out duration-300 underline underline-offset-4"
                            >
                                Tanoto Foundation.
                            </a>
                        </p>
                        {/* <div className="flex gap-4">
                            <Icon
                                icon="uil:facebook"
                                className="text-xl hover:text-white"
                            />
                            <Icon
                                icon="fa6-brands:square-x-twitter"
                                className="text-xl hover:text-white"
                            />
                            <Icon
                                icon="ri:instagram-fill"
                                className="text-xl hover:text-white"
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
