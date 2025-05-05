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
      <div className='flex flex-col gap-16 py-40 bg-cust-background-color'>
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