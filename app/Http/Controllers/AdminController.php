<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Pengumuman;
use App\Models\StaffPerpustakaan;
use App\Models\User;
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
        $booksTabelKonten = Book::whereNotIn('karya_oleh', ['Koleksi Perpustakaan'])->get();


        return Inertia::render('Admin/Dashboard', [
            'users' => $latestUsers,
            'staff' => $staff,
            'pengumuman' => $pengumuman,
            'videos' => $videos,
            'books' => $books,
            'booksTabelKonten' => $booksTabelKonten
        ]);
    }
}
