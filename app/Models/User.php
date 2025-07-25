<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'nipd',
        'status',
        'instagram',
        'x',
        'linkedin',
        'tiktok'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    
    /**
     * Cek apakah user adalah admin
     *
     * @return bool
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isGuru()
    {
        return $this->role === 'guru';
    }
    
    /**
     * Cek apakah user adalah siswa
     *
     * @return bool
     */
    public function isSiswa()
    {
        return $this->role === 'siswa';
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function jurnalings()
    {
        return $this->hasMany(Jurnaling::class, 'id_siswa');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

}