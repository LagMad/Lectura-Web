<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StaffPerpustakaan;
use Carbon\Carbon;

class StaffPerpustakaanSeeder extends Seeder
{
    public function run(): void
    {
        $staff = [
            [
                'nama'      => 'Dr. Ida Farida, M.Pd.',
                'jabatan'   => 'Kepala Perpustakaan',
                'photo_path'=> 'staff/ida_farida.jpg',
                'cloudinary_public_id' => 'perpustakaan/staff/ida_farida',
                'link'      => 'mailto:ida.farida@school.sch.id',
                'gdrive_file_id'   => null,
                'original_filename'=> 'ida_profile.jpg',
            ],
            [
                'nama'      => 'Agus Santoso',
                'jabatan'   => 'Petugas Peminjaman',
                'photo_path'=> 'staff/agus_santoso.jpg',
                'cloudinary_public_id' => 'perpustakaan/staff/agus_santoso',
                'link'      => null,
                'gdrive_file_id'   => null,
                'original_filename'=> 'agus_profile.jpg',
            ],
            [
                'nama'      => 'Siti Rahmawati',
                'jabatan'   => 'Petugas Pengembalian',
                'photo_path'=> 'staff/siti_rahmawati.jpg',
                'cloudinary_public_id' => 'perpustakaan/staff/siti_rahmawati',
                'link'      => null,
                'gdrive_file_id'   => null,
                'original_filename'=> 'siti_profile.jpg',
            ],
            [
                'nama'      => 'Budi Hartono',
                'jabatan'   => 'Pengelola Koleksi Digital',
                'photo_path'=> 'staff/budi_hartono.jpg',
                'cloudinary_public_id' => 'perpustakaan/staff/budi_hartono',
                'link'      => 'https://scholar.google.com/budi-hartono',
                'gdrive_file_id'   => '1AbCdEfGhIjKlmNopQrStUvWxYz',
                'original_filename'=> 'budi_cv.pdf',
            ],
            [
                'nama'      => 'Dewi Lestari',
                'jabatan'   => 'Penata Katalog',
                'photo_path'=> 'staff/dewi_lestari.jpg',
                'cloudinary_public_id' => 'perpustakaan/staff/dewi_lestari',
                'link'      => null,
                'gdrive_file_id'   => null,
                'original_filename'=> 'dewi_profile.jpg',
            ],
            [
                'nama'      => 'Fajar Prasetyo',
                'jabatan'   => 'Teknisi Sistem E‑Library',
                'photo_path'=> 'staff/fajar_prasetyo.jpg',
                'cloudinary_public_id' => 'perpustakaan/staff/fajar_prasetyo',
                'link'      => 'https://github.com/fajarprasetyo',
                'gdrive_file_id'   => null,
                'original_filename'=> 'fajar_profile.jpg',
            ],
            [
                'nama'      => 'Laila Kusuma',
                'jabatan'   => 'Pustakawan Referensi',
                'photo_path'=> 'staff/laila_kusuma.jpg',
                'cloudinary_public_id' => 'perpustakaan/staff/laila_kusuma',
                'link'      => null,
                'gdrive_file_id'   => null,
                'original_filename'=> 'laila_profile.jpg',
            ],
            [
                'nama'      => 'Rizky Aditya',
                'jabatan'   => 'Penanggung Jawab Ruang Baca',
                'photo_path'=> 'staff/rizky_aditya.jpg',
                'cloudinary_public_id' => 'perpustakaan/staff/rizky_aditya',
                'link'      => null,
                'gdrive_file_id'   => null,
                'original_filename'=> 'rizky_profile.jpg',
            ],
        ];

        $now = Carbon::now();

        foreach ($staff as $row) {
            StaffPerpustakaan::create(array_merge($row, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }
}
