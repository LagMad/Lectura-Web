<?php

namespace App\Http\Controllers;

use App\Models\FaqQuestion;
use Inertia\Inertia;
use App\Models\User;
use App\Models\ValidNIPD;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class PenggunaController extends Controller
{
    public function index(Request $request)
    {
        /* ---------- 1. QUERY USERS ---------- */
        $userQuery = User::query();

        if ($request->filled('search')) {
            $term = $request->search;
            $userQuery->where(function ($q) use ($term) {
                $q->where('name',  'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%");
            });
        }

        if ($request->filled('role')) {
            $userQuery->where('role', $request->role);
        }

        if ($request->filled('status')) {
            $userQuery->whereRaw('LOWER(status) = ?', [strtolower($request->status)]);
        }

        $users = $userQuery->latest()->paginate(10)->appends($request->all());

        /* ---------- 2. QUERY FAQ ---------- */
        $faqQuery = FaqQuestion::query();

        if ($request->filled('faq_search')) {
            $term = $request->faq_search;
            $faqQuery->where(function ($q) use ($term) {
                $q->where('pertanyaan', 'like', "%{$term}%")
                    ->orWhere('jawaban',   'like', "%{$term}%");
            });
        }

        if ($request->filled('faq_status')) {
            $faqQuery->where('status', $request->faq_status);   // pending / answered / rejected
        }

        $faqList = $faqQuery
            ->orderByDesc('updated_at')
            ->get(['id', 'nama', 'nipd', 'pertanyaan', 'jawaban', 'status', 'kategori', 'created_at', 'updated_at']);

        $nipdList = ValidNIPD::orderByDesc(("created_at"))->get();

        /* ---------- 3. RENDER ONE PAGE ---------- */
        return Inertia::render('Admin/Pengguna', [
            'users'      => $users,
            'faqList'    => $faqList,
            'nipdList' => $nipdList,
            // opsional: kirim filter utk dipakai di front‑end
            'userFilters' => $request->only(['search', 'role', 'status']),
            'faqFilters' => $request->only(['faq_search', 'faq_status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/TambahPengguna');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'status' => $validated['status'],
            'nipd' => $this->generateNipd(),
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('users.admin')->with('success', 'Pengguna berhasil ditambahkan!');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/EditPengguna', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'status' => $validated['status'],
        ];

        // Only update password if provided
        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        return redirect()->route('users.admin')->with('success', 'Pengguna berhasil diperbarui!');
    }

    public function destroy(User $user)
    {
        // Only update ValidNIPD if nipd exists and ValidNIPD table exists
        if ($user->nipd) {
            try {
                ValidNIPD::where('nipd', $user->nipd)->update(['is_registered' => 0]);
            } catch (\Exception $e) {
                // Handle if ValidNIPD table doesn't exist or other errors
                \Log::warning('Could not update ValidNIPD table: ' . $e->getMessage());
            }
        }

        $user->delete();

        return redirect()->route('users.admin')->with('success', 'Pengguna berhasil dihapus!');
    }

    private function generateNipd()
    {
        // Generate NIPD berdasarkan timestamp atau logika tertentu
        $lastUser = User::orderBy('id', 'desc')->first();
        $nextId = $lastUser ? $lastUser->id + 1 : 1;
        
        return str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
}