import React from 'react'
import Layout from '../Layouts/Layout'
import BukuMinggu from '../Sections/Home/BukuMinggu'
import BukuPekan from '../Sections/Home/BukuPekan'
import BukuSemester from '../Sections/Home/BukuSemester'

const Home = () => {
  return (
    <div className='flex flex-col gap-36 py-24'>
      <BukuMinggu/>
      <BukuPekan/>
      <BukuSemester/>
    </div>
  )
}

export default Home