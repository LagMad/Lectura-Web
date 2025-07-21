<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $kategoriList = ['Novel', 'Sains', 'Sejarah', 'Teknologi', 'Komik'];
        $penerbitList = ['Gramedia', 'Erlangga', 'Mizan', 'Bentang Pustaka'];
        $bahasaList = ['Indonesia', 'Inggris'];
        $statusList = ['Tersedia', 'Tidak Tersedia'];
        $karyaOlehList = ['Guru', 'Siswa', 'Koleksi Perpustakaan'];

        for ($i = 0; $i < 20; $i++) {
            Book::create([
                'judul' => 'Judul Buku ' . ($i + 1),
                'penulis' => 'Penulis ' . ($i + 1),
                'jumlah_halaman' => rand(100, 400),
                'kategori' => $kategoriList[array_rand($kategoriList)],
                'penerbit' => $penerbitList[array_rand($penerbitList)],
                'tahun_terbit' => rand(2000, 2023),
                'bahasa' => $bahasaList[array_rand($bahasaList)],
                'deskripsi' => 'Deskripsi singkat untuk buku ' . ($i + 1),
                'cover_path' => 'covers/cover' . ($i + 1) . '.jpg',
                'status' => $statusList[array_rand($statusList)],
                'link' => 'https://drive.google.com/file/d/' . Str::uuid(),
                'gdrive_file_id' => Str::uuid(),
                'original_filename' => 'file' . ($i + 1) . '.pdf',
                'cloudinary_public_id' => 'cloudinary_id_' . ($i + 1),
                'karya_oleh' => $karyaOlehList[array_rand($karyaOlehList)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
