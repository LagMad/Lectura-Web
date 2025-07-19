<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Pengumuman;
use App\Models\StaffPerpustakaan;
use App\Models\User;
use App\Models\WebPortal;
use App\Models\YoutubeVideo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function adminDashboard()
    {
        $latestUsers = User::latest()->get();
        $staff       = StaffPerpustakaan::orderBy('nama')->get();
        $pengumuman = Pengumuman::latest()->get();
        $videos = YoutubeVideo::latest()->get();
        $books = Book::all();
        $statistik = [
            'total_karya_siswa' => Book::where("karya_oleh", "Siswa")->count(),
            'total_karya_guru' => Book::where("karya_oleh", "Guru")->count(),
            'total_koleksi_perpus' => Book::where("karya_oleh", "Koleksi Perpustakaan")->count()
        ];
        $booksTabelKonten = Book::whereNotIn('karya_oleh', ['Koleksi Perpustakaan'])->get();
        $web = WebPortal::all();

        return Inertia::render('Admin/Dashboard', [
            'users' => $latestUsers,
            'staff' => $staff,
            'pengumuman' => $pengumuman,
            'videos' => $videos,
            'books' => $books,
            'booksTabelKonten' => $booksTabelKonten,
            'statistik' => $statistik,
            'web' => $web
        ]);
    }
}
