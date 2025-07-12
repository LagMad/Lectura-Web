import React, { useMemo } from "react";
import { Icon } from "@iconify/react";

/*  Map each category label to an icon you like  */
const iconMap = {
    "Layanan Perpustakaan": "famicons:book",
    "Sumber Daya Digital":  "typcn:device-laptop",
    "Ruang Belajar":        "pepicons-pencil:people",
    "Informasi Umum":       "solar:danger-circle-bold",
    "Lain-Lain": "mdi:help-circle-outline"
};

const Layanan = ({ faqList, selectedCategory, onSelectCategory }) => {
    /* -----------------------------------------------------------
     * Build [{title, icon, count}] from faq.category
     * ----------------------------------------------------------- */
    const layananList = useMemo(() => {
        const counts = {};
        faqList.forEach((faq) => {
            const cat = faq.category || "Lain‑lain";
            counts[cat] = (counts[cat] || 0) + 1;
        });

        return Object.entries(counts).map(([title, count]) => ({
            title,
            count,
            icon: iconMap[title] || "ph:question-bold",
        }));
    }, [faqList]);

    return (
        <section>
            <div className="container mx-auto py-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 text-center gap-5">
                    {layananList.map((item) => {
                        const active = selectedCategory === item.title;
                        return (
                            <div
                                key={item.title}
                                onClick={() => onSelectCategory(item.title)}
                                className={`p-4 lg:p-8 rounded-xl cursor-pointer transition
                                    ${active
                                        ? "bg-cust-blue text-white shadow-lg"
                                        : "bg-cust-light-blue hover:shadow-lg"
                                    }`}
                            >
                                <div className="flex items-center justify-center mb-2">
                                    <Icon
                                        icon={item.icon}
                                        className={`text-xl lg:text-3xl ${
                                            active
                                                ? "text-white"
                                                : "text-cust-blue"
                                        }`}
                                    />
                                </div>
                                <p className="font-medium text-sm lg:text-lg">
                                    {item.title}
                                </p>
                                <p className="text-xs lg:text-base opacity-80">
                                    {item.count} Pertanyaan
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Layanan;
