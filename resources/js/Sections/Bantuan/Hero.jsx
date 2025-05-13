import React from 'react'
import { Icon } from '@iconify/react'

const Hero = ({ searchQuery, setSearchQuery }) => {
    return (
        <section className='bg-cust-tertiary-color container'>
            <div className='container mx-auto py-20 lg:py-28'>
                <div className='text-center'>
                    <h1 className='font-bold text-4xl'>Frequently Asked Questions</h1>
                    <p className='font-lg mt-2'>Temukan Jawaban dari Pertanyaan Umum mengenai pelayanan dan sumber daya Perpustakaan Ini</p>
                </div>
                <div className='mt-10 bg-white py-4 px-8 font-medium rounded-xl shadow-md flex justify-between'>
                    <input
                        type="text"
                        placeholder='Cari Pertanyaanmu...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full focus:outline-none focus:ring-0'
                    />
                    <Icon icon="mynaui:search" className="text-xl text-cust-gray" />
                </div>
            </div>
        </section>
    );
}

export default Hero
