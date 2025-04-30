<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/buku', function () {
    return Inertia::render('Buku');
});

Route::get('/bantuan', function () {
    return Inertia::render('Bantuan');
});

Route::get('/tentang', function () {
    return Inertia::render('Tentang');
});

Route::get('/admin-pengguna', function () {
    return Inertia::render('Admin/Pengguna');
});

Route::get('/admin-buku', function () {
    return Inertia::render('Admin/Buku');
});

Route::get('/admin-tambah-buku', function () {
    return Inertia::render('Admin/TambahBuku');
});

Route::get('/admin-pengaturan', function () {
    return Inertia::render('Admin/Pengaturan');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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