<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Book extends Model
{
    use HasFactory;

    protected $table = 'books';

    protected $fillable = [
        'title',
        'isbn',
        'category_id',
        'year',
        'cover_image',
        'pdf_link',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
