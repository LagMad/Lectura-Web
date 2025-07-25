<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YoutubeVideo extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'link',
        'pengunggah',
        'created_by',
        'is_active',
    ];
}
