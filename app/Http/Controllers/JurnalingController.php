<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\User;
use App\Models\Jurnaling;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Kategori;

class JurnalingController extends Controller
{

    public function detailJurnal($book_id, $user_id)
    {
        $book = Book::select('id', 'judul', 'penulis', 'cover_path', 'jumlah_halaman')
            ->withCount('jurnaling as total_jurnal')
            ->with(['jurnaling' => function ($query) use ($user_id) {
                $query->where('id_siswa', $user_id)
                    ->orderBy('created_at', 'desc')
                    ->limit(1);
            }])

            ->findOrFail($book_id);

        // Halaman terakhir dibaca
        $halaman_terakhir = $book->jurnaling
            ->sortByDesc('created_at')
            ->first()
            ->halaman_akhir ?? 0;
        $book->halaman_terakhir = $halaman_terakhir;

        // Hitung total siswa unik (distinct id_siswa)
        $total_siswa = Jurnaling::where('id_buku', $book_id)
            ->select('id_siswa')
            ->distinct()
            ->count();
        $book->total_siswa = $total_siswa;

        // Ambil semua jurnal user untuk buku ini
        $journals = Jurnaling::where('id_buku', $book_id)
            ->where('id_siswa', $user_id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($jurnal) {
                return [
                    'id' => $jurnal->id,
                    'tanggal' => Carbon::parse($jurnal->created_at)->format('d M Y'),
                    'halaman_range' => $jurnal->halaman_awal . ' - ' . $jurnal->halaman_akhir,
                    'content' => $jurnal->deskripsi,
                    'created_at' => $jurnal->created_at,
                ];
            });

        return Inertia::render('Admin/JurnalDetail', [
            'book' => $book,
            'journals' => $journals,
        ]);
    }


    public function detail(Request $request, $book_id)
    {
        $book = Book::with(['jurnaling.siswa']) // eager-load jurnaling + siswa
            ->withCount('jurnaling as total_jurnal')
            ->findOrFail($book_id);

        // Count unique siswa who did journaling for this book
        $book->total_siswa = $book->jurnaling
            ->filter(fn($item) => $item->siswa?->role === 'siswa')
            ->unique('id_siswa')
            ->count();

        // Count total jurnal entries by siswa
        $book->total_jurnal = $book->jurnaling
            ->filter(fn($item) => $item->siswa?->role === 'siswa')
            ->count();



        $search = $request->input('search', '');
        $page = $request->input('page', 1);
        $perPage = 3;

        $siswas = User::where('role', 'siswa')
            ->whereHas('jurnalings', function ($query) use ($book_id) {
                $query->where('id_buku', $book_id);
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->withCount(['jurnalings as total_journals' => function ($query) use ($book_id) {
                $query->where('id_buku', $book_id);
            }])
            ->with(['jurnalings' => function ($query) use ($book_id) {
                $query->where('id_buku', $book_id)
                    ->latest()
                    ->limit(1);
            }])
            ->paginate($perPage, ['*'], 'page', $page);

        $formattedsiswas = $siswas->through(function ($siswa) {
            return [
                'id' => $siswa->id,
                'name' => $siswa->name,
                'email' => $siswa->email,
                'total_journals' => $siswa->total_journals,
                'last_updated' => $siswa->jurnalings->isNotEmpty()
                    ? Carbon::parse($siswa->jurnalings->first()->updated_at)->format('d M Y')
                    : '-'
            ];
        });

        return Inertia::render('Admin/JurnalSiswaDetail', [
            'book' => $book,
            'siswa' => $formattedsiswas,
            'totalPages' => $formattedsiswas->lastPage()
        ]);
    }

    public function show($book_id, $siswa_id)
    {
        $book = Book::findOrFail($book_id);
        $siswa = User::where('role', 'siswa')->findOrFail($siswa_id);

        $journals = Jurnaling::where('id_buku', $book_id)
            ->where('id_siswa', $siswa_id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Jurnal/JurnalDetail', [
            'book' => $book,
            'siswa' => $siswa,
            'journals' => $journals
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_buku' => 'required|exists:books,id',
            'halaman_awal' => 'required|integer',
            'halaman_akhir' => 'required|integer',
            'deskripsi' => 'required|string',
        ]);

        Jurnaling::create([
            'id_buku' => $validated['id_buku'],
            'id_siswa' => auth()->id(),
            'halaman_awal' => $validated['halaman_awal'],
            'halaman_akhir' => $validated['halaman_akhir'],
            'deskripsi' => $validated['deskripsi'],
        ]);

        return redirect()->back()->with('success', 'Jurnal berhasil disimpan');
    }

    public function update(Request $request, $id)
    {
        $jurnal = Jurnaling::findOrFail($id);

        if (auth()->id() !== $jurnal->id_siswa && !auth()->user()->hasRole(['admin', 'guru'])) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'halaman_awal' => 'required|integer',
            'halaman_akhir' => 'required|integer',
            'deskripsi' => 'required|string',
        ]);

        $jurnal->update($validated);

        return redirect()->back()->with('success', 'Jurnal berhasil diperbarui');
    }

    public function destroy($id)
    {
        $jurnal = Jurnaling::findOrFail($id);

        // Cek apakah user adalah pemilik jurnal ATAU admin/guru
        if (auth()->id() !== $jurnal->id_siswa && !in_array(auth()->user()->role, ['admin', 'guru'])) {
            abort(403, 'Unauthorized action.');
        }

        $jurnal->delete();

        return redirect()->back()->with('success', 'Jurnal berhasil dihapus');
    }
}
