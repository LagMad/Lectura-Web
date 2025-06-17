import React from 'react';
import MitraImage from "../../../../public/mitra.webp";

const Mitra = () => {
    return (
        <section>
            <div className='container mx-auto py-20 space-y-10 lg:space-y-6'>
                <div className='text-center mb-12'>
                    <h1 className='font-bold text-3xl'>Mitra Kami</h1>
                </div>
                <div className='flex justify-center'>
                    <img
                        src={MitraImage}
                        alt="Mitra Kami"
                        className='w-2/3'
                    />
                </div>
            </div>
        </section>
    );
};

export default Mitra;