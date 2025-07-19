<?php

namespace App\Http\Controllers;

use App\Models\FaqQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FaqController extends Controller
{
    /**
     * Display the FAQ page (answered questions only).
     */
    public function index(Request $request)
    {
        $search = $request->string('search');

        $faqList = FaqQuestion::answered()          // scope from your model
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('pertanyaan', 'like', "%{$search}%")
                        ->orWhere('jawaban', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('updated_at')
            ->get([
                'pertanyaan as question',   // rename for the front‑end
                'jawaban     as answer',
                'kategori as category',
                'updated_at',
                'created_at'
            ]);

        return Inertia::render('Bantuan', [
            'faqList'     => $faqList,
            'searchQuery' => $search,
        ]);
    }

    public function adminIndex(Request $request)
    {
        $search = $request->string('search');

        $faqList = FaqQuestion::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('pertanyaan', 'like', "%{$search}%")
                        ->orWhere('jawaban', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('updated_at')
            ->get([
                'id',
                'pertanyaan as question',
                'jawaban as answer',
                'kategori as category',
                'nama',
                'nipd',
                'status',
                'admin_id',
                'updated_at',
                'created_at'
            ]);

        return Inertia::render('Admin/Pengguna', [
            'faqList'     => $faqList,
            'searchQuery' => $search,
        ]);
    }

    /**
     * Store a user‑submitted question (status = pending).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama'       => 'required|string|max:255',
            'nipd'        => 'required|string|max:20',
            'pertanyaan' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        FaqQuestion::create([
            'nama'       => $request->nama,
            'nipd'        => $request->nipd,
            'pertanyaan' => $request->pertanyaan,
            'status'     => 'pending',
        ]);

        return back()->with('success', 'Pertanyaan berhasil dikirim!');
    }

    /**
     * Show the form for editing the specified review.
     *
     * @param  int  $id
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function edit(FaqQuestion $faq)
    {
        // You can create an Inertia page like resources/js/Pages/Faq/Edit.jsx
        return Inertia::render('Faq/Edit', ['faq' => $faq]);
    }

    public function adminStore(Request $request)
    {
        $this->validateInput($request);          // gunakan validator yang sudah ada

        FaqQuestion::create([
            'nama'       => $request->nama,
            'nipd'       => $request->nipd,
            'pertanyaan' => $request->pertanyaan,
            'jawaban'    => $request->jawaban,
            'status'     => 'answered',          // langsung answered
            'kategori'   => $request->kategori,
            'admin_id'   => auth()->id(),
        ]);

        return back()->with('success', 'FAQ berhasil ditambahkan!');
    }


    public function adminUpdate(Request $request, FaqQuestion $faq)
    {
        $this->validateInput($request, true);

        $faq->update([
            'nama'       => $request->nama,
            'nipd'       => $request->nipd,
            'pertanyaan' => $request->pertanyaan,
            'jawaban'    => $request->jawaban,
            'status'     => $request->status ?? $faq->status,
            'kategori'   => $request->kategori ?? $faq->kategori,
            'admin_id'   => auth()->id(), // log who edited
        ]);

        return redirect()->route('users.admin', $faq)->with('success', 'FAQ berhasil diperbarui!');
    }

    public function adminDestroy(FaqQuestion $faq)
    {
        $faq->delete();   // SoftDeletes? add SoftDeletes trait to model if needed
        return redirect()->route('users.admin')->with('success', 'FAQ dihapus.');
    }

    protected function validateInput(Request $request, bool $isUpdate = false): void
    {
        $rules = [
            'nama'       => 'required|string|max:255',
            'nipd'       => 'required|string|max:20',
            'pertanyaan' => 'required|string|max:1000',
        ];

        if ($isUpdate) {
            $rules += [
                'jawaban'  => 'nullable|string|max:2000',
                'status'   => 'in:pending,answered,rejected',
                'kategori' => 'nullable|string|max:255',
            ];
        }

        Validator::make($request->all(), $rules)->validate();
    }
}
