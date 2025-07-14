import React from "react";
import { Icon } from '@iconify/react';

const KategoriBuku = () => {
    const categories = [
        {
            name: "Teknologi",
            icon: "fa6-solid:laptop-code",
            books: "150+ Buku",
        },
        {
            name: "Science",
            icon: "gridicons:science",
            books: "200+ Buku",
        },
        {
            name: "Literatur",
            icon: "basil:book-solid",
            books: "300+ Buku",
        },
        {
            name: "Bisnis",
            icon: "lucide:chart-line",
            books: "180+ Buku",
        },
    ];
    return (
        <div className="">
            <h1 className="font-bold text-xl lg:text-2xl mb-6">
                Cari Berdasarkan Kategori
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        className="flex flex-col p-4 bg-white rounded-lg hover:shadow-lg transition"
                    >
                        <Icon
                            icon={cat.icon}
                            className="text-2xl text-cust-primary-color"
                        />
                        <h2 className="font-semibold">{cat.name}</h2>
                        <p className="text-gray-500 text-sm">{cat.books}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KategoriBuku;
