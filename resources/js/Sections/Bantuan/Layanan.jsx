import React from 'react';
import { Icon } from '@iconify/react';

const layananList = [
    { icon: 'famicons:book', title: 'Layanan Perpustakaan', count: 12 },
    { icon: 'typcn:device-laptop', title: 'Sumber Daya Digital', count: 6 },
    { icon: 'pepicons-pencil:people', title: 'Ruang Belajar', count: 26 },
    { icon: 'solar:danger-circle-bold', title: 'Informasi Umum', count: 10 },
];

const Layanan = () => {
    return (
        <section>
            <div className="container mx-auto py-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 text-center gap-5">
                    {layananList.map((layanan, index) => (
                        <div key={index} className="bg-cust-light-blue p-4 lg:p-8 rounded-xl">
                            <div className="flex items-center justify-center mb-2">
                                <Icon icon={layanan.icon} className="text-xl lg:text-3xl text-cust-blue" />
                            </div>
                            <p className="font-medium text-sm lg:text-lg">{layanan.title}</p>
                            <p className="text-cust-dark-gray text-xs lg:text-base">{layanan.count} Pertanyaan</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Layanan;