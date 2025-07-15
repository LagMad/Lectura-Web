<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use App\Models\StaffPerpustakaan;
use App\Models\User;
use App\Models\YoutubeVideo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function adminDashboard()
    {
        $latestUsers = User::latest()->get();
        $staff       = StaffPerpustakaan::orderBy('nama')->get();
        $pengumuman = Pengumuman::latest()->get();
        $videos = YoutubeVideo::latest()->get();

        return Inertia::render('Admin/Dashboard', [
            'users' => $latestUsers,
            'staff' => $staff,
            'pengumuman' => $pengumuman,
            'videos' => $videos
        ]);
    }
}
