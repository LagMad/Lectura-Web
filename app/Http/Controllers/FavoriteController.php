<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Add a book to user's favorites
     */
    public function create(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
        ]);

        // Check if already in favorites to prevent duplicates
        $existingFavorite = Favorite::where('user_id', auth()->id())
            ->where('book_id', $validated['book_id'])
            ->first();

        if (!$existingFavorite) {
            Favorite::create([
                'user_id' => auth()->id(),
                'book_id' => $validated['book_id'],
            ]);

            return redirect()->back()->with('message', 'Buku berhasil ditambahkan ke favorit.');
        }

        return redirect()->back()->with('message', 'Buku sudah ada di daftar favorit Anda.');
    }

    /**
     * Remove a book from user's favorites
     */
    public function destroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
        ]);

        Favorite::where('user_id', auth()->id())
            ->where('book_id', $validated['book_id'])
            ->delete();

        return redirect()->back()->with('message', 'Buku berhasil dihapus dari favorit.');
    }
}