import React, { useState } from 'react';
import Button from './Button';
import { Icon } from '@iconify/react';
import { usePage } from '@inertiajs/react';

const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Buku', href: '/buku' },
    { name: 'Bantuan', href: '/bantuan' },
    { name: 'Tentang', href: '/tentang' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { url } = usePage();

    return (
        <nav className="bg-white fixed w-full z-50 shadow-sm">
            <div className="container mx-auto py-6 flex justify-between items-center">
                <div className="flex items-center gap-5 xl:gap-10">
                    <h1 className="font-bold text-cust-blue text-2xl xl:text-3xl">E-Library</h1>
                    <ul className="hidden lg:flex font-medium gap-3 xl:gap-6">
                        {navLinks.map((link, idx) => (
                            <li key={idx}>
                                <a
                                    href={link.href}
                                    className={`transition-colors duration-200 hover:text-cust-primary-color ${url === link.href ? 'text-cust-primary-color font-semibold' : 'text-gray-700'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="items-center flex gap-4 w-1/2 justify-end">
                    <div className="relative w-full max-w-xs lg:w-1/3 xl:w-full xl:max-w-xs">
                        <input
                            type="text"
                            placeholder="Cari buku..."
                            className="w-full border border-gray-400 rounded-lg py-2 px-4 pr-10 text-sm placeholder-gray-500"
                        />
                        <Icon icon="mdi:magnify" className="absolute right-3 top-2.5 text-gray-500 text-lg" />
                    </div>
                    <div className='hidden lg:flex gap-4'>
                        <Button>Sign In</Button>
                        <Button variant="filled">Sign Up</Button>
                    </div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden text-2xl text-gray-700"
                    >
                        <Icon icon={isOpen ? 'mdi:close' : 'mdi:menu'} />
                    </button>
                </div>

            </div>

            <div
                className={`lg:hidden container overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen py-4' : 'max-h-0'
                    }`}
            >
                <ul className="flex flex-col gap-4">
                    {navLinks.map((link, idx) => (
                        <li key={idx}>
                            <a
                                href={link.href}
                                className={`block text-center font-medium rounded transition-colors duration-200 ${url === link.href ? 'text-cust-primary-color font-semibold' : 'text-gray-700'
                                    }`}
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="mt-4">
                    <div className="flex flex-col gap-2">
                        <Button>Sign In</Button>
                        <Button variant="filled">Sign Up</Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;