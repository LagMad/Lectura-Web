import React from 'react';

const HeroSection = () => {
    const smallImages = [
        { src: 'laut-bercerita.png', alt: 'Berita Kecil 1' },
        { src: 'mie-ayam.png', alt: 'Berita Kecil 2' },
    ];

    const categories = [
        { src: 'buku-andalan.webp', label: 'Buku Andalan' },
        { src: 'buku-international.webp', label: 'Buku International' },
        { src: 'buku-digital.webp', label: 'Buku Digital' },
        { src: 'olahraga.webp', label: 'Olahraga' },
    ];

    return (
        <section className="container mx-auto space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 container">
                <div className="md:col-span-2">
                    <div className="h-64 sm:h-80 md:h-96 bg-purple-200 rounded-3xl shadow-md overflow-hidden group">
                        <img
                            src="boy-reading.png"
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center text-center container">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-2 group cursor-pointer transition duration-300 hover:opacity-90"
                    >
                        <img
                            src={category.src}
                            alt={category.label}
                            className="w-2/3 sm:w-3/4 md:w-2/3 transition-transform duration-300 group-hover:scale-105"
                        />
                        <p className="text-sm sm:text-base transition-colors duration-300 group-hover:text-purple-600">
                            {category.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HeroSection;