<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Book;
use App\Models\Kategori;
use App\Models\Pengumuman;

class HomeController extends Controller
{
    public function index()
    {
        $books = Book::latest()->paginate(10);

        // Get top 10 books by average rating (best to worst)
        $topRatedBooks = Book::withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->having('reviews_count', '>', 0)
            ->orderByDesc('reviews_avg_rating')
            ->take(10)
            ->get()
            ->map(function ($book) {
                $book->average_rating = $book->reviews_avg_rating;
                return $book;
            });

        // Get books for each karya_oleh type with fallback
        $karyaSiswa = $this->getTopBooksByType('Siswa');
        $karyaGuru = $this->getTopBooksByType('Guru');
        $karyaKoleksiPerpustakaan = $this->getTopBooksByType('Koleksi Perpustakaan');

        $pengumuman = Pengumuman::all();

        return Inertia::render('Home', [
            'books' => $books,
            'topRatedBooks' => $topRatedBooks,
            'karyaSiswa' => $karyaSiswa,
            'karyaGuru' => $karyaGuru,
            'karyaKoleksiPerpustakaan' => $karyaKoleksiPerpustakaan,
            'pengumuman' => $pengumuman,
        ]);
    }

    private function getTopBooksByType($karyaOleh, $limit = 10)
    {
        // Get all books of this type, ordered by rating (with reviews first, then without)
        return Book::where('karya_oleh', $karyaOleh)
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->orderByDesc('reviews_count') // Books with reviews first
            ->orderByDesc('reviews_avg_rating') // Then by best rating
            ->orderByDesc('created_at') // Finally by newest
            ->take($limit)
            ->get()
            ->map(function ($book) {
                $book->average_rating = $book->reviews_avg_rating ?? 0;
                return $book;
            });
    }
}