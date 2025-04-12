import React from 'react'

const PetugasPerpustakaan = () => {
    const books = [
        { id: 1, name: 'Joko Anwar', job: 'Kepala Perpustakaan', img: 'over_the_sirens.png' },
        { id: 2, name: 'Sisca Kohl', job: 'Bendahara Perpustakaan', img: 'over_the_sirens.png' },
        { id: 3, name: 'Sheninna', job: 'Sekretaris Perpustakaan', img: 'over_the_sirens.png' },
        { id: 4, name: 'Christoper Nolan', job: 'Operator IT', img: 'over_the_sirens.png' },
    ];

    return (
        <section className='space-y-8 lg:space-y-10'>
            <h1 className='font-bold text-2xl lg:text-3xl xl:text-4xl text-center'>Petugas Perpustakaan</h1>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                {books.map((book) => (
                    <div key={book.id} className='space-y-2'>
                        {book.id % 2 === 0 && (
                            <div className='text-center'>
                                <h1 className='font-bold lg:text-lg'>{book.name}</h1>
                                <p>{book.job}</p>
                            </div>
                        )}

                        <div className='h-52 sm:h-60 lg:h-72 xl:h-80 w-full bg-blue-300 rounded-3xl overflow-hidden group'>
                            <img
                                src={book.img}
                                alt={book.name}
                                className='w-full h-full object-cover'
                            />
                        </div>

                        {book.id % 2 !== 0 && (
                            <div className='text-center'>
                                <h1 className='font-bold lg:text-lg'>{book.name}</h1>
                                <p>{book.job}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PetugasPerpustakaan;