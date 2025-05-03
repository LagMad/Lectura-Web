import React from 'react'
import { Icon } from '@iconify/react';

const Pelayanan = () => {
    const pelayanan = [
        {
            title: 'Dukungan Penelitian',
            icon: 'famicons:book',
            desc: 'Panduan ahli untuk proyek dan makalah penelitian Anda.',
        },
        {
            title: 'Sumber Daya Digital',
            icon: 'gridicons:phone',
            desc: 'Akses ke basis data online dan e-book yang luas.',
        },
        {
            title: 'Ruang Belajar',
            icon: 'hugeicons:study-desk',
            desc: 'Area studi individu dan kelompok yang nyaman.',
        },
    ];

    return (
        <section className='bg-[#F9FAFB] py-12'>
            <div className='container mx-auto'>
                <div className='text-center mb-12'>
                    <h1 className='font-bold text-3xl'>Pelayanan Kami</h1>
                    <p className='text-sm sm:text-base lg:text-lg mt-2 text-cust-dark-gray'>
                        Mendukung kesuksesan akademik Anda melalui berbagai layanan perpustakaan
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {pelayanan.map((cat, index) => (
                        <div key={index} className="flex flex-col items-start gap-2 p-6 sm:p-8 bg-white rounded-xl hover:shadow-lg transition">
                            <Icon icon={cat.icon} className="text-3xl lg:text-4xl text-cust-primary-color mb-2" />
                            <h2 className="font-semibold text-base sm:text-lg">{cat.title}</h2>
                            <p className="text-gray-500 text-sm sm:text-base">{cat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pelayanan;