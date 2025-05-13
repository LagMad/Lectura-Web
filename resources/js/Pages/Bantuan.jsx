import React, { useState } from 'react';
import Layout from '@/Layouts/Layout';
import Hero from '@/Sections/Bantuan/Hero';
import Layanan from '@/Sections/Bantuan/Layanan';
import Faq from '@/Sections/Bantuan/Faq';

const Bantuan = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <Layout>
            <div className='py-20'>
                <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <Layanan onSelectCategory={(category) => setSelectedCategory(category)} />
                <Faq searchQuery={searchQuery} selectedCategory={selectedCategory} />
            </div>
        </Layout>
    );
};

export default Bantuan;