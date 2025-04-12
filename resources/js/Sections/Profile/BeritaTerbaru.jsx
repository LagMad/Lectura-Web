import React from 'react'

const BeritaTerbaru = () => {
    const books = [
        { id: 1, img: 'sample-berita.png' },
        { id: 2, img: 'sample-berita.png' },
        { id: 3, img: 'sample-berita.png' },
        { id: 4, img: 'sample-berita.png' },
        { id: 5, img: 'sample-berita.png' },
    ];

    return (
        <section className='space-y-8 lg:space-y-10'>
            <div className='flex justify-between'>
                <h1 className='font-bold text-2xl lg:text-3xl xl:text-4xl'>Berita Terbaru</h1>
            </div>

            <div className='grid grid-cols-3 md:grid-cols-5 gap-6'>
                {books.map((book) => (
                    <div key={book.id} className='space-y-2'>
                        <div className='w-full bg-blue-300 border-gray-400 border-2 overflow-hidden group'>
                            <img
                                src={book.img}
                                alt={book.title}
                                className='w-full h-full object-cover'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BeritaTerbaru;