<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pengumuman extends Model
{
    use HasFactory;

    protected $table = 'pengumuman';

    protected $fillable = [
        'judul',
        'penulis',
        'image_path',
        'cloudinary_public_id',
        'link',
        'gdrive_file_id',
        'original_filename',
        'is_active',
    ];
}
