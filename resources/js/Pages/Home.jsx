import React from 'react'
import Layout from '../Layouts/Layout'
import BukuMinggu from '../Sections/Home/BukuMinggu'
import BukuPekan from '../Sections/Home/BukuPekan'
import BukuSemester from '../Sections/Home/BukuSemester'
import HeroSection from '../Sections/Home/HeroSection'
import SloganSection from '../Sections/Home/SloganSection'

const Home = () => {
  return (
    <div className='flex flex-col gap-16 py-20 bg-cust-light-gray'>
      <HeroSection />
      <SloganSection />
      <BukuMinggu />
      <BukuPekan />
      <BukuSemester />
    </div>
  )
}

export default Home