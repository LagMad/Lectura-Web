<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\StaffPerpustakaan;
use App\Models\User;
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

        // — or, if you expect dozens/hundreds and want pagination —
        // $staff = StaffPerpustakaan::orderBy('nama')->paginate(20);

        return Inertia::render('Tentang', [
            'staff' => $staff,
            'books' => $books,
            'user' => $user
        ]);
    }
}
