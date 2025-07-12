import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Icon } from "@iconify/react";
import Button from "@/Components/Button";
import { useForm } from "@inertiajs/inertia-react";

const Faq = ({ searchQuery = "", selectedCategory = "", faqList = [] }) => {
    const [showAll, setShowAll] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: "",
        nipd: "",
        pertanyaan: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("faq.store"), {
            onSuccess: () => {
                reset();
                alert("Pertanyaan berhasil dikirim!");
            },
            onError: (error) => {
                console.error("Form submission errors: ", errors);
                alert("Pertanyaan gagal dikirim ;(");
            },
        });
    };

    useEffect(() => {
        console.log("faqList", faqList);
    }, [faqList]);

    const visibleFaqs = showAll ? faqList : faqList.slice(0, 5);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <section>
            <div className="bg-[#F9FAFB] container">
                <div className="container mx-auto py-20">
                    <div className="space-y-4 container">
                        {faqList.length > 0 ? (
                            <>
                                {visibleFaqs.map((faq, idx) => (
                                    <Disclosure
                                        key={idx}
                                        defaultOpen={idx === 0}
                                    >
                                        {({ open }) => (
                                            <div className="bg-white rounded-xl cursor-pointer shadow-lg">
                                                <Disclosure.Button className="flex justify-between items-center w-full p-6 font-semibold text-left text-sm md:text-base lg:text-lg text-gray-900 cursor-pointer">
                                                    <span>{faq.question} <span className="text-xs text-gray-300"> - {faq.category}</span></span>
                                                    <span className="text-xl bg-gradient-to-l from-[#CACED8] to-[#2563EB] bg-clip-text text-transparent">
                                                        <Icon
                                                            icon="iconamoon:arrow-down-2"
                                                            className={`transition-transform text-cust-blue duration-200 ${
                                                                open
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </span>
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="rounded-b-xl p-6 text-xs md:text-sm lg:text-base text-gray-600 bg-cust-light-blue">
                                                    {faq.answer}
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>
                                ))}
                                {faqList.length > 5 && (
                                    <div className="text-end  pt-4">
                                        <button
                                            onClick={toggleShowAll}
                                            className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                                        >
                                            {showAll
                                                ? "Lihat lebih sedikit"
                                                : "Lihat semua pertanyaan"}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-gray-500">
                                Pertanyaan tidak ditemukan.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-14">
                <div className="container space-y-10">
                    <div className="text-center">
                        <h1 className="font-bold text-xl lg:text-4xl">
                            Masih Memiliki Pertanyaan?
                        </h1>
                        <p className="text-sm lg:font-lg mt-2">
                            Tidak dapat menemukan apa yang Anda cari? Kantor
                            Perpustakaan kami di sini untuk membantu
                        </p>
                    </div>

                    <form
                        className="max-w-xl mx-auto space-y-4"
                        onSubmit={handleSubmit}
                    >
                        <div className="space-y-1">
                            <div className="flex items-center border rounded-lg px-4 py-2 gap-2">
                                <Icon
                                    icon="ix:user-profile-filled"
                                    className="text-cust-dark-gray text-xl"
                                />
                                <input
                                    type="text"
                                    name="nama"
                                    placeholder="Nama kalian"
                                    className="w-full outline-none"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    disabled={processing}
                                    required
                                />
                            </div>
                            {errors.nama && (
                                <p className="text-red-500 text-sm">
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center border rounded-lg px-4 py-2 gap-2">
                                <Icon
                                    icon="la:id-card"
                                    className="text-cust-dark-gray text-xl"
                                />
                                <input
                                    type="text"
                                    name="nipd"
                                    placeholder="NIPD kalian"
                                    className="w-full outline-none"
                                    value={data.nipd}
                                    onChange={(e) =>
                                        setData("nipd", e.target.value)
                                    }
                                    disabled={processing}
                                    required
                                />
                            </div>
                            {errors.nipd && (
                                <p className="text-red-500 text-sm">
                                    {errors.nipd}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-start border rounded-lg px-4 py-2 gap-2">
                                <Icon
                                    icon="mdi:help-circle-outline"
                                    className="text-cust-dark-gray text-xl mt-1"
                                />
                                <textarea
                                    name="pertanyaan"
                                    placeholder="Tuliskan pertanyaan nya disini"
                                    rows="4"
                                    className="w-full outline-none resize-none"
                                    value={data.pertanyaan}
                                    onChange={(e) => {
                                        setData("pertanyaan", e.target.value);
                                    }}
                                    disabled={processing}
                                    required
                                ></textarea>
                            </div>
                            {errors.pertanyaan && (
                                <p className="text-red-500 text-sm">
                                    {errors.pertanyaan}
                                </p>
                            )}
                        </div>

                        <div className="text-right">
                            <Button
                                variant="filled"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? "Mengirim" : "Kirim"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Faq;
