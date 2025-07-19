<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\StaffPerpustakaan;
use App\Models\User;
use App\Models\YoutubeVideo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TentangController extends Controller
{
    public function index(Request $request)
    {
        // If you want simple ordering:
        $staff = StaffPerpustakaan::query()->get();
        $books = Book::query()->get();
        $user = User::query()->get();
        $videos = YoutubeVideo::where('is_active', true)->get();

        return Inertia::render('Tentang', [
            'staff' => $staff,
            'books' => $books,
            'user' => $user,
            'videos' => $videos
        ]);
    }
}
