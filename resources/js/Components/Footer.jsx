import React from 'react';
import { Icon } from '@iconify/react';

const Footer = () => {
    return (
        <footer className="bg-cust-secondary-color text-white py-20">
            <div className="container mx-auto">
                <div className="flex flex-col xl:flex-row justify-between gap-8">
                    <div>
                        <h1 className="font-bold text-2xl xl:text-3xl mb-4">E- Library</h1>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h2 className="font-semibold mb-2">Explore</h2>
                            <ul className="space-y-1 text-sm text-gray-300">
                                <li>About Us</li>
                                <li>Our Facilities</li>
                                <li>Activities</li>
                                <li>Academic Calendar</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-semibold mb-2">Quick Links</h2>
                            <ul className="text-sm text-gray-300 mb-4">
                                <li>Contact Us</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-semibold mb-2">Office Hours</h2>
                            <p className="text-sm text-gray-300">
                                Monday - Saturday<br />
                                07.00 - 16.30 WIB
                            </p>
                        </div>
                    </div>

                    <div className="italic text-sm text-gray-300 relative max-w-md">
                        <Icon icon="mdi:format-quote-open" className="text-xl mb-2" />
                        Tidak ada batas untuk ilmu. Bacalah, pelajari, dan kejarlah ilmu itu seperti mengejar cahaya
                        <br />
                        <span className="block mt-2 text-xs font-light">- Ahmad Fausdi (Negeri 5 Menara)</span>
                        <Icon icon="mdi:format-quote-close" className="text-xl mt-2 self-end float-right" />
                    </div>
                </div>

                <div className="border-t border-gray-600 mt-10 pt-4">
                    <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-white gap-4">
                        <p className="text-center md:text-left">© 2025 Lectura Tanoto TBK. All Rights Reserved.</p>
                        <div className="flex gap-4">
                            <Icon icon="uil:facebook" className="text-xl hover:text-white" />
                            <Icon icon="fa6-brands:square-x-twitter" className="text-xl hover:text-white" />
                            <Icon icon="ri:instagram-fill" className="text-xl hover:text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;