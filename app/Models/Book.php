<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'penulis',
        'jumlah_halaman',
        'kategori',
        'penerbit',
        'tahun_terbit',
        'bahasa',
        'deskripsi',
        'cover_path',
        'status',
        'link'
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}