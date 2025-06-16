import Layout from '@/Layouts/Layout'
import Hero from '@/Sections/Tentang/Hero'
import Iklan from '@/Sections/Tentang/iklan'
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
                {/* <Iklan /> */}
            </div>
        </Layout>
    )
}

export default Tentang
