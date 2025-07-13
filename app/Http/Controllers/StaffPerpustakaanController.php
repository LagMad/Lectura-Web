<?php

namespace App\Http\Controllers;

use App\Models\StaffPerpustakaan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use App\Services\GoogleDriveService;

class StaffPerpustakaanController extends Controller
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

    /* ============================================================
     |  INDEX – list staff  (GET /admin/staff)
     * ============================================================*/
    public function index(Request $request)
    {
        $search = $request->string('search');

        $staff = StaffPerpustakaan::when($search, function ($q) use ($search) {
            $q->where('nama', 'like', "%{$search}%")
                ->orWhere('jabatan', 'like', "%{$search}%");
        })
            ->orderBy('nama')
            ->get();

        return Inertia::render('Admin/Staff/Index', [
            'staff'      => $staff,
            'searchTerm' => $search,
        ]);
    }

    /* ============================================================
     |  CREATE – show create form (GET /admin/staff/create)
     * ============================================================*/
    public function create()
    {
        return Inertia::render('Admin/Staff/Create');
    }

    /* ============================================================
     |  STORE – save new staff (POST /admin/staff)
     * ============================================================*/
    public function store(Request $request)
    {
        $request->validate([
            'nama'    => ['required', 'string', 'max:255'],
            'jabatan' => ['required', 'string', 'max:255'],
            'photo'   => ['nullable', 'image', 'mimes:jpeg,jpg,png', 'max:2048'],
            'file_cv' => ['nullable', 'file', 'max:10240'],
        ]);

        $data = $request->only(['nama', 'jabatan']);

        /* ---- handle photo upload ---- */
        if ($request->hasFile('photo')) {
            try {
                $upload = $this->cloudinary->uploadApi()->upload(
                    $request->file('photo')->getRealPath(),
                    [
                        'folder'         => 'perpustakaan/staff',
                        'transformation' => ['width' => 500, 'height' => 500, 'crop' => 'fill'],
                        'resource_type'  => 'image',
                        'access_mode'    => 'public',
                    ]
                );

                $data['photo_path']           = $upload['secure_url'];
                $data['cloudinary_public_id'] = $upload['public_id'];
            } catch (\Throwable $e) {
                Log::error('Cloudinary upload error: ' . $e->getMessage());
                return back()->withErrors(['photo' => 'Gagal upload foto']);
            }
        }

        /* ---- handle CV file upload ---- */
        if ($request->hasFile('file_cv')) {
            try {
                $file = $request->file('file_cv');
                $name = sprintf(
                    '%s-%s.%s',
                    Str::slug($request->nama),
                    Str::slug($request->jabatan),
                    $file->getClientOriginalExtension()
                );

                $drive = $this->googleDrive->uploadFile($file, $name);

                $data['link']              = $drive['webViewLink'];
                $data['gdrive_file_id']    = $drive['id'];
                $data['original_filename'] = $file->getClientOriginalName();
            } catch (\Throwable $e) {
                Log::error('Drive upload error: ' . $e->getMessage());
                return back()->withErrors(['file_cv' => 'Gagal upload file CV']);
            }
        }

        StaffPerpustakaan::create($data);

        return back()->with('success', 'Staff berhasil ditambahkan');
    }

    /* ============================================================
     |  EDIT – show edit form (GET /admin/staff/{staff})
     * ============================================================*/
    public function edit(StaffPerpustakaan $staff)
    {
        return Inertia::render('Admin/Staff/Edit', [
            'staff' => $staff
        ]);
    }

    /* ============================================================
     |  UPDATE  (PUT /admin/staff/{staff})
     * ============================================================*/
    /* ============================================================
 |  UPDATE  (PUT /admin/staff/{staff})
 * ============================================================*/
    public function update(Request $request, $id)
    {
        $staff = StaffPerpustakaan::findOrFail($id);

        /* ---------- 1. VALIDASI ---------- */
        $validated = $request->validate([
            'nama'    => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'photo'   => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'file_cv' => 'nullable|file|max:10240',           // 10 MB
        ]);

        // Log::info('Staff update request:', $request->except(['photo', 'file_cv']));
        // Log::info('Staff before update:', $staff->toArray());

        $data = $request->except(['photo', 'file_cv', '_method', '_token']);

        /* ---------- 2. HANDLE FOTO ---------- */
        if ($request->hasFile('photo')) {
            try {
                // hapus foto lama
                if ($staff->cloudinary_public_id) {
                    $this->cloudinary->uploadApi()->destroy(
                        $staff->cloudinary_public_id,
                        ['resource_type' => 'image']
                    );
                    Log::info('Old photo deleted from Cloudinary', [
                        'public_id' => $staff->cloudinary_public_id
                    ]);
                }

                $upload = $this->cloudinary->uploadApi()->upload(
                    $request->file('photo')->getRealPath(),
                    [
                        'folder'         => 'perpustakaan/staff',
                        'transformation' => ['width' => 500, 'height' => 500, 'crop' => 'fill'],
                        'resource_type'  => 'image',
                        'access_mode'    => 'public',
                    ]
                );

                $data['photo_path']           = $upload['secure_url'];
                $data['cloudinary_public_id'] = $upload['public_id'];

                Log::info('New photo uploaded:', [
                    'public_id' => $upload['public_id'],
                    'url'       => $upload['secure_url'],
                ]);
            } catch (\Throwable $e) {
                Log::error('Cloudinary error: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Error handling photo: ' . $e->getMessage(),
                ], 500);
            }
        }

        /* ---------- 3. HANDLE FILE CV ---------- */
        if ($request->hasFile('file_cv')) {
            try {
                // hapus file lama di Drive
                if ($staff->gdrive_file_id) {
                    $this->googleDrive->deleteFile($staff->gdrive_file_id);
                    Log::info('Old CV deleted from Drive', [
                        'file_id' => $staff->gdrive_file_id,
                    ]);
                }

                $file = $request->file('file_cv');
                $name = sprintf(
                    '%s-%s.%s',
                    Str::slug($request->nama),
                    Str::slug($request->jabatan),
                    $file->getClientOriginalExtension()
                );

                $drive = $this->googleDrive->uploadFile($file, $name);

                $data['link']              = $drive['webViewLink'];
                $data['gdrive_file_id']    = $drive['id'];
                $data['original_filename'] = $file->getClientOriginalName();

                Log::info('New CV uploaded to Drive', [
                    'file_id' => $drive['id'],
                    'link'    => $drive['webViewLink'],
                ]);
            } catch (\Throwable $e) {
                Log::error('Drive error: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Error handling CV file: ' . $e->getMessage(),
                ], 500);
            }
        }

        /* ---------- 4. SIMPAN ---------- */
        $updated = $staff->update($data);

        Log::info('Staff after update:', $staff->fresh()->toArray());
        Log::info('Update successful: ' . ($updated ? 'Yes' : 'No'));

        return redirect()->back()->with('success', 'Data staf berhasil diperbarui.');

    }


    /* ============================================================
     |  DESTROY – delete staff (DELETE /admin/staff/{staff})
     * ============================================================*/
    public function destroy(StaffPerpustakaan $staff)
    {
        try {
            // hapus foto di Cloudinary
            if ($staff->cloudinary_public_id) {
                $this->cloudinary->uploadApi()->destroy(
                    $staff->cloudinary_public_id,
                    ['resource_type' => 'image']
                );
            }

            // hapus file di Google Drive
            if ($staff->gdrive_file_id) {
                $this->googleDrive->deleteFile($staff->gdrive_file_id);
            }

            $staff->delete();

            return back()->with('success', 'Staf berhasil dihapus');
        } catch (\Throwable $e) {
            Log::error('Delete staff error: ' . $e->getMessage());
            return back()->with('error', 'Gagal menghapus staf: ' . $e->getMessage());
        }
    }

    /* ============================================================
     |  ADMIN DASHBOARD
     * ============================================================*/
    public function adminDashboard()
    {
        $latestUsers = User::latest()->get();
        $staff       = StaffPerpustakaan::orderBy('nama')->get();

        return Inertia::render('Admin/Dashboard', [
            'users' => $latestUsers,   // dipakai komponen Statistik / TabelKonten
            'staff' => $staff,         // dipakai komponen <StaffPerpustakaan />
        ]);
    }
}
