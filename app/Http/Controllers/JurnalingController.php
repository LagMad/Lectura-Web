<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Jurnaling;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class JurnalingController extends Controller
{
    public function show($id)
    {
        $book = Book::findOrFail($id);
        
        $jurnalingData = Jurnaling::where('id_buku', $id)
            ->with('siswa:id,name')
            ->select('id_siswa', DB::raw('COUNT(*) as total_jurnal'))
            ->groupBy('id_siswa')
            ->get();
            
        return Inertia::render('JurnalingDetail', [
            'book' => [
                'id' => $book->id,
                'judul' => $book->judul,
                'penulis' => $book->penulis,
                'deskripsi' => $book->deskripsi,
                'cover_image' => $book->cover_image,
                'kategori' => $book->kategori,
                'updated_at' => $book->updated_at->format('d M Y'),
            ],
            'jurnalingData' => $jurnalingData,
            'totalSiswa' => $jurnalingData->count(),
            'totalJurnal' => $jurnalingData->sum('total_jurnal'),
        ]);
    }

    /**
     * Show the form for creating a new jurnaling entry.
     *
     * @param  int  $bookId
     * @return \Inertia\Response
     */
    public function create($bookId = null)
    {
        $books = Book::select('id', 'judul', 'penulis')->orderBy('judul')->get();
        $siswa = User::where('role', 'siswa')->select('id', 'name')->orderBy('name')->get();
        
        return Inertia::render('JurnalingCreate', [
            'books' => $books,
            'siswa' => $siswa,
            'selectedBookId' => $bookId,
        ]);
    }

    /**
     * Store a newly created jurnaling entry in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_buku' => 'required|exists:books,id',
            'id_siswa' => 'required|exists:users,id',
            'halaman_awal' => 'required|integer|min:1',
            'halaman_akhir' => 'required|integer|min:1|gte:halaman_awal',
            'deskripsi' => 'required|string|min:10',
        ]);

        Jurnaling::create($request->all());

        return redirect()->route('jurnaling.index')
            ->with('message', 'Jurnaling berhasil disimpan.');
    }

    /**
     * Show the form for editing the specified jurnaling entry.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $jurnaling = Jurnaling::findOrFail($id);
        $books = Book::select('id', 'judul', 'penulis')->orderBy('judul')->get();
        $siswa = User::where('role', 'siswa')->select('id', 'name')->orderBy('name')->get();
        
        return Inertia::render('JurnalingEdit', [
            'jurnaling' => $jurnaling,
            'books' => $books,
            'siswa' => $siswa,
        ]);
    }

    /**
     * Update the specified jurnaling entry in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $jurnaling = Jurnaling::findOrFail($id);
        
        $request->validate([
            'id_buku' => 'required|exists:books,id',
            'id_siswa' => 'required|exists:users,id',
            'halaman_awal' => 'required|integer|min:1',
            'halaman_akhir' => 'required|integer|min:1|gte:halaman_awal',
            'deskripsi' => 'required|string|min:10',
        ]);

        $jurnaling->update($request->all());

        return redirect()->route('jurnaling.index')
            ->with('message', 'Jurnaling berhasil diperbarui.');
    }

    /**
     * Remove the specified jurnaling entry from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $jurnaling = Jurnaling::findOrFail($id);
        $jurnaling->delete();

        return redirect()->route('jurnaling.index')
            ->with('message', 'Jurnaling berhasil dihapus.');
    }

    /**
     * Display jurnal entries for a specific student.
     *
     * @param  int  $studentId
     * @return \Inertia\Response
     */
    public function siswaJurnal($studentId)
    {
        $siswa = User::where('role', 'siswa')->findOrFail($studentId);
        
        $jurnalingSiswa = Jurnaling::where('id_siswa', $studentId)
            ->with('buku:id,judul,penulis,cover_image')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('SiswaJurnalPage', [
            'siswa' => [
                'id' => $siswa->id,
                'name' => $siswa->name,
            ],
            'jurnaling' => $jurnalingSiswa,
        ]);
    }

    /**
     * Display books with jurnaling statistics for a specific student.
     *
     * @param  int  $studentId
     * @return \Inertia\Response
     */
    public function siswaBuku($studentId)
    {
        $siswa = User::where('role', 'siswa')->findOrFail($studentId);
        
        $bukuSiswa = Book::select([
                'books.id',
                'books.judul',
                'books.penulis',
                'books.cover_image',
                DB::raw('COUNT(jurnaling.id) as total_jurnal'),
                DB::raw('MAX(jurnaling.created_at) as last_update')
            ])
            ->join('jurnaling', 'books.id', '=', 'jurnaling.id_buku')
            ->where('jurnaling.id_siswa', $studentId)
            ->groupBy('books.id', 'books.judul', 'books.penulis', 'books.cover_image')
            ->orderBy('last_update', 'desc')
            ->paginate(10);

        return Inertia::render('SiswaBukuPage', [
            'siswa' => [
                'id' => $siswa->id,
                'name' => $siswa->name,
            ],
            'books' => $bukuSiswa,
        ]);
    }

    /**
     * Generate report for jurnaling activities.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function report(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => ['required', Rule::in(['book', 'student'])],
        ]);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $type = $request->input('type');

        if ($type === 'book') {
            $report = Book::select([
                    'books.id',
                    'books.judul',
                    'books.penulis',
                    DB::raw('COUNT(DISTINCT jurnaling.id_siswa) as total_siswa'),
                    DB::raw('COUNT(jurnaling.id) as total_jurnal')
                ])
                ->leftJoin('jurnaling', 'books.id', '=', 'jurnaling.id_buku')
                ->where(function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('jurnaling.created_at', [$startDate, $endDate])
                      ->orWhereNull('jurnaling.created_at');
                })
                ->groupBy('books.id', 'books.judul', 'books.penulis')
                ->orderBy('total_jurnal', 'desc')
                ->get();
        } else {
            $report = User::where('role', 'siswa')
                ->select([
                    'users.id',
                    'users.name',
                    DB::raw('COUNT(DISTINCT jurnaling.id_buku) as total_buku'),
                    DB::raw('COUNT(jurnaling.id) as total_jurnal')
                ])
                ->leftJoin('jurnaling', 'users.id', '=', 'jurnaling.id_siswa')
                ->where(function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('jurnaling.created_at', [$startDate, $endDate])
                      ->orWhereNull('jurnaling.created_at');
                })
                ->groupBy('users.id', 'users.name')
                ->orderBy('total_jurnal', 'desc')
                ->get();
        }

        return Inertia::render('JurnalingReport', [
            'report' => $report,
            'filters' => [
                'startDate' => $startDate,
                'endDate' => $endDate,
                'type' => $type,
            ],
        ]);
    }
}