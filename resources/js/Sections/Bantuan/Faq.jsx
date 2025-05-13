import React, { useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { Icon } from '@iconify/react'
import Button from '@/Components/Button'

const faqList = [
    {
        question: 'Apa itu E-Library Sekolah?',
        answer: 'E-Library Sekolah adalah perpustakaan digital yang memungkinkan siswa, guru, dan staf untuk mengakses berbagai koleksi buku pelajaran, fiksi, referensi, dan lainnya secara online, kapan saja dan di mana saja.',
        category: 'Informasi Umum',
    },
    {
        question: 'Siapa saja yang bisa mengakses E-Library ini?',
        answer: 'E-Library ini hanya dapat diakses oleh siswa, guru, dan staf sekolah yang telah memiliki akun resmi dari pihak sekolah.',
        category: 'Layanan Perpustakaan',
    },
    {
        question: 'Bagaimana cara mendaftar akun di E-Library?',
        answer: 'Akun biasanya dibuat oleh admin sekolah. Jika Anda belum memiliki akun, silakan hubungi wali kelas atau petugas perpustakaan sekolah.',
        category: 'Informasi Umum',
    },
    {
        question: 'Apakah menggunakan E-Library dikenakan biaya?',
        answer: 'Tidak. Seluruh layanan E-Library ini gratis bagi seluruh anggota komunitas sekolah.',
        category: 'Layanan Perpustakaan',
    },
    {
        category: 'Layanan Perpustakaan',
        question: 'Bagaimana cara meminjam buku di perpustakaan?',
        answer: 'Kamu bisa meminjam buku dengan membawa kartu pelajar dan memilih buku yang tersedia di rak. Kemudian, lapor ke petugas untuk proses peminjaman.',
    },
    {
        category: 'Layanan Perpustakaan',
        question: 'Berapa lama durasi peminjaman buku?',
        answer: 'Durasi peminjaman buku adalah 7 hari dan dapat diperpanjang sebanyak 1 kali.',
    },

    {
        category: 'Sumber Daya Digital',
        question: 'Bagaimana cara mengakses e-book dari rumah?',
        answer: 'Login ke platform E-Library dengan akun yang diberikan oleh sekolah, lalu pilih menu e-book untuk membaca atau mengunduh.',
    },
    {
        category: 'Sumber Daya Digital',
        question: 'Apakah saya bisa mengunduh video pembelajaran?',
        answer: 'Sebagian video pembelajaran dapat diunduh, tergantung pada hak akses dan lisensi materi tersebut.',
    },

    {
        category: 'Ruang Belajar',
        question: 'Bagaimana cara memesan ruang belajar?',
        answer: 'Ruang belajar dapat dipesan melalui aplikasi sekolah atau langsung ke petugas perpustakaan.',
    },
    {
        category: 'Ruang Belajar',
        question: 'Apakah ruang belajar bisa digunakan untuk kelompok?',
        answer: 'Ya, ruang belajar dapat digunakan untuk belajar kelompok dengan maksimal 6 orang.',
    },

    {
        category: 'Informasi Umum',
        question: 'Jam operasional perpustakaan?',
        answer: 'Perpustakaan buka dari pukul 07.30 sampai 16.00 pada hari Senin hingga Jumat.',
    },
    {
        category: 'Informasi Umum',
        question: 'Siapa yang bisa mengakses layanan perpustakaan?',
        answer: 'Semua siswa, guru, dan staf sekolah yang terdaftar dapat mengakses layanan perpustakaan.',
    },
];

const Faq = ({ searchQuery = '', selectedCategory = '' }) => {
    const [showAll, setShowAll] = useState(false)

    const [formData, setFormData] = useState({
        nama: '',
        nis: '',
        pertanyaan: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Data Pertanyaan:', formData);
        setFormData({ nama: '', nis: '', pertanyaan: '' });
    };

    const filteredFaqs = faqList.filter((faq) => {
        const matchCategory = selectedCategory ? faq.category === selectedCategory : true
        const matchSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase())
        return matchCategory && matchSearch
    })

    const displayedFaqs = showAll ? filteredFaqs : filteredFaqs.slice(0, 5)

    return (
        <section>
            <div className='bg-[#F9FAFB] container'>
                <div className='container mx-auto py-20'>
                    <div className='space-y-4 container'>
                        {filteredFaqs.length > 0 ? (
                            <>
                                {displayedFaqs.map((faq, idx) => (
                                    <Disclosure key={idx} defaultOpen={idx === 0}>
                                        {({ open }) => (
                                            <div className='bg-white rounded-xl p-6 cursor-pointer'>
                                                <Disclosure.Button className='flex justify-between items-center w-full font-semibold text-left text-sm md:text-base lg:text-lg text-gray-900 cursor-pointer'>
                                                    <span>{faq.question}</span>
                                                    <span className="text-xl bg-gradient-to-l from-[#CACED8] to-[#2563EB] bg-clip-text text-transparent">
                                                        <Icon
                                                            icon="iconamoon:arrow-down-2"
                                                            className={`transition-transform text-cust-blue duration-200 ${open ? 'rotate-180' : ''}`}
                                                        />
                                                    </span>
                                                </Disclosure.Button>
                                                <Disclosure.Panel className='pt-2 text-xs md:text-sm lg:text-base text-gray-600'>
                                                    {faq.answer}
                                                </Disclosure.Panel>
                                            </div>
                                        )}
                                    </Disclosure>
                                ))}
                                {!showAll && filteredFaqs.length > 5 && (
                                    <div className='text-end  pt-4'>
                                        <button
                                            onClick={() => setShowAll(true)}
                                            className='text-sm font-medium text-blue-600 hover:underline'
                                        >
                                            Lihat semua pertanyaan
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-gray-500">Pertanyaan tidak ditemukan.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className='container mx-auto py-14'>
                <div className='container space-y-10'>
                    <div className='text-center'>
                        <h1 className='font-bold text-xl lg:text-4xl'>Masih Memiliki Pertanyaan?</h1>
                        <p className='text-sm lg:font-lg mt-2'>Tidak dapat menemukan apa yang Anda cari? Kantor Perpustakaan kami di sini untuk membantu</p>
                    </div>

                    <form className="max-w-xl mx-auto space-y-4" onSubmit={handleSubmit}>
                        <div className="flex items-center border rounded-lg px-4 py-2 gap-2">
                            <Icon icon="ix:user-profile-filled" className="text-cust-dark-gray text-xl" />
                            <input
                                type="text"
                                name="nama"
                                placeholder="Nama kalian"
                                className="w-full outline-none"
                                value={formData.nama}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-center border rounded-lg px-4 py-2 gap-2">
                            <Icon icon="la:id-card" className="text-cust-dark-gray text-xl" />
                            <input
                                type="text"
                                name="nis"
                                placeholder="NIS kalian"
                                className="w-full outline-none"
                                value={formData.nis}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-start border rounded-lg px-4 py-2 gap-2">
                            <Icon icon="mdi:help-circle-outline" className="text-cust-dark-gray text-xl mt-1" />
                            <textarea
                                name="pertanyaan"
                                placeholder="Tuliskan pertanyaan nya disini"
                                rows="4"
                                className="w-full outline-none resize-none"
                                value={formData.pertanyaan}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="text-right">
                            <Button variant='filled' type="submit">Kirim</Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Faq