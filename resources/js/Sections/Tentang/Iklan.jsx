import React from 'react';
import { Icon } from '@iconify/react';

const contactInfo = [
    {
        icon: 'uil:facebook',
        text: '+1234567890',
    },
    {
        icon: 'fa6-brands:square-x-twitter',
        text: 'blablabla@gmail.com',
    },
    {
        icon: 'ri:instagram-fill',
        text: 'Jl. Ambarawa Gg. II No. 18B',
    },
];

const Iklan = () => {
    return (
        <section className='bg-[#F9FAFB]'>
            <div className='container mx-auto py-20 px-4 space-y-10 lg:space-y-16'>
                <div className='text-center'>
                    <h1 className='font-bold text-2xl sm:text-3xl lg:text-4xl'>Tertarik dengan Website kami?</h1>
                    <p className='text-sm sm:text-base lg:text-lg mt-2 text-cust-dark-gray'>
                        Kami di sini untuk membantu kebutuhan Website anda
                    </p>
                </div>

                <div className='flex flex-col sm:flex-row justify-center items-center gap-10 lg:gap-20 text-center'>
                    {contactInfo.map((item, index) => (
                        <div key={index} className='flex flex-col items-center'>
                            <Icon icon={item.icon} className='text-xl sm:text-2xl text-black mb-2' />
                            <p className='text-sm sm:text-base'>{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Iklan;