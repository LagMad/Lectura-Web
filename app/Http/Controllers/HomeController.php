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
        $pengumuman = Pengumuman::query()->get();

        return Inertia::render('Home', [
            'books' => $books,
            'pengumuman' => $pengumuman,
        ]);
    }
}
