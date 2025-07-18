import React from "react";
import { Star } from "lucide-react";

const BukuHomeCard = ({ index, image, penulis, judul, bookId, rating }) => {
    return (
        <div className="relative flex flex-col justify-between items-center min-h-[400px] gap-1 rounded-2xl drop-shadow-lg bg-white">
            <div className="flex flex-col justify-between items-center w-full">
                <div className="flex flex-row justify-center items-center w-full">
                    <div className="flex flex-row justify-center items-center text-sm gap-2 px-4 py-2 min-w-16 rounded-b-2xl bg-cust-primary-color text-white text-center">
                        {parseFloat(rating).toFixed(1)}
                        <Star size={20} fill="#facc15" stroke="#facc15" />
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center p-3 gap-1 w-full">
                    <img
                        className="w-full h-52 object-contain"
                        src={image}
                        alt={judul}
                    />
                    <div className="text-cust-dark-gray font-light text-sm w-full">
                        {penulis}
                    </div>
                    <div className="text-black font-normal text-sm w-full line-clamp-2">
                        {judul}
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-between items-center p-3 w-full">
                <div className="flex flex-col justify-end items-center self-end gap-3 w-full">
                    <a
                        className="cursor-pointer text-white text-sm font-normal bg-cust-blue px-5 py-1 rounded-full w-full text-center hover:brightness-125 transition-all duration-300 ease-in-out"
                        href={route("books.show", bookId)}
                    >
                        Baca Sekarang
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BukuHomeCard;
