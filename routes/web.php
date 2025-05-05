<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\NIPDController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/buku', [BookController::class, 'index'])->name('books.index');
Route::get('/admin-tambah-buku', [BookController::class, 'create'])->name('books.create');
Route::post('/simpan-buku', [BookController::class, 'store'])->name('books.store');
Route::get('/detail-buku/{book}', [BookController::class, 'show'])->name('books.show');
Route::get('/edit-buku/{book}', [BookController::class, 'edit'])->name('books.edit');
Route::put('/update-buku/{book}', [BookController::class, 'update'])->name('books.update');
Route::delete('/hapus-buku/{book}', [BookController::class, 'destroy'])->name('books.destroy');
Route::get('/admin-buku', [BookController::class, 'adminBuku'])->name('books.admin');

Route::post('/validate-nipd', [NIPDController::class, 'validateNipd']);

Route::get('/bantuan', function () {
    return Inertia::render('Bantuan');
});

Route::get('/tentang', function () {
    return Inertia::render('Tentang');
});

Route::get('/admin-pengguna', function () {
    return Inertia::render('Admin/Pengguna');
});

Route::get('/admin-pengaturan', function () {
    return Inertia::render('Admin/Pengaturan');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
Route::get('/profile', function () {
    return Inertia::render('Profile');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
});