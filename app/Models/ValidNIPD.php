<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ValidNIPD extends Model
{
    use HasFactory;

    protected $table = 'valid_nipds';

    protected $fillable = [
        'nipd',
        'is_registered'
    ];
}
