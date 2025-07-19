<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Book;
use App\Models\Favorite;
use App\Models\Kategori;
use App\Models\Jurnaling;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use Illuminate\Support\Facades\DB;
use App\Services\GoogleDriveService;


class BookController extends Controller
{
    protected $cloudinary;
    protected $googleDrive;

    public function __construct(GoogleDriveService $googleDrive)
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

        $this->googleDrive = $googleDrive;
    }


    public function index(Request $request)
    {
        $kategori = Kategori::all();

        // Get the category filter from request
        $categoryFilter = $request->get('category');

        $books = Book::with([
            'favorites' => function ($query) {
                $query->where('user_id', auth()->id());
            }
        ])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->when($categoryFilter, function ($query, $category) {
                // Filter by category if provided and not "Semua Buku"
                if ($category !== 'Semua Buku') {
                    $query->where('kategori', $category);
                }
            })
            ->latest()
            ->paginate(10);

        foreach ($books as $book) {
            $book->isFavorited = $book->favorites->isNotEmpty();
            $book->average_rating = $book->reviews_avg_rating ?? 0;
        }

        $topRatedBooks = Book::withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->having('reviews_count', '>', 0)
            ->orderByDesc('reviews_avg_rating')
            ->take(10)
            ->get()
            ->map(function ($book) {
                $book->average_rating = $book->reviews_avg_rating ?? 0;
                return $book;
            });

        return Inertia::render('Buku', [
            'books' => $books,
            'topRatedBooks' => $topRatedBooks,
            'kategori' => $kategori,
            'filters' => [
                'category' => $categoryFilter,
            ],
        ]);
    }

    public function dashboard(Request $request)
    {

        // Get the category filter from request

        $favoriteBooks = Favorite::with('book')
            ->where('user_id', auth()->id())
            ->orderByDesc('updated_at')
            ->get()
            ->pluck('book'); // Ambil hanya bagian 'book'-nya

        $kategori = Favorite::with('book')
            ->where('user_id', auth()->id())
            ->get()
            ->pluck('book.kategori')
            ->unique()
            ->values(); // reset index agar arraynya rapi

        $categoryFilter = $request->get('category');

        // Ambil semua books
        $books = Book::latest()->paginate(10);

        // Ambil jurnaling berdasarkan user yang login
        $jurnaling = Jurnaling::with('buku')
            ->where('id_siswa', auth()->id())
            ->latest()
            ->paginate(10);

        foreach ($favoriteBooks as $favoriteBook) {
            $favoriteBook->isFavorited = $favoriteBook->favorites->isNotEmpty();
        }

        return Inertia::render('Dashboard', [
            'favoriteBooks' => $favoriteBooks,
            'books' => $books,        // Semua buku
            'jurnaling' => $jurnaling, // Jurnaling user yang login
            'kategori' => $kategori,
            'filters' => [
                'category' => $categoryFilter,
            ],
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

        return Inertia::render('Admin/Buku', [
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
            'kategoriAll' => $categories
        ]);
    }

    public function create()
    {
        $kategori = Kategori::all();

        return Inertia::render('Admin/TambahBuku', [
            'kategori' => $kategori
        ]);
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
            'karya_oleh' => 'required|in:Siswa,Guru,Koleksi Perpustakaan',
            'deskripsi' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'file_buku' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx|max:10240', // 10MB max
            'status' => 'required|string|max:255'
        ]);

        // Pengecekan duplikasi buku
        $potentialDuplicates = $this->checkDuplicateBook($request);

        if ($potentialDuplicates->isNotEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Buku serupa sudah ada dalam sistem',
                'potential_duplicates' => $potentialDuplicates,
                'request_new' => [
                    'judul' => $request->judul,
                    'penulis' => $request->penulis,
                    'jumlah_halaman' => $request->jumlah_halaman,
                    'penerbit' => $request->penerbit,
                    'tahun_terbit' => $request->tahun_terbit
                ]
            ]);
        }

        $data = $request->except(['cover', 'file_buku']);

        // Upload cover jika ada
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

        // Upload file ke Google Drive jika ada
        if ($request->hasFile('file_buku')) {
            try {
                $file = $request->file('file_buku');
                $fileName = $request->judul . ' - ' . $request->penulis . '.' . $file->getClientOriginalExtension();

                $driveFile = $this->googleDrive->uploadFile($file, $fileName);

                $data['link'] = $driveFile['webViewLink'];
                $data['gdrive_file_id'] = $driveFile['id'];
                $data['original_filename'] = $file->getClientOriginalName();

                \Log::info('Google Drive upload result:', [
                    'file_id' => $driveFile['id'],
                    'link' => $driveFile['webViewLink']
                ]);
            } catch (\Exception $e) {
                \Log::error('Google Drive upload error: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Error uploading file: ' . $e->getMessage()
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

    private function checkDuplicateBook(Request $request)
    {
        $query = Book::query();

        // Parameter untuk pengecekan
        if ($request->filled('penulis')) {
            $query->where('penulis', 'like', '%' . $request->penulis . '%');
        }

        if ($request->filled('jumlah_halaman')) {
            $query->where('jumlah_halaman', $request->jumlah_halaman);
        }

        if ($request->filled('tahun_terbit')) {
            $query->where('tahun_terbit', $request->tahun_terbit);
        }

        if ($request->filled('penerbit')) {
            $query->where('penerbit', 'like', '%' . $request->penerbit . '%');
        }

        // Fuzzy match untuk judul
        if ($request->filled('judul')) {
            $query->where(function ($q) use ($request) {
                $q->where('judul', 'like', '%' . $request->judul . '%')
                    ->orWhereRaw('SOUNDEX(judul) = SOUNDEX(?)', [$request->judul]);
            });
        }

        // Ambil buku-buku yang potensial duplikat
        return $query->get();
    }

    public function show(Book $book)
    {
        $reviews = $book->reviews()->with('user')->latest()->get();
        $averageRating = $book->reviews()->avg('rating');
        $isFavorited = false;

        // Get other books in the same category, excluding the current one
        $relatedBooks = Book::where('kategori', $book->kategori) // same category
            ->whereKeyNot($book->id)                            // exclude the one being viewed
            ->latest()                                          // order by created_at DESC
            ->take(10)                                          // limit to 10
            ->get();

        if (auth()->check()) {
            $isFavorited = $book->favorites()
                ->where('user_id', auth()->id())
                ->exists();
        }

        return Inertia::render('Buku/Detail', [
            'book'         => $book,
            'reviews'      => $reviews,
            'avgRating'    => $averageRating,
            'isFavorited'  => $isFavorited,
            'relatedBooks' => $relatedBooks,
        ]);
    }


    public function edit(Book $book)
    {
        $kategori = Kategori::All();

        return Inertia::render('Admin/EditBuku', [
            'book' => $book,
            'kategori' => $kategori
        ]);
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        // Validate the request
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'penulis' => 'required|string|max:255',
            'jumlah_halaman' => 'required|integer|min:1',
            'kategori' => 'nullable|string|max:255',
            'penerbit' => 'nullable|string|max:255',
            'tahun_terbit' => 'nullable|string|max:4',
            'bahasa' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:Tersedia,Tidak Tersedia,Terkendala',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'file_buku' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx|max:10240', // 10MB max
        ]);

        \Log::info('Book update request data:', $request->all());
        \Log::info('Book before update:', $book->toArray());

        $data = $request->except(['cover', 'file_buku', '_method', '_token']);

        // Upload cover jika ada
        if ($request->hasFile('cover')) {
            try {
                // Hapus cover lama jika ada
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

        // Upload file ke Google Drive jika ada
        if ($request->hasFile('file_buku')) {
            try {
                // Hapus file lama di Google Drive jika ada
                if ($book->gdrive_file_id) {
                    $this->googleDrive->deleteFile($book->gdrive_file_id);
                    \Log::info('Deleted old file from Google Drive:', ['file_id' => $book->gdrive_file_id]);
                }

                $file = $request->file('file_buku');
                $fileName = $request->judul . ' - ' . $request->penulis . '.' . $file->getClientOriginalExtension();

                $driveFile = $this->googleDrive->uploadFile($file, $fileName);

                $data['link'] = $driveFile['webViewLink'];
                $data['gdrive_file_id'] = $driveFile['id'];
                $data['original_filename'] = $file->getClientOriginalName();

                // Set status menjadi Tersedia ketika file berhasil diupload
                $data['status'] = 'Tersedia';

                \Log::info('Google Drive upload result:', [
                    'file_id' => $driveFile['id'],
                    'link' => $driveFile['webViewLink'],
                    'status' => 'Tersedia' // Log perubahan status
                ]);
            } catch (\Exception $e) {
                \Log::error('Google Drive upload/delete error: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Error handling file: ' . $e->getMessage()
                ], 500);
            }
        }

        $updated = $book->update($data);

        \Log::info('Book after update:', $book->fresh()->toArray());
        \Log::info('Update successful: ' . ($updated ? 'Yes' : 'No'));

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil diperbarui.',
            'data' => $book->fresh()
        ]);
    }

    public function destroy(Book $book)
    {
        try {
            // Hapus cover dari Cloudinary jika ada
            if ($book->cloudinary_public_id) {
                $this->cloudinary->uploadApi()->destroy($book->cloudinary_public_id);
                \Log::info('Deleted image from Cloudinary during book deletion:', [
                    'book_id' => $book->id,
                    'public_id' => $book->cloudinary_public_id
                ]);
            }

            // Hapus file dari Google Drive jika ada
            if ($book->gdrive_file_id) {
                $this->googleDrive->deleteFile($book->gdrive_file_id);
                \Log::info('Deleted file from Google Drive during book deletion:', [
                    'book_id' => $book->id,
                    'file_id' => $book->gdrive_file_id
                ]);
            }

            $book->delete();

            return redirect()->route('books.admin')
                ->with('success', 'Buku berhasil dihapus!');
        } catch (\Exception $e) {
            \Log::error('Error deleting book, Cloudinary image, or Google Drive file: ' . $e->getMessage());
            return redirect()->route('books.admin')
                ->with('error', 'Terjadi kesalahan saat menghapus buku: ' . $e->getMessage());
        }
    }

    public function search(Request $request)
    {
        $query = $request->input('q');

        $books = Book::where('judul', 'like', "%{$query}%")
            ->orWhere('penulis', 'like', "%{$query}%")
            ->select('id', 'judul', 'penulis', 'cover_path')
            ->take(5)
            ->get();

        return response()->json($books);
    }
}
