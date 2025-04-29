<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
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