import React, { useEffect, useState } from "react";
import Layout from "@/Layouts/Layout";
import Hero from "@/Sections/Bantuan/Hero";
import Layanan from "@/Sections/Bantuan/Layanan";
import Faq from "@/Sections/Bantuan/Faq";

const Bantuan = ({ faqList }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 🔍 filter by query + category
    const filteredFaqList = faqList.filter((faq) => {
        const matchQuery =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

        const matchCategory = selectedCategory
            ? faq.category === selectedCategory
            : true;

        return matchQuery && matchCategory;
    });

    useEffect(() => {
        console.log("faqlist", faqList)
    }, [faqList])

    return (
        <Layout title="Bantuan">
            <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {faqList.length != 0 && (
                <Layanan
                    faqList={faqList}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) =>
                        setSelectedCategory(
                            selectedCategory === cat ? null : cat // toggle off
                        )
                    }
                />
            )}

            <Faq
                faqList={filteredFaqList}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
            />
        </Layout>
    );
};

export default Bantuan;
