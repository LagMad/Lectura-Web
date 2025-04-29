import React from 'react'
import Layout from '../Layouts/Layout'
import BukuMinggu from '../Sections/Home/BukuMinggu'
import BukuPekan from '../Sections/Home/BukuPekan'
import BukuSemester from '../Sections/Home/BukuSemester'
import HeroSection from '../Sections/Home/HeroSection'
import SloganSection from '../Sections/Home/SloganSection'

const Home = () => {
  return (
    <Layout>
      <div className='py-40 bg-cust-light-blue space-y-16 lg:space-y-24'>
        <HeroSection />
        <SloganSection />
        <BukuMinggu />
        <BukuPekan />
        <BukuSemester />
      </div>
    </Layout>
  )
}

export default Home