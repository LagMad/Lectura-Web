<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\JurnalingController;
use App\Http\Controllers\NIPDController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\HomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:admin,guru'])->group(function () {
    Route::get('/admin-tambah-buku', [BookController::class, 'create'])->name('books.create');
    Route::post('/simpan-buku', [BookController::class, 'store'])->name('books.store');
    Route::get('/admin-edit-buku/{book}', [BookController::class, 'edit'])->name('books.edit');
    Route::put('/update-buku/{book}', [BookController::class, 'update'])->name('books.update');
    Route::delete('/hapus-buku/{book}', [BookController::class, 'destroy'])->name('books.destroy');
    Route::get('/admin-buku', [BookController::class, 'adminBuku'])->name('books.admin');

    Route::get('/jurnal/book/{book_id}', [JurnalingController::class, 'detail'])->name('jurnal.book.detail');
    Route::get('/jurnal/{book_id}/{user_id}', [JurnalingController::class, 'detailJurnal'])->name('jurnal.detail');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin-pengguna', [PenggunaController::class, 'index'])->name('users.admin');
    Route::delete('/hapus-user/{user}', [PenggunaController::class, 'destroy'])->name('users.destroy');
    Route::get('/admin-pengaturan', function () {
        return Inertia::render('Admin/Pengaturan');
    });
    Route::post('/kategori', [KategoriController::class, 'store'])->name('kategori.store');
    Route::delete('/kategori/{id}', [KategoriController::class, 'destroy'])->name('kategori.destroy');
});


Route::post('/validate-nipd', [NIPDController::class, 'validateNipd']);

Route::middleware('auth')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/buku', [BookController::class, 'index'])->name('books.index');
    Route::get('/detail-buku/{book}', [BookController::class, 'show'])->name('books.show');

    Route::get('/bantuan', function () {
        return Inertia::render('Bantuan');
    });

    Route::get('/tentang', function () {
        return Inertia::render('Tentang');
    });

    Route::post('/favorites', [FavoriteController::class, 'create'])->name('favorites.create');
    Route::delete('/favorites', [FavoriteController::class, 'destroy'])->name('favorites.destroy');

    
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    });
    Route::get('/semua-jurnal', function () {
        return Inertia::render('Dashboard/AllJournal');
    });

});

require __DIR__.'/auth.php';

