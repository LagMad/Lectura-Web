<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaqQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'nipd',
        'pertanyaan',
        'kategori',
        'status',
        'jawaban',
        'admin_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the admin who answered this question
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Scope for answered questions
     */
    public function scopeAnswered($query)
    {
        return $query->where('status', 'answered');
    }

    /**
     * Scope for pending questions
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}