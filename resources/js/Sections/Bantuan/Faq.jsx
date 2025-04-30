import React from 'react'
import { Disclosure } from '@headlessui/react'
import { Icon } from '@iconify/react'
import Button from '@/Components/Button'

const faqList = [
    {
        question: 'Apa itu E-Library Sekolah?',
        answer:
            'E-Library Sekolah adalah perpustakaan digital yang memungkinkan siswa, guru, dan staf untuk mengakses berbagai koleksi buku pelajaran, fiksi, referensi, dan lainnya secara online, kapan saja dan di mana saja.',
    },
    {
        question: 'Siapa saja yang bisa mengakses E-Library ini?',
        answer:
            'E-Library ini hanya dapat diakses oleh siswa, guru, dan staf sekolah yang telah memiliki akun resmi dari pihak sekolah.',
    },
    {
        question: 'Bagaimana cara mendaftar akun di E-Library?',
        answer:
            'Akun biasanya dibuat oleh admin sekolah. Jika Anda belum memiliki akun, silakan hubungi wali kelas atau petugas perpustakaan sekolah.',
    },
    {
        question: 'Apakah menggunakan E-Library dikenakan biaya?',
        answer:
            'Tidak. Seluruh layanan E-Library ini gratis bagi seluruh anggota komunitas sekolah.',
    },
]

const Faq = () => {
    return (
        <section>
            <div className='bg-[#F9FAFB]'>
                <div className='container mx-auto py-20'>
                    <div className='space-y-4 container'>
                        {faqList.map((faq, idx) => (
                            <Disclosure key={idx} defaultOpen={idx === 0}>
                                {({ open }) => (
                                    <div className='bg-white rounded-xl p-6'>
                                        <Disclosure.Button className='flex justify-between items-center w-full font-semibold text-left text-sm md:text-base lg:text-lg text-gray-900'>
                                            <span>{faq.question}</span>
                                            <span className="text-xl bg-gradient-to-l from-[#CACED8] to-[#2563EB] bg-clip-text text-transparent">
                                                <Icon
                                                    icon="iconamoon:arrow-down-2"
                                                    className={`transition-transform text-cust-blue duration-200 ${open ? 'rotate-180' : ''}`}
                                                />
                                            </span>
                                        </Disclosure.Button>
                                        <Disclosure.Panel className='pt-2 text-xs md:text-sm lg::text-base text-gray-600'>
                                            {faq.answer}
                                        </Disclosure.Panel>
                                    </div>
                                )}
                            </Disclosure>
                        ))}
                    </div>
                </div>
            </div>
            <div className='container mx-auto py-20'>
                <div className='container space-y-10'>
                    <div className='text-center'>
                        <h1 className='font-bold text-4xl'>Masih Memiliki Pertanyaan?</h1>
                        <p className='font-lg mt-2'>tidak dapat menemukan apa yang Anda cari? Kantor Perpustakaan kami di sini untuk membantu</p>
                    </div>
                    <div className='flex justify-center gap-4 lg:gap-8'>
                        <Button variant='filled'>Chat dengan kami</Button>
                        <Button>Detail Bantuan</Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Faq