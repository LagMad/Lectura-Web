import React from 'react';
import staffOne from "../../../../public/staff-one.jpg";
import staffTwo from "../../../../public/staff-two.jpg";
import staffThree from "../../../../public/staff-three.jpg";
import staffFour from "../../../../public/staff-four.jpg";

const staffData = [
    { image: staffOne, name: "Bu Sulis", },
    { image: staffTwo, name: "Pak Dwi Anang", },
    { image: staffThree, name: "Bu Srinurhayani", },
    { image: staffFour, name: "Bu Widya", },
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
                            <div className='w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4'>
                                <img
                                    src={staff.image}
                                    alt={`Foto ${staff.name}`}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <h3 className='font-semibold text-base sm:text-lg'>{staff.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Staff;