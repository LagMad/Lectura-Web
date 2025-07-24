<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ValidNIPD;
use Inertia\Inertia;

class NIPDController extends Controller
{
    // public function index()
    // {
    //     $nipdList = ValidNIPD::orderBy('created_at', 'desc')->get();
        
    //     return Inertia::render('Admin/Pengguna', [
    //         'nipdList' => $nipdList
    //     ]);
    // }

    public function store(Request $request)
    {
        $request->validate([
            'nipd' => 'required|string|unique:valid_nipds,nipd',
            'is_registered' => 'boolean'
        ]);

        ValidNIPD::create([
            'nipd' => $request->nipd,
            'is_registered' => $request->is_registered ?? false
        ]);

        return redirect()->back()->with('success', 'NIPD berhasil ditambahkan');
    }

    public function update(Request $request, ValidNIPD $nipd)
    {
        $request->validate([
            'nipd' => 'required|string|unique:valid_nipds,nipd,' . $nipd->id,
            'is_registered' => 'boolean'
        ]);

        $nipd->update([
            'nipd' => $request->nipd,
            'is_registered' => $request->is_registered ?? false
        ]);

        return redirect()->back()->with('success', 'NIPD berhasil diperbarui');
    }

    public function destroy(ValidNIPD $nipd)
    {
        $nipd->delete();
        
        return redirect()->back()->with('success', 'NIPD berhasil dihapus');
    }

    public function validateNipd(Request $request)
    {
        $nipd = $request->input('nipd');
        
        $validNipd = ValidNIPD::where('nipd', $nipd)
            ->where('is_registered', 0)
            ->first();
        
        if ($validNipd) {
            return response()->json([
                'valid' => true,
                'message' => 'NIPD valid dan tersedia untuk registrasi.'
            ]);
        }
        
        return response()->json([
            'valid' => false,
            'message' => 'NIPD tidak valid atau sudah terdaftar.'
        ]);
    }
}