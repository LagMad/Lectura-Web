import React from 'react'

const HeroSection = () => {
  return (
    <section className='space-y-16 lg:space-y-24'>
      <div>
        <img src="hero.webp" alt="" />
      </div>
      <div className='space-y-8 lg:space-y-10'>
        <h1 className='text-center font-bold text-2xl lg:text-3xl xl:text-4xl'>Pengumuman</h1>
        <div className='h-60 sm:h-80 md:h-96 rounded-3xl shadow-md overflow-hidden group'>
          <img
            src="sample_pengumuman.webp"
            alt="announcement"
            className='w-full h-full object-cover' />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
