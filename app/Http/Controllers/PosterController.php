<?php

namespace App\Http\Controllers;

use App\Models\Poster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class PosterController extends Controller
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary(
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key'    => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ],
                'url' => ['secure' => true],
            ])
        );
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Poster/Index', [
            'poster' => Poster::latest()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul'     => 'required|string|max:255',
            'karya_oleh' => 'required|string|max:255',
            'image'     => 'required|image|mimes:jpeg,jpg,png|max:10240',
        ]);

        $data = $request->only(['judul', 'karya_oleh']);
        $data['is_active'] = $request->boolean('is_active');

        if ($request->hasFile('image')) {
            try {
                $upload = $this->cloudinary->uploadApi()->upload(
                    $request->file('image')->getRealPath(),
                    [
                        'folder'        => 'perpustakaan/poster',
                        'resource_type' => 'image',
                        'access_mode'   => 'public',
                    ]
                );
                $data['image_path'] = $upload['secure_url'];
                $data['cloudinary_public_id'] = $upload['public_id'];
            } catch (\Throwable $e) {
                Log::error('Cloudinary upload error: ' . $e->getMessage());
                return back()->withErrors(['image' => 'Gagal upload gambar']);
            }
        }

        Poster::create($data);
        return back()->with('success', 'Poster slogan berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $poster = Poster::findOrFail($id);

        $validated = $request->validate([
            'judul'     => 'required|string|max:255',
            'karya_oleh' => 'required|string|max:255',
            'image'     => 'nullable|image|mimes:jpeg,jpg,png|max:10240',
        ]);

        $data = $request->only(['judul', 'karya_oleh']);
        $data['is_active'] = $request->boolean('is_active');

        if ($request->hasFile('image')) {
            try {
                // Hapus gambar lama dari Cloudinary jika ada
                if ($poster->cloudinary_public_id) {
                    $this->cloudinary->uploadApi()->destroy($poster->cloudinary_public_id, ['resource_type' => 'image']);
                }

                // Upload gambar baru
                $upload = $this->cloudinary->uploadApi()->upload(
                    $request->file('image')->getRealPath(),
                    [
                        'folder'        => 'perpustakaan/poster',
                        'resource_type' => 'image',
                        'access_mode'   => 'public',
                    ]
                );

                $data['image_path'] = $upload['secure_url'];
                $data['cloudinary_public_id'] = $upload['public_id'];
            } catch (\Throwable $e) {
                Log::error('Cloudinary update error: ' . $e->getMessage());
                return back()->withErrors(['image' => 'Gagal upload gambar']);
            }
        }

        $poster->update($data);
        return back()->with('success', 'Poster slogan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $poster = Poster::findOrFail($id);

        try {
            // Hapus gambar dari Cloudinary jika ada
            if ($poster->cloudinary_public_id) {
                $this->cloudinary->uploadApi()->destroy(
                    $poster->cloudinary_public_id,
                    ['resource_type' => 'image']
                );
            }

            $poster->delete();
            return back()->with('success', 'Poster slogan berhasil dihapus');
        } catch (\Throwable $e) {
            Log::error('Delete poster error: ' . $e->getMessage());
            return back()->with('error', 'Gagal menghapus poster slogan');
        }
    }

    /**
     * Get active posters for public display
     */
    public function getActivePosters()
    {
        return Poster::active()->latest()->get();
    }

    /**
     * Toggle poster status
     */
    public function toggleStatus($id)
    {
        $poster = Poster::findOrFail($id);
        $poster->update(['is_active' => !$poster->is_active]);
        
        $status = $poster->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Poster berhasil {$status}");
    }
}