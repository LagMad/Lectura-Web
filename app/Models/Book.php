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
        'status',
        'karya_oleh',
        'cover_path',
        'cloudinary_public_id',
        'link',
        'gdrive_file_id',
        'original_filename'
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function jurnaling()
    {
        return $this->hasMany(Jurnaling::class, 'id_buku');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
    
    public function isFavoritedByUser($userId)
    {
        return $this->favorites()
            ->where('user_id', $userId)
            ->exists();
    }
}