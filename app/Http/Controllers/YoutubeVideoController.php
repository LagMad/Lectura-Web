<?php

namespace App\Http\Controllers;

use App\Models\YoutubeVideo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class YoutubeVideoController extends Controller
{
    /* ---------------- INDEX ---------------- */
    public function index()
    {
        return Inertia::render('Admin/ManajemenYoutube', [
            'videos' => YoutubeVideo::latest()->get(),
        ]);
    }

    /* ---------------- STORE ---------------- */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul'      => 'required|string|max:255',
            'link'       => 'required|url',
            'pengunggah' => 'required|string|max:255',
            'is_active'  => 'boolean',
        ]);

        $validated['created_by'] = $request->user()->name;   // ⬅️ isi otomatis

        YoutubeVideo::create($validated);

        return back()->with('success', 'Video berhasil ditambahkan.');
    }

    /* ---------------- UPDATE ---------------- */
    public function update(Request $request, $id)
    {
        $video = YoutubeVideo::findOrFail($id);

        $validated = $request->validate([
            'judul'      => 'required|string|max:255',
            'link'       => 'required|url',
            'pengunggah' => 'required|string|max:255',
            'is_active'  => 'boolean',
        ]);

        // Tidak perlu ubah created_by di update
        $video->update($validated);

        return back()->with('success', 'Video berhasil diperbarui.');
    }

    /* ---------------- DESTROY ---------------- */
    public function destroy($id)
    {
        YoutubeVideo::findOrFail($id)->delete();
        return back()->with('success', 'Video berhasil dihapus.');
    }
}
