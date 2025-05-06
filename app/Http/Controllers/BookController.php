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
        'status' => 'required|string|max:255',
        'link' => 'nullable|string|max:255'
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
        return Inertia::render('Admin/EditBuku', [
            'book' => $book,
        ]);
    
    }

    /**
     * Update the specified book in database.
     */
    public function update(Request $request, $id)
    {
        // Find the book by ID
        $book = Book::findOrFail($id);
        
        // Validate the request
        $validated = $request->validate([
            'judul' => 'string|max:255',
            'penulis' => 'string|max:255',
            'jumlah_halaman' => 'integer|min:1',
            'kategori' => 'nullable|string|max:255',
            'penerbit' => 'nullable|string|max:255',
            'tahun_terbit' => 'nullable|string|max:4',
            'bahasa' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
            'status' => 'in:Tersedia,Tidak Tersedia,Terkendala',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        // Log the request data for debugging
        \Log::info('Book update request data:', $request->all());
        \Log::info('Book before update:', $book->toArray());
        
        // Extract data except 'cover'
        $data = $request->except(['cover', '_method', '_token']);
        
        // Handle cover upload
        if ($request->hasFile('cover')) {
            if ($book->cover_path) {
                Storage::disk('public')->delete($book->cover_path);
            }
            
            $path = $request->file('cover')->store('covers', 'public');
            $data['cover_path'] = $path;
            $data['cover_url'] = Storage::url($path);
        }
        
        // Perform the update
        $updated = $book->update($data);
        
        // Log after update
        \Log::info('Book after update:', $book->fresh()->toArray());
        \Log::info('Update successful: ' . ($updated ? 'Yes' : 'No'));
        
        // Return response
        return response()->json([
            'message' => 'Buku berhasil diperbarui.',
            'success' => $updated,
            'book' => $book->fresh()
        ]);
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