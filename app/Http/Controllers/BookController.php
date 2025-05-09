<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class BookController extends Controller
{
    protected $cloudinary;
    
    public function __construct()
    {
        $this->cloudinary = new Cloudinary(
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key' => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ],
                'url' => [
                    'secure' => true
                ]
            ])
        );
    }
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

        $books = $query->latest()->paginate(10)->appends($request->all());

        return Inertia::render('Admin/Buku', [
            'books' => $books,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/TambahBuku');
    }

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

        if ($request->hasFile('cover')) {
            $file = $request->file('cover');
            $filePath = $file->getRealPath();
            
            try {
                $uploadResult = $this->cloudinary->uploadApi()->upload($filePath, [
                    'folder' => 'buku_covers',
                    'transformation' => [
                        'width' => 500,
                        'height' => 750,
                        'crop' => 'limit'
                    ],
                    'resource_type' => 'image',
                    'access_mode' => 'public'
                ]);
                
                $data['cover_path'] = $uploadResult['secure_url'];
                $data['cloudinary_public_id'] = $uploadResult['public_id'];
                
                \Log::info('Cloudinary upload result:', [
                    'public_id' => $uploadResult['public_id'],
                    'url' => $uploadResult['secure_url']
                ]);
            } catch (\Exception $e) {
                \Log::error('Cloudinary upload error: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Error uploading cover: ' . $e->getMessage()
                ], 500);
            }
        }

        $book = Book::create($data);

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

    public function edit(Book $book)
    {
        return Inertia::render('Admin/EditBuku', [
            'book' => $book,
        ]);
    }

    public function update(Request $request, $id)
    {
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
        
        \Log::info('Book update request data:', $request->all());
        \Log::info('Book before update:', $book->toArray());
        
        $data = $request->except(['cover', '_method', '_token']);
        
        if ($request->hasFile('cover')) {
            try {
                if ($book->cloudinary_public_id) {
                    $this->cloudinary->uploadApi()->destroy($book->cloudinary_public_id);
                    \Log::info('Deleted old image from Cloudinary:', ['public_id' => $book->cloudinary_public_id]);
                }
                
                $file = $request->file('cover');
                $filePath = $file->getRealPath();
                
                $uploadResult = $this->cloudinary->uploadApi()->upload($filePath, [
                    'folder' => 'buku_covers',
                    'transformation' => [
                        'width' => 500,
                        'height' => 750,
                        'crop' => 'limit'
                    ],
                    'resource_type' => 'image',
                    'access_mode' => 'public'
                ]);
                
                $data['cover_path'] = $uploadResult['secure_url'];
                $data['cloudinary_public_id'] = $uploadResult['public_id'];
                
                \Log::info('Cloudinary upload result:', [
                    'public_id' => $uploadResult['public_id'],
                    'url' => $uploadResult['secure_url']
                ]);
            } catch (\Exception $e) {
                \Log::error('Cloudinary upload/delete error: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Error handling cover: ' . $e->getMessage()
                ], 500);
            }
        }
        $updated = $book->update($data);
        
        \Log::info('Book after update:', $book->fresh()->toArray());
        \Log::info('Update successful: ' . ($updated ? 'Yes' : 'No'));
        
        return response()->json([
            'message' => 'Buku berhasil diperbarui.',
            'success' => $updated,
            'book' => $book->fresh()
        ]);
    }

    public function destroy(Book $book)
    {
        try {
            if ($book->cloudinary_public_id) {
                $this->cloudinary->uploadApi()->destroy($book->cloudinary_public_id);
                \Log::info('Deleted image from Cloudinary during book deletion:', [
                    'book_id' => $book->id, 
                    'public_id' => $book->cloudinary_public_id
                ]);
            }

            $book->delete();

            return redirect()->route('books.admin')
                ->with('success', 'Buku berhasil dihapus!');
        } catch (\Exception $e) {
            \Log::error('Error deleting book or Cloudinary image: ' . $e->getMessage());
            return redirect()->route('books.admin')
                ->with('error', 'Terjadi kesalahan saat menghapus buku: ' . $e->getMessage());
        }
    }
}