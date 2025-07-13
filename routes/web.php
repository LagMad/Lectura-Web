<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\JurnalingController;
use App\Http\Controllers\NIPDController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\StaffPerpustakaanController;
use App\Http\Controllers\TentangController;
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
    Route::get('/admin-dashboard', [StaffPerpustakaanController::class, 'adminDashboard'])->name('admin.dashboard');

    Route::get('/jurnal/book/{book_id}', [JurnalingController::class, 'detail'])->name('jurnal.book.detail');
    Route::get('/jurnal/{book_id}/{user_id}', [JurnalingController::class, 'detailJurnal'])->name('jurnal.detail');

    // Route::get('/admin/faq-questions', [FaqController::class, 'adminIndex'])->name('admin.faq.index');
    Route::put('/admin/faq-questions/{faq}', [FaqController::class, 'adminUpdate'])->name('admin.faq.update');
    Route::delete('/admin/faq-questions/{faq}', [FaqController::class, 'adminDestroy'])->name('admin.faq.destroy');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin-pengguna', [PenggunaController::class, 'index'])->name('users.admin');
    Route::delete('/hapus-user/{user}', [PenggunaController::class, 'destroy'])->name('users.destroy');
    Route::get('/admin-pengaturan', function () {
        return Inertia::render('Admin/Pengaturan');
    });
    Route::post('/kategori', [KategoriController::class, 'store'])->name('kategori.store');
    Route::delete('/kategori/{id}', [KategoriController::class, 'destroy'])->name('kategori.destroy');

    Route::get('/staff',            [StaffPerpustakaanController::class, 'index'])->name('staff.index');
    Route::get('/staff/create',     [StaffPerpustakaanController::class, 'create'])->name('staff.create');
    Route::post('/staff',            [StaffPerpustakaanController::class, 'store'])->name('staff.store');
    Route::get('/staff/{staff}',    [StaffPerpustakaanController::class, 'edit'])->name('staff.edit');
    Route::put('/staff/{staff}', [StaffPerpustakaanController::class, 'update'])->name('staff.update');
    Route::delete('/staff/{staff}',    [StaffPerpustakaanController::class, 'destroy'])->name('staff.destroy');
});


Route::post('/validate-nipd', [NIPDController::class, 'validateNipd']);

Route::middleware('auth')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/buku', [BookController::class, 'index'])->name('books.index');
    Route::get('/detail-buku/{book}', [BookController::class, 'show'])->name('books.show');
    Route::put('/{id}', [JurnalingController::class, 'update'])->name('jurnal.update');
    // Review routes
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    // Route::get('/bantuan', function () {
    //     return Inertia::render('Bantuan');
    // });
    Route::get('/bantuan', [FaqController::class, 'index'])->name('faq.index');
    Route::post('/faq/question', [FaqController::class, 'store'])->name('faq.store');

    Route::get('/tentang', [TentangController::class, 'index'])
        ->name('tentang');

    Route::post('/favorites', [FavoriteController::class, 'create'])->name('favorites.create');
    Route::delete('/favorites', [FavoriteController::class, 'destroy'])->name('favorites.destroy');

    Route::get('/dashboard', [BookController::class, 'dashboard'])->name('dashboard');
    Route::post('/jurnal', [JurnalingController::class, 'store'])->name('jurnal.store');
    Route::delete('/jurnal/{id}', [JurnalingController::class, 'destroy'])->name('jurnal.destroy');

    Route::get('/semua-jurnal', function () {
        return Inertia::render('Dashboard/AllJournal');
    });
});

require __DIR__ . '/auth.php';
