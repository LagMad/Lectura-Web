<?php

namespace App\Http\Controllers;

use App\Models\WebPortal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class WebPortalController extends Controller
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

    public function index()
    {
        return Inertia::render('Admin/WebPortal/Index', [
            'webPortals' => WebPortal::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama'      => 'required|string|max:255',
            'web_link'  => 'required|url|max:255',
            'deskripsi' => 'nullable|string|max:1000',
            'image'     => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $data = $request->only(['nama', 'web_link', 'deskripsi']);
        $data['is_active'] = $request->boolean('is_active');

        if ($request->hasFile('image')) {
            try {
                $upload = $this->cloudinary->uploadApi()->upload(
                    $request->file('image')->getRealPath(),
                    [
                        'folder'        => 'perpustakaan/web_portal',
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

        WebPortal::create($data);
        return back()->with('success', 'Web portal berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $webPortal = WebPortal::findOrFail($id);

        $validated = $request->validate([
            'nama'      => 'required|string|max:255',
            'web_link'  => 'required|url|max:255',
            'deskripsi' => 'nullable|string|max:1000',
            'image'     => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $data = $request->only(['nama', 'web_link', 'deskripsi', 'is_active']);

        if ($request->hasFile('image')) {
            try {
                if ($webPortal->cloudinary_public_id) {
                    $this->cloudinary->uploadApi()->destroy($webPortal->cloudinary_public_id, ['resource_type' => 'image']);
                }

                $upload = $this->cloudinary->uploadApi()->upload(
                    $request->file('image')->getRealPath(),
                    [
                        'folder'        => 'perpustakaan/web_portal',
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

        $webPortal->update($data);
        return back()->with('success', 'Web portal berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $webPortal = WebPortal::findOrFail($id);

        try {
            if ($webPortal->cloudinary_public_id) {
                $this->cloudinary->uploadApi()->destroy(
                    $webPortal->cloudinary_public_id,
                    ['resource_type' => 'image']
                );
            }

            $webPortal->delete();
            return back()->with('success', 'Web portal berhasil dihapus');
        } catch (\Throwable $e) {
            Log::error('Delete web portal error: ' . $e->getMessage());
            return back()->with('error', 'Gagal menghapus web portal');
        }
    }
}
