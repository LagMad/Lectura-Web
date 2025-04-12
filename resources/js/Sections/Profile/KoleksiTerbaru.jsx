import React from 'react'

const KoleksiTerbaru = () => {
    const books = [
        { id: 1, title: 'Over The Sirens', author: 'Sheila On 7', img: 'over_the_sirens.png' },
        { id: 2, title: 'Into the Blue', author: 'John Smith', img: 'over_the_sirens.png' },
        { id: 3, title: 'The Lost Melody', author: 'Anna Lee', img: 'over_the_sirens.png' },
        { id: 4, title: 'Shadows of Time', author: 'Michael Chen', img: 'over_the_sirens.png' },
    ];

    return (
        <section className='space-y-8 lg:space-y-10'>
            <div className='flex justify-between'>
                <h1 className='font-bold text-2xl lg:text-3xl xl:text-4xl'>Koleksi Terbaru</h1>
                <button className='bg-blue-100 text-blue-500 font-bold px-7 py-1 rounded-lg'>See all</button>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                {books.map((book) => (
                    <div key={book.id} className='space-y-2'>
                        <div className='h-52 sm:h-60 lg:h-72 xl:h-80 w-full bg-blue-300 rounded-3xl overflow-hidden group'>
                            <img
                                src={book.img}
                                alt={book.title}
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <h1 className='font-bold lg:text-lg'>{book.title}</h1>
                        <p className='font-light'>{book.author}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default KoleksiTerbaru;