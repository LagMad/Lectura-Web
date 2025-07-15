<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffPerpustakaan extends Model
{
    use HasFactory;

    protected $table = 'staff_perpustakaan';

    protected $fillable = [
        'nama',
        'jabatan',
        'photo_path',
        'cloudinary_public_id',
        'link',
        'gdrive_file_id',
        'original_filename'
    ];

    // Add this method to help with route model binding
    public function getRouteKeyName()
    {
        return 'id';
    }
}