import React from 'react'
import HeroSection from "../Sections/Profile/HeroSection.jsx";
import KoleksiTerbaru from '../Sections/Profile/KoleksiTerbaru.jsx';
import BeritaTerbaru from '../Sections/Profile/BeritaTerbaru.jsx';
import PetugasPerpustakaan from '../Sections/Profile/PetugasPerpustakaan.jsx';

const Profile = () => {
    return (
        <div className='container py-10 space-y-20'>
            <HeroSection />
            <div className='container space-y-20'>
                <KoleksiTerbaru />
                <BeritaTerbaru />
                <PetugasPerpustakaan />
            </div>
        </div>
    )
}

export default Profile
