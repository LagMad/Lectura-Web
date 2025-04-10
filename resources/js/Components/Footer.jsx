import React from 'react';
import { Icon } from '@iconify/react';

const Footer = () => {
    return (
        <footer className='container space-y-10'>
            <div className="mx-auto grid grid-cols-2 md:grid-cols-5 gap-5 lg:gap-8 text-sm lg:text-md text-gray-700">
                <div>
                    <h4 className="text-lg font-bold mb-1 lg:mb-2">LOGO</h4>
                </div>

                <nav aria-label="Main navigation">
                    <h4 className="font-semibold mb-1 lg:mb-2">Explore</h4>
                    <ul className="space-y-1">
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Our Facilities</a></li>
                        <li><a href="#">Activities</a></li>
                        <li><a href="#">Academic Calendar</a></li>
                    </ul>
                </nav>

                <div>
                    <h4 className="font-semibold mb-1 lg:mb-2">Quick Links</h4>
                    <ul className="space-y-1">
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <section>
                    <h4 className="font-semibold mb-1 lg:mb-2">Office Hours</h4>
                    <ul className="space-y-1">
                        <li>Monday - Saturday</li>
                        <li>07.00 - 16.30 WIB</li>
                    </ul>
                </section>

                <blockquote className="space-y-1 lg:relative">
                    <Icon
                        icon="mdi:format-quote-open"
                        className="lg:absolute -top-6 -left-6 text-3xl"
                    />
                    <p className='italic'>“Tidak ada batas untuk ilmu. Bacalah, pelajari, dan kejarlah ilmu itu seperti mengejar cahaya.”</p>
                    <footer className="font-medium">- Ahmad Fuadi, (Negeri 5 Menara)</footer>
                    <Icon
                        icon="mdi:format-quote-close"
                        className="lg:absolute bottom-3 -right-3 text-3xl"
                    />
                </blockquote>
            </div>

            <div className='border-t-2 mx-7 lg:mx-12 border-cust-gray flex flex-col md:flex-row justify-between items-center gap-4 pt-2 text-sm lg:text-md text-gray-600'>
                <p>© 2025 Lectura Tanoto TBK</p>
                <ul className='flex gap-2'>
                    <li>
                        <a href="#" aria-label="Facebook">
                            <Icon icon="mdi:facebook" className="w-6 h-6 hover:text-blue-600 transition" />
                        </a>
                    </li>
                    <li>
                        <a href="#" aria-label="Twitter">
                            <Icon icon="mdi:twitter" className="w-6 h-6 hover:text-sky-500 transition" />
                        </a>
                    </li>
                    <li>
                        <a href="#" aria-label="Instagram">
                            <Icon icon="mdi:instagram" className="w-6 h-6 hover:text-pink-500 transition" />
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;