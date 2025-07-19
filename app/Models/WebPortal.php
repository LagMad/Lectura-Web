<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebPortal extends Model
{
    use HasFactory;

    protected $table = 'web_portals';

    protected $fillable = [
        'nama',
        'web_link',
        'deskripsi',
        'image_path',
        'cloudinary_public_id',
        'is_active',
    ];
}