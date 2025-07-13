<?php

namespace App\Http\Controllers;

use App\Models\StaffPerpustakaan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TentangController extends Controller
{
    public function index(Request $request)
    {
        // If you want simple ordering:
        $staff = StaffPerpustakaan::query()->get();

        // — or, if you expect dozens/hundreds and want pagination —
        // $staff = StaffPerpustakaan::orderBy('nama')->paginate(20);

        return Inertia::render('Tentang', [
            'staff' => $staff,
        ]);
    }
}
