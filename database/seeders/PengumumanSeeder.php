<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pengumuman;

class PengumumanSeeder extends Seeder
{
    public function run(): void
    {
        Pengumuman::create([
            'judul' => 'Pengumuman Ujian Tengah Semester',
            'penulis' => 'Admin Perpustakaan',
            'image_path' => null,
            'cloudinary_public_id' => null,
            'link' => 'https://example.com/uts-info',
            'is_active' => false,
            'gdrive_file_id' => null,
            'original_filename' => null,
        ]);

        Pengumuman::create([
            'judul' => 'Workshop Literasi Digital',
            'penulis' => 'Pustakawan',
            'image_path' => null,
            'cloudinary_public_id' => null,
            'link' => 'https://example.com/literasi',
            'is_active' => true,
            'gdrive_file_id' => null,
            'original_filename' => null,
        ]);
    }
}
