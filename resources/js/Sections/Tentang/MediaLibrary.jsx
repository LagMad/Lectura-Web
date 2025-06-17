import React from 'react';
import { Icon } from '@iconify/react';

const MediaLibrary = () => {
    const videos = [
        {
            title: "Teknik Membaca untuk Pelajar Muda",
            category: "Pendidikan",
            duration: "15.01",
            views: "2,145 Tontonan"
        },
        {
            title: "Petualangan Puma: Episode 1",
            category: "Pendidikan",
            duration: "15.01",
            views: "2,145 Tontonan"
        },
        {
            title: "Permainan Kosakata Interaktif",
            category: "Pendidikan",
            duration: "15.01",
            views: "2,145 Tontonan"
        },
        {
            title: "Petualangan Puma: Episode 2",
            category: "Sejaran",
            duration: "24.33",
            views: "3,143 Tontonan"
        }
    ];

    return (
        <section className='bg-[#F9FAFB]'>
            <div className='container mx-auto py-20 space-y-10 lg:space-y-6'>
                <h2 className='text-xl text-gray-800'>Media Library - Puma Rymba Channel</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {videos.map((video, index) => (
                        <div key={index} className='rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300'>
                            <div className='relative bg-gray-200 aspect-video flex items-center justify-center'>
                                <div className='w-12 h-12 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors'>
                                    <Icon icon="ph:play-fill" className='text-white text-xl' />
                                </div>
                            </div>
                            <div className='p-4 space-y-2'>
                                <h3 className='font-semibold text-gray-800 leading-tight'>{video.title}</h3>
                                <div className='flex items-center gap-2 text-xs text-gray-500'>
                                    <span>{video.category}</span>
                                    <span>•</span>
                                    <span>{video.duration}</span>
                                </div>
                                <p className='text-xs text-gray-500'>{video.views}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-center'>
                    <button className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200'>
                        Lihat Lebih Banyak
                    </button>
                </div>
            </div>
        </section>
    );
};

export default MediaLibrary;