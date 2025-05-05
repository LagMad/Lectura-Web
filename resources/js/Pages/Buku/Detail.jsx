import React from 'react'
import Layout from '@/Layouts/Layout'
import { Star, StarHalf, StarOff } from 'lucide-react'

const Detail = () => {

    return (
        <Layout>
            <section className="bg-cust-background-color pt-20">
                <div className="container py-20 flex flex-wrap justify-center gap-10">
                    <div className="bg-white flex flex-col items-center p-8 rounded-lg w-full md:w-1/3 space-y-4">
                        <img
                            src="/laut-bercerita.png"
                            alt="Cover Buku"
                            className="rounded-lg w-40 lg:w-64 object-cover"
                        />
                        <button className="font-semibold text-sm rounded-lg hover:scale-105 transition-all py-2 w-40 lg:w-64 bg-cust-primary-color border-2 border-cust-primary-color text-white">
                            Baca Sekarang
                        </button>
                        <button className="border-2 border-cust-primary-color text-cust-primary-color font-semibold text-sm rounded-lg hover:scale-105 transition-all py-2 w-40 lg:w-64">
                            Tambah ke Favorite
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-lg w-full md:w-1/2">
                        <h2 className="text-2xl font-bold text-cust-primary-color mb-1">Tokyo for Revenge RE: 09</h2>
                        <p className="text-gray-600 mb-4">Oleh Masashi Masako</p>

                        <div className="flex items-center gap-2 mb-6">
                            {[...Array(4)].map((_, i) => (
                                <Star key={i} size={20} fill="#facc15" stroke="#facc15" />
                            ))}
                            <Star size={20} stroke="#facc15" />
                            <span className="ml-2 text-sm text-gray-700">4.0</span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 w-2/3 text-sm mb-8">
                            <p>Penerbit</p><p>Lectura</p>
                            <p>Tahun Terbit</p><p>2025</p>
                            <p>Bahasa</p><p>Indonesia</p>
                            <p>Halaman</p><p>999</p>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                        <p className="text-gray-700 text-justify mb-4">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
                            pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
                            aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
                            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class
                            aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                        </p>
                        <p className="text-gray-700 text-justify mb-6">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
                            pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
                            aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
                            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class
                            aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                        </p>

                        <h3 className="text-lg font-semibold mb-2">Kategori</h3>
                        <div className="flex gap-2 flex-wrap">
                            {['Sains', 'Fiksi', 'Petualangan'].map((kategori) => (
                                <span
                                    key={kategori}
                                    className="bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1 rounded-full"
                                >
                                    {kategori}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='container pt-10 pb-20'>
                    <div className='container space-y-5'>
                        <h1 className='font-semibold text-2xl'>Buku yang Mirip</h1>
                        <div className='flex gap-5 overflow-x-auto pb-2'>
                            {Array(6).fill(0).map((_, i) => (
                                <div
                                    key={i}
                                    className='min-w-[160px] bg-white rounded-lg shadow hover:shadow-md transition-all'
                                >
                                    <img
                                        src='mie-ayam.png'
                                        alt='Ayo Berlatih Silat'
                                        className='rounded-t-lg w-full object-cover h-56 p-3'
                                    />
                                    <div className='p-3'>
                                        <p className='text-xs text-gray-600 mb-1'>A. Fuadi</p>
                                        <p className='text-sm font-medium line-clamp-2'>
                                            Ayo Berlatih Silat. Let’s Practice Silat
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Detail