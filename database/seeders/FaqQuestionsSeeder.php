<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FaqQuestion;
use Carbon\Carbon;

class FaqQuestionsSeeder extends Seeder
{
    public function run(): void
    {
        $faqList = [
            [
                'question' => "Apa itu E-Library Sekolah?",
                'answer' => "E-Library Sekolah adalah perpustakaan digital yang memungkinkan siswa, guru, dan staf untuk mengakses berbagai koleksi buku pelajaran, fiksi, referensi, dan lainnya secara online, kapan saja dan di mana saja.",
                'category' => "Informasi Umum",
            ],
            [
                'question' => "Siapa saja yang bisa mengakses E-Library ini?",
                'answer' => "E-Library ini hanya dapat diakses oleh siswa, guru, dan staf sekolah yang telah memiliki akun resmi dari pihak sekolah.",
                'category' => "Layanan Perpustakaan",
            ],
            [
                'question' => "Bagaimana cara mendaftar akun di E-Library?",
                'answer' => "Akun biasanya dibuat oleh admin sekolah. Jika Anda belum memiliki akun, silakan hubungi wali kelas atau petugas perpustakaan sekolah.",
                'category' => "Informasi Umum",
            ],
            [
                'question' => "Apakah menggunakan E-Library dikenakan biaya?",
                'answer' => "Tidak. Seluruh layanan E-Library ini gratis bagi seluruh anggota komunitas sekolah.",
                'category' => "Layanan Perpustakaan",
            ],
            [
                'question' => "Bagaimana cara meminjam buku di perpustakaan?",
                'answer' => "Kamu bisa meminjam buku dengan membawa kartu pelajar dan memilih buku yang tersedia di rak. Kemudian, lapor ke petugas untuk proses peminjaman.",
                'category' => "Layanan Perpustakaan",
            ],
            [
                'question' => "Berapa lama durasi peminjaman buku?",
                'answer' => "Durasi peminjaman buku adalah 7 hari dan dapat diperpanjang sebanyak 1 kali.",
                'category' => "Layanan Perpustakaan",
            ],
            [
                'question' => "Bagaimana cara mengakses e-book dari rumah?",
                'answer' => "Login ke platform E-Library dengan akun yang diberikan oleh sekolah, lalu pilih menu e-book untuk membaca atau mengunduh.",
                'category' => "Sumber Daya Digital",
            ],
            [
                'question' => "Apakah saya bisa mengunduh video pembelajaran?",
                'answer' => "Sebagian video pembelajaran dapat diunduh, tergantung pada hak akses dan lisensi materi tersebut.",
                'category' => "Sumber Daya Digital",
            ],
            [
                'question' => "Bagaimana cara memesan ruang belajar?",
                'answer' => "Ruang belajar dapat dipesan melalui aplikasi sekolah atau langsung ke petugas perpustakaan.",
                'category' => "Ruang Belajar",
            ],
            [
                'question' => "Apakah ruang belajar bisa digunakan untuk kelompok?",
                'answer' => "Ya, ruang belajar dapat digunakan untuk belajar kelompok dengan maksimal 6 orang.",
                'category' => "Ruang Belajar",
            ],
            [
                'question' => "Jam operasional perpustakaan?",
                'answer' => "Perpustakaan buka dari pukul 07.30 sampai 16.00 pada hari Senin hingga Jumat.",
                'category' => "Informasi Umum",
            ],
            [
                'question' => "Siapa yang bisa mengakses layanan perpustakaan?",
                'answer' => "Semua siswa, guru, dan staf sekolah yang terdaftar dapat mengakses layanan perpustakaan.",
                'category' => "Informasi Umum",
            ],
        ];

        foreach ($faqList as $faq) {
            FaqQuestion::create([
                'nama'       => 'Admin',
                'nipd'       => '11111',
                'pertanyaan' => $faq['question'],
                'jawaban'    => $faq['answer'],
                'kategori'   => $faq['category'],
                'status'     => 'answered',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
