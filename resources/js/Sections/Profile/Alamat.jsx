import React from 'react'

const Alamat = () => {
    return (
        <section className='flex flex-col lg:flex-row justify-between gap-8 lg:gap-16 lg:py-16'>
            <div className="h-72 lg:h-96 lg:w-1/2 rounded-xl overflow-hidden shadow-lg order-2">
                <iframe
                    title="MAN 2 Kota Malang Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.365650411225!2d112.61949027455677!3d-7.961112079336362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd629d5153d432b%3A0x89a8ebac9e30222!2sMAN%202%20Kota%20Malang!5e0!3m2!1sid!2sid!4v1744461075269!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            <div className='lg:w-1/2 order-1 lg:order-2'>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold pb-2 lg:pb-5">Perpustakaan MAN 2 Kota Malang</h1>
                <p className="text-gray-600">Jl. Bandung No.7, Klojen, Kota Malang</p>
                <li>WhatsApp : 0821-3178-2600</li>
                <li>Email : perpusman2kotamalang@gmail.com</li>
                <li>Digital Library : https://man2kotamalang.edoo.id</li>
            </div>
        </section>
    )
}

export default Alamat
