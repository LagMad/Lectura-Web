import React from 'react';
import { Icon } from '@iconify/react';

const HeroSection = () => {
    const smallImages = [
        { src: 'hero-2.jpg', alt: 'Berita Kecil 1' },
        { src: 'hero-3.jpg', alt: 'Berita Kecil 2' },
    ];

    const categories = [
        {
            name: 'Teknologi',
            icon: 'fa6-solid:laptop-code',
            books: '150+ Buku',
        },
        {
            name: 'Science',
            icon: 'gridicons:science',
            books: '200+ Buku',
        },
        {
            name: 'Literatur',
            icon: 'basil:book-solid',
            books: '300+ Buku',
        },
        {
            name: 'Bisnis',
            icon: 'lucide:chart-line',
            books: '180+ Buku',
        },
    ];

    return (
        <section className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <div className="h-64 sm:h-80 md:h-96 bg-purple-200 rounded-3xl shadow-md overflow-hidden group">
                        <img
                            src="hero-1.jpg"
                            alt="Berita Besar"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {smallImages.map((img, index) => (
                        <div key={index} className="h-32 sm:h-36 md:h-40 bg-purple-100 rounded-3xl shadow-md overflow-hidden group">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className=''>
                <h1 className='font-bold text-xl lg:text-2xl mb-6'>Cari Berdasarkan Kategori</h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <div key={index} className="flex flex-col p-4 bg-white rounded-lg hover:shadow-lg transition">
                            <Icon icon={cat.icon} className="text-2xl text-cust-primary-color" />
                            <h2 className="font-semibold">{cat.name}</h2>
                            <p className="text-gray-500 text-sm">{cat.books}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;