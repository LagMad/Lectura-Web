<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{

    public function index()
    {
        $books = Book::latest()->paginate(10);
        return Inertia::render('Buku', [
            'books' => $books,
        ]);
    }

    public function adminBuku(Request $request)
    {
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

        // Get books with pagination
        $books = $query->latest()->paginate(10)->appends($request->all());

        return Inertia::render('Admin/Buku', [
            'books' => $books,
        ]);
    }


    public function create()
    {
        return Inertia::render('Admin/TambahBuku');
    }

    /**
     * Store a newly created book in database.
     */
    public function store(Request $request)
{
    $request->validate([
        'judul' => 'required|string|max:255',
        'penulis' => 'required|string|max:255',
        'jumlah_halaman' => 'required|integer|min:1',
        'kategori' => 'nullable|string|max:255',
        'penerbit' => 'nullable|string|max:255',
        'tahun_terbit' => 'nullable|string|max:4',
        'bahasa' => 'nullable|string|max:255',
        'deskripsi' => 'nullable|string',
        'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'status' => 'required|string|max:255'
    ]);

    $data = $request->except('cover');

    // Handle cover upload
    if ($request->hasFile('cover')) {
        $path = $request->file('cover')->store('covers', 'public');
        $data['cover_path'] = $path;
    }

    $book = Book::create($data);

    // Return JSON response instead of redirect
    return response()->json([
        'success' => true, 
        'message' => 'Buku berhasil ditambahkan!',
        'data' => $book
    ]);
}

    public function show(Book $book)
    {
        $reviews = $book->reviews()->with('user')->latest()->get();
        $averageRating = $book->reviews()->avg('rating');

        return Inertia::render('Books/Show', [
            'book' => $book,
            'reviews' => $reviews,
            'avgRating' => $averageRating
        ]);
    }

    /**
     * Show the form for editing the specified book.
     */
    public function edit(Book $book)
    {
        return Inertia::render('Books/Edit', [
            'book' => $book,
        ]);
    
    }

    /**
     * Update the specified book in database.
     */
    public function update(Request $request, Book $book)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'penulis' => 'required|string|max:255',
            'jumlah_halaman' => 'required|integer|min:1',
            'kategori' => 'nullable|string|max:255',
            'penerbit' => 'nullable|string|max:255',
            'tahun_terbit' => 'nullable|string|max:4',
            'bahasa' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->except('cover');

        // Handle cover upload
        if ($request->hasFile('cover')) {
            if ($book->cover_path) {
                Storage::disk('public')->delete($book->cover_path);
            }
            
            $path = $request->file('cover')->store('covers', 'public');
            $data['cover_path'] = $path;
        }

        $book->update($data);

        return redirect()->route('books.index')
            ->with('success', 'Buku berhasil diperbarui!');
    }

    /**
     * Remove the specified book from database.
     */
    public function destroy(Book $book)
    {
        // Delete book cover if exists
        if ($book->cover_path) {
            Storage::disk('public')->delete($book->cover_path);
        }

        $book->delete();

        return redirect()->route('books.admin')
            ->with('success', 'Buku berhasil dihapus!');
    }
}