import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Books', href: '#' },
        { name: 'Help', href: '#' },
    ];

    const categories = [
        { value: 'satu', label: 'Satu' },
        { value: 'dua', label: 'Dua' },
    ];

    return (
        <nav className="lg:border-none border-b border-gray-300">
            <div className="container mx-auto py-6 flex flex-col lg:flex-row gap-4 lg:gap-0">
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">LOGO</div>
                    <div className="flex gap-4 font-medium lg:hidden">
                        <button className="px-3 py-2 border rounded hover:bg-gray-100">Sign In</button>
                        <button className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Sign Up</button>
                    </div>
                </div>

                <div className="w-full flex justify-between items-center lg:hidden">
                    <form className="relative flex items-center w-full max-w-md">
                        <Icon icon="mdi:magnify" className="absolute left-4 text-gray-500 text-xl" />
                        <input
                            type="text"
                            placeholder="Cari Produk, Judul Buku, atau Penulis"
                            className="w-full border-2 border-gray-500 px-11 py-2 rounded-full"
                        />
                    </form>
                    <button
                        className="text-2xl ml-4"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                    >
                        <Icon
                            icon={isOpen ? 'mdi:close' : 'mdi:menu'}
                            className={`transform transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                        />
                    </button>
                </div>

                <div
                    className={`transition-all overflow-hidden duration-300 ease-in-out 
            lg:flex lg:flex-row lg:items-center lg:gap-12 lg:ml-auto 
            ${isOpen ? 'flex' : 'hidden lg:flex'}`}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
                        <ul className="flex flex-col lg:flex-row gap-3 ml-1 lg:ml-0 lg:gap-7 text-lg text-cust-gray">
                            {navLinks.map((link, idx) => (
                                <li key={idx}>
                                    <a
                                        href={link.href}
                                        className="hover:font-medium hover:text-cust-light-blue hover:border-t-4"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div>
                            <label htmlFor="kategori" className="sr-only">Kategori</label>
                            <select
                                id="kategori"
                                name="kategori"
                                defaultValue=""
                                className="font-medium text-lg pt-3 lg:pt-0"
                            >
                                <option value="" disabled hidden>Kategori</option>
                                {categories.map((cat, idx) => (
                                    <option key={idx} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <form className="relative items-center w-sm hidden lg:flex">
                        <Icon icon="mdi:magnify" className="absolute left-4 text-gray-500 text-xl" />
                        <input
                            type="text"
                            placeholder="Cari Produk, Judul Buku, atau Penulis"
                            className="w-full border-2 border-gray-500 px-11 py-2 rounded-full"
                        />
                    </form>

                    <div className="hidden lg:flex gap-4 font-medium">
                        <button className="px-4 py-2 border rounded hover:bg-gray-100">Sign In</button>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Sign Up</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;