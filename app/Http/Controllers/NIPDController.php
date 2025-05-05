<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ValidNIPD;


class NIPDController extends Controller
{
    public function validateNipd(Request $request)
    {
        $nipd = $request->input('nipd');
        
        $validNipd = ValidNIPD::where('nipd', $nipd)
            ->where('is_registered', false)
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
