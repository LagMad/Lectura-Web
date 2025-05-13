import React from "react";

const BukuHomeCard = ({ image, penulis, judul, bookId }) => {
    return (
        <div className="flex flex-col justify-between items-center h-[400px] gap-7 px-6 py-3 rounded-2xl bg-white drop-shadow-lg">
            <div className="flex flex-col justify-center items-center gap-1">
                <img
                    className="w-full h-52 object-contain"
                    src={image}
                    alt="silat"
                />
                <div className="text-cust-dark-gray font-light text-sm w-full">
                    {penulis}
                </div>
                <div className="text-black font-normal text-sm w-full line-clamp-2">
                    {judul}
                </div>
            </div>
            <div className="flex justify-end items-end self-end">
                <a
                    className="cursor-pointer text-white text-base font-normal bg-cust-blue px-5 py-1 rounded-full"
                    href={route("books.show", bookId)}
                >
                    Baca Sekarang
                </a>
            </div>
        </div>
    );
};

export default BukuHomeCard;
