import React from 'react';

const journals = [
  {
    title: 'Ayo Berolahraga Silat',
    author: 'Ahmad Fuadi',
    cover: '/path/to/cover.jpg', 
    entries: 3,
  },
  
];

const ReadingJournal = () => {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
     
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">E-Library</h1>
        <div className="flex gap-6 text-sm font-medium">
          <a href="#">Beranda</a>
          <a href="#">Buku</a>
          <a href="#">Bantuan</a>
          <a href="#">Tentang</a>
        </div>
        <div className="flex items-center gap-4">
          <input type="text" placeholder="Cari buku..." className="px-2 py-1 border rounded-md text-sm" />
          <span className="material-icons">notifications</span>
          <span className="material-icons">account_circle</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-4 max-w-7xl mx-auto mt-10 px-6 gap-6">
       
        <aside className="bg-white p-6 rounded shadow-md">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
              <span className="material-icons">account_circle</span>
            </div>
            <h2 className="text-md font-semibold">Krisna Liantara</h2>
            <p className="text-xs text-gray-500">Anggota Sejak 2024</p>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <a href="#" className="block hover:text-blue-600">Umum</a>
            <a href="#" className="block hover:text-blue-600">Password</a>
            <a href="#" className="block hover:text-blue-600">Media Sosial</a>
            <a href="#" className="block text-blue-600 font-semibold">Jurnal</a>
          </div>
        </aside>

        <main className="md:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">Jurnal Membaca Saya</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">+ Tambah Jurnal</button>
          </div>

          <div className="bg-white p-4 rounded shadow-md">
            <input
              type="text"
              placeholder="Cari Jurnal..."
              className="w-full border rounded px-3 py-2 text-sm mb-4"
            />
            <div className="flex gap-2 mb-4">
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Semua Jurnal</button>
              <button className="bg-gray-200 text-black px-3 py-1 rounded text-xs">Terbaru</button>
              <button className="bg-gray-200 text-black px-3 py-1 rounded text-xs">Belum Selesai</button>
            </div>

       
            <div className="space-y-4">
              {journals.map((journal, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded shadow-sm">
                  <img
                    src={journal.cover}
                    alt="Cover Buku"
                    className="w-14 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-sm font-semibold">{journal.title}</h3>
                    <p className="text-xs text-gray-500">{journal.author}</p>
                    <p className="text-xs text-gray-400">{journal.entries} jurnal dibuat</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-gray-900 text-white px-8 py-10 mt-12 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-bold">Explore</h4>
            <p>About Us</p>
            <p>Our Facilities</p>
            <p>Activities</p>
            <p>Academic Calendar</p>
          </div>
          <div>
            <h4 className="font-bold">Quick Links</h4>
            <p>Contact Us</p>
          </div>
          <div>
            <h4 className="font-bold">Office Hours</h4>
            <p>Monday - Saturday</p>
            <p>07.00 - 16.30 WIB</p>
          </div>
          <div className="italic">
            <p>
              Tidak ada batas untuk ilmu. Bacalah, pelajari, dan kejarlah ilmu itu seperti mengejar cahaya.
            </p>
            <p className="mt-2">- Ahmad Fuadi (Negeri 5 Menara)</p>
          </div>
        </div>
        <div className="text-center text-xs mt-8">© 2025 Lectura Tanoto TBK. All Rights Reserved.</div>
      </footer>
    </div>
  );
};

export default ReadingJournal;
// test 
