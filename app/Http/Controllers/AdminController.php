<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Jurnaling;
use App\Models\Kategori;
use App\Models\Pengumuman;
use App\Models\Poster;
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

    public function adminBuku(Request $request)
    {

        // Jurnaling Siswa
        $search = $request->input('search', '');
        $kategori = $request->input('kategori', '');
        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);

        $queryJurnaling = Book::select([
            'id',
            'judul',
            'penulis',
            'cover_path',
            'updated_at'
        ]);

        // Pencarian
        if (!empty($search)) {
            $queryJurnaling->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                    ->orWhere('penulis', 'like', "%{$search}%");
            });
        }

        // Filter kategori
        if ($kategori !== '' && $kategori !== 'Semua Kategori') {
            $queryJurnaling->where('kategori', $kategori);
        }

        // Pagination
        $booksJurnaling = $queryJurnaling->orderBy('updated_at', 'desc')
            ->paginate($perPage);

        // Format data
        $formattedBooks = $booksJurnaling->map(function ($book) {
            $totalJurnal = Jurnaling::where('id_buku', $book->id)
                ->whereHas('siswa', fn($q) => $q->where('role', 'siswa'))
                ->count();

            $totalSiswa = Jurnaling::where('id_buku', $book->id)
                ->whereHas('siswa', fn($q) => $q->where('role', 'siswa'))
                ->distinct('id_siswa')
                ->count('id_siswa');


            return [
                'id' => $book->id,
                'judul' => $book->judul,
                'penulis' => $book->penulis,
                'cover_image' => $book->cover_path,
                'total_jurnal' => $totalJurnal,
                'total_siswa' => $totalSiswa,
                'update_terakhir' => $book->updated_at->format('d M Y'),
            ];
        });


        $kategoriBuku = Book::distinct()->pluck('kategori')->filter()->toArray();
        array_unshift($kategoriBuku, 'Semua Kategori');


        // ManajemenBuku
        $query = Book::query();

        // Apply search filter
        if ($request->has('search') && $request->search !== null && $request->search !== '') {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('judul', 'like', "%{$searchTerm}%")
                    ->orWhere('penulis', 'like', "%{$searchTerm}%");
            });
        }

        // Apply category filter
        if ($request->has('kategori') && $request->kategori !== null && $request->kategori !== '') {
            $query->where('kategori', $request->kategori);
        }

        // Apply status filter
        if ($request->has('status') && $request->status !== null && $request->status !== '') {
            $query->where('status', $request->status);
        }

        $books = $query->latest()->paginate(10)->appends($request->all());

        $queryKategori = Kategori::query();

        if (!empty($search)) {
            $queryKategori->where('kategori', 'like', "%{$search}%");
        }

        $categories = $queryKategori->orderBy('created_at', 'desc')->paginate($perPage);

        $booksTabelKonten = Book::whereNotIn('karya_oleh', ['Koleksi Perpustakaan'])->get();

        $posters = Poster::all();

        return Inertia::render('Admin/Buku', [
            'booksTabelKonten' => $booksTabelKonten,
            'books' => $books,
            'booksJurnaling' => $formattedBooks,
            'totalBooks' => $books->total(),
            'kategoriBuku' => $kategoriBuku,
            'filters' => [
                'search' => $search,
                'kategori' => $kategori,
                'page' => $page,
                'perPage' => $perPage,
            ],
            'pagination' => [
                'current_page' => $books->currentPage(),
                'last_page' => $books->lastPage(),
                'per_page' => $books->perPage(),
                'total' => $books->total(),
            ],
            'kategoriAll' => $categories,
            'posters' => $posters
        ]);
    }
}
