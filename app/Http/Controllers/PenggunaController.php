<?php

namespace App\Http\Controllers;

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
    $query = User::query();

    // Filter pencarian (nama atau email)
    if ($request->filled('search')) {
        $searchTerm = $request->search;
        $query->where(function ($q) use ($searchTerm) {
            $q->where('name', 'like', "%{$searchTerm}%")
              ->orWhere('email', 'like', "%{$searchTerm}%");
        });
    }

    // Filter berdasarkan role
    if ($request->filled('role')) {
        $query->where('role', $request->role);
    }

    // Filter berdasarkan status
    if ($request->filled('status')) {
        $status = strtolower($request->status);
        $query->whereRaw('LOWER(status) = ?', [$status]);
    }
    

    // Ambil user dengan pagination
    $users = $query->latest()->paginate(10)->appends($request->all());

    return Inertia::render('Admin/Pengguna', [
        'users' => $users,
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
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('users.index')->with('success', 'Pengguna berhasil ditambahkan!');
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

        return redirect()->route('users.index')->with('success', 'Pengguna berhasil diperbarui!');
    }

    public function destroy(User $user)
    {
        ValidNIPD::where('nipd', $user->nipd)->update(['is_registered' => 0]);

        $user->delete();

        return redirect()->route('users.admin')->with('success', 'Pengguna berhasil dihapus!');
    }
}