import React from 'react';

const staffData = [
    { name: "Johnson", role: "CEO & Founder" },
    { name: "Hilda", role: "CTO" },
    { name: "Zilong", role: "CTO" },
    { name: "Franco", role: "CFO" },
];

const Staff = () => {
    return (
        <section className='py-12'>
            <div className='container mx-auto space-y-10'>
                <div className='text-center'>
                    <h1 className='font-bold text-2xl sm:text-3xl lg:text-4xl'>Bertemu dengan Staff Kami</h1>
                    <p className='text-sm sm:text-base lg:text-lg mt-2 text-cust-dark-gray'>
                        Tim perpustakaan khusus Anda siap membantu
                    </p>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center'>
                    {staffData.map((staff, index) => (
                        <div key={index} className='flex flex-col items-center hover:scale-105 transition-all ease-in-out'>
                            <div className='w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-300 mb-4'></div>
                            <h3 className='font-semibold text-base sm:text-lg'>{staff.name}</h3>
                            <p className='text-gray-500 text-sm'>{staff.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Staff;