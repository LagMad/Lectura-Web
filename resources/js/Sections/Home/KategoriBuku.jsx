import React from "react";
import { Icon } from "@iconify/react";
import { router } from "@inertiajs/react";

const KategoriBuku = ({ books }) => {
    // Function to get random categories from books
    const getRandomCategories = () => {
        // Get unique categories from books
        const uniqueCategories = [
            ...new Set(books.data.map((book) => book.kategori).filter(Boolean)),
        ];

        // Category icons mapping
        const categoryIcons = {
            Teknologi: "fa6-solid:laptop-code",
            Science: "gridicons:science",
            Literatur: "basil:book-solid",
            Bisnis: "lucide:chart-line",
            Sejarah: "mdi:history",
            Sains: "material-symbols:science",
            Agama: "mdi:book-cross",
            Filosofi: "ph:brain-bold",
            Seni: "mdi:palette",
            Kesehatan: "mdi:medical-bag",
            Pendidikan: "mdi:school",
            Ekonomi: "mdi:chart-line",
            Politik: "mdi:government",
            Psikologi: "mdi:brain",
            Sosiologi: "mdi:account-group",
            default: "basil:book-solid",
        };

        // Count books per category
        const categoryCounts = {};
        books.data.forEach((book) => {
            if (book.kategori) {
                categoryCounts[book.kategori] =
                    (categoryCounts[book.kategori] || 0) + 1;
            }
        });

        // Shuffle and take 3 random categories
        const shuffled = uniqueCategories.sort(() => 0.5 - Math.random());
        const randomCategories = shuffled.slice(0, 3);

        // Create category objects with random selection
        const categoryObjects = randomCategories.map((category) => ({
            name: category,
            icon: categoryIcons[category] || categoryIcons.default,
            books: `${categoryCounts[category] || 0} Buku`,
        }));

        // Add "Lain-Lain" as the 4th category
        // categoryObjects.push({
        //     name: "Lain-Lain",
        //     icon: "mdi:dots-horizontal",
        //     books: "Kategori Lain",
        // });

        return categoryObjects;
    };

    const categories = getRandomCategories();

    const handleCategoryClick = (categoryName) => {
        router.visit(route("books.index"), {
            data: { category: categoryName },
            preserveState: true,
            preserveScroll: false,
        });
    };

    return (
        <div className="">
            <h1 className="font-bold text-xl lg:text-2xl mb-6">
                Cari Berdasarkan Kategori
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        onClick={() => handleCategoryClick(cat.name)}
                        className="flex flex-col p-4 bg-white rounded-lg hover:shadow-lg transition cursor-pointer transform hover:scale-105 duration-300 ease-in-out"
                    >
                        <Icon
                            icon={cat.icon}
                            className="text-2xl text-cust-primary-color mb-2"
                        />
                        <h2 className="font-semibold">{cat.name}</h2>
                        <p className="text-gray-500 text-sm">{cat.books}</p>
                    </div>
                ))}
                <a
                    href="/buku"
                    className="flex flex-col p-4 bg-white rounded-lg hover:shadow-lg transition cursor-pointer transform hover:scale-105 duration-300 ease-in-out"
                >
                    <Icon
                        icon={"mdi:dots-horizontal"}
                        className="text-2xl text-cust-primary-color mb-2"
                    />
                    <h2 className="font-semibold">Lain-Lain</h2>
                    <p className="text-gray-500 text-sm">Kategori Lain</p>
                </a>
            </div>
        </div>
    );
};

export default KategoriBuku;
