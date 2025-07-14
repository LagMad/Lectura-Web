<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use App\Services\GoogleDriveService;

class PengumumanController extends Controller
{
    protected Cloudinary $cloudinary;
    protected GoogleDriveService $googleDrive;

    public function __construct(GoogleDriveService $googleDrive)
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

        $this->googleDrive = $googleDrive;
    }

    /* ---------- LIST ---------- */
    public function index()
    {
        return Inertia::render('Admin/Pengumuman/Index', [
            'pengumuman' => Pengumuman::latest()->get(),
        ]);
    }

    /* ---------- STORE ---------- */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul'   => 'required|string|max:255',
            'penulis' => 'required|string|max:255',
            'image'   => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'file'    => 'nullable|file|max:10240',          // 10 MB
        ]);

        $data = $request->only(['judul', 'penulis']);
        $data['is_active'] = $request->boolean('is_active');


        /* === UPLOAD GAMBAR ke Cloudinary === */
        if ($request->hasFile('image')) {
            try {
                $upload = $this->cloudinary->uploadApi()->upload(
                    $request->file('image')->getRealPath(),
                    [
                        'folder'         => 'perpustakaan/pengumuman',
                        'resource_type'  => 'image',
                        'access_mode'    => 'public',
                    ]
                );

                $data['image_path']           = $upload['secure_url'];
                $data['cloudinary_public_id'] = $upload['public_id'];
            } catch (\Throwable $e) {
                Log::error('Cloudinary upload error: ' . $e->getMessage());
                return back()->withErrors(['image' => 'Gagal upload gambar']);
            }
        }

        /* === UPLOAD FILE (pdf/dll) ke Drive === */
        if ($request->hasFile('file')) {
            try {
                $file = $request->file('file');
                $name = Str::slug($request->judul) . '.' . $file->getClientOriginalExtension();

                $drive = $this->googleDrive->uploadFile($file, $name);

                $data['link']              = $drive['webViewLink'];
                $data['gdrive_file_id']    = $drive['id'];
                $data['original_filename'] = $file->getClientOriginalName();
            } catch (\Throwable $e) {
                Log::error('Drive upload error: ' . $e->getMessage());
                return back()->withErrors(['file' => 'Gagal upload file']);
            }
        }

        Pengumuman::create($data);

        return back()->with('success', 'Pengumuman berhasil ditambahkan');
    }

    /* ---------- UPDATE ---------- */
    public function update(Request $request, $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);

        $validated = $request->validate([
            'judul'   => 'required|string|max:255',
            'penulis' => 'required|string|max:255',
            'image'   => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'file'    => 'nullable|file|max:10240',
        ]);

        $data = $request->only(['judul', 'penulis', 'is_active']);


        /* ---- ganti gambar jika ada ---- */
        if ($request->hasFile('image')) {
            try {
                if ($pengumuman->cloudinary_public_id) {
                    $this->cloudinary->uploadApi()->destroy(
                        $pengumuman->cloudinary_public_id,
                        ['resource_type' => 'image']
                    );
                }

                $upload = $this->cloudinary->uploadApi()->upload(
                    $request->file('image')->getRealPath(),
                    [
                        'folder'        => 'perpustakaan/pengumuman',
                        'resource_type' => 'image',
                        'access_mode'   => 'public',
                    ]
                );

                $data['image_path']           = $upload['secure_url'];
                $data['cloudinary_public_id'] = $upload['public_id'];
            } catch (\Throwable $e) {
                Log::error('Cloudinary update error: ' . $e->getMessage());
                return back()->withErrors(['image' => 'Gagal upload gambar']);
            }
        }

        /* ---- ganti file jika ada ---- */
        if ($request->hasFile('file')) {
            try {
                if ($pengumuman->gdrive_file_id) {
                    $this->googleDrive->deleteFile($pengumuman->gdrive_file_id);
                }

                $file = $request->file('file');
                $name = Str::slug($request->judul) . '.' . $file->getClientOriginalExtension();

                $drive = $this->googleDrive->uploadFile($file, $name);

                $data['link']              = $drive['webViewLink'];
                $data['gdrive_file_id']    = $drive['id'];
                $data['original_filename'] = $file->getClientOriginalName();
            } catch (\Throwable $e) {
                Log::error('Drive update error: ' . $e->getMessage());
                return back()->withErrors(['file' => 'Gagal upload file']);
            }
        }

        $pengumuman->update($data);

        return back()->with('success', 'Pengumuman berhasil diperbarui.');
    }

    /* ---------- DELETE ---------- */
    public function destroy($id)
    {
        $pengumuman = Pengumuman::findOrFail($id);

        try {
            if ($pengumuman->cloudinary_public_id) {
                $this->cloudinary->uploadApi()->destroy(
                    $pengumuman->cloudinary_public_id,
                    ['resource_type' => 'image']
                );
            }

            if ($pengumuman->gdrive_file_id) {
                $this->googleDrive->deleteFile($pengumuman->gdrive_file_id);
            }

            $pengumuman->delete();

            return back()->with('success', 'Pengumuman berhasil dihapus');
        } catch (\Throwable $e) {
            Log::error('Delete pengumuman error: ' . $e->getMessage());
            return back()->with('error', 'Gagal menghapus pengumuman');
        }
    }
}
