import React from 'react'
import HeroImage from "../../../../public/hero-profile.webp"
import Button from '@/Components/Button'

const stats = [
    { value: '25+', label: 'Staff Perpustakaan' },
    { value: '2K+', label: 'Koleksi Buku' },
    { value: '24/7', label: 'Akses Daring' },
    { value: '100%', label: 'Database Penelitian' },
]

const Hero = () => {
    return (
        <section>
            <div
                className='relative bg-cover bg-center min-h-screen flex items-center'
                style={{ backgroundImage: `url(${HeroImage})` }}
            >
                <div className='absolute inset-0 bg-cust-tertiary-color/80'></div>

                <div className='relative z-10 container mx-auto flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-0'>
                    <div className='w-full lg:w-3/5 space-y-4 text-center lg:text-left'>
                        <h1 className='font-bold text-3xl lg:text-4xl'>
                            Bertemu dengan Tim Perpustakaan
                        </h1>
                        <p className='text-sm sm:text-base lg:text-lg'>
                            Profesional yang berdedikasi berkomitmen untuk mendukung perjalanan akademik dan kebutuhan penelitian Anda.
                        </p>
                        <div className='flex flex-row justify-center lg:justify-start gap-3 mt-6'>
                            <Button variant='filled'>Mulai Perjalanan</Button>
                            <Button variant='tertiary'>Jam Perpustakaan</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container mx-auto py-20'>
                <div className='flex flex-wrap justify-between text-center gap-y-10'>
                    {stats.map((item, index) => (
                        <div key={index} className='w-1/2 md:w-auto'>
                            <h1 className='text-cust-blue font-bold text-2xl lg:text-4xl'>{item.value}</h1>
                            <p className='text-cust-dark-gray font-medium mt-2'>{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Hero