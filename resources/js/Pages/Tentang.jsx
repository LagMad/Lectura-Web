import Layout from '@/Layouts/Layout'
import Hero from '@/Sections/Tentang/Hero'
import MediaLibrary from '@/Sections/Tentang/MediaLibrary'
import Mitra from '@/Sections/Tentang/Mitra'
import Pelayanan from '@/Sections/Tentang/Pelayanan'
import Staff from '@/Sections/Tentang/Staff'
import React from 'react'

const Tentang = () => {
    return (
        <Layout>
            <div className='pt-20'>
                <Hero />
                <Pelayanan />
                <Staff />
                <MediaLibrary />
                <Mitra />
            </div>
        </Layout>
    )
}

export default Tentang
