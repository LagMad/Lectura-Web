import Layout from '@/Layouts/Layout'
import Hero from '@/Sections/Bantuan/Hero'
import Layanan from '@/Sections/Bantuan/Layanan'
import Faq from '@/Sections/Bantuan/Faq'
import React from 'react'

const Bantuan = () => {
    return (
        <Layout>
            <div className='py-20'>
                <Hero />
                <Layanan />
                <Faq />
            </div>
        </Layout>
    )
}

export default Bantuan
