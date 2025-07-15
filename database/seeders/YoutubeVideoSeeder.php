<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\YoutubeVideo;

class YoutubeVideoSeeder extends Seeder
{
    public function run()
    {
        YoutubeVideo::insert([
            [
                'judul' => 'Teknik Membaca untuk Pelajar Muda',
                'link' => 'https://www.youtube.com/watch?v=1oK6uqHd8tU',
                'pengunggah' => 'Puma Rymba',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Petualangan Puma: Episode 1',
                'link' => 'https://youtu.be/M7lc1UVf-VE',
                'pengunggah' => 'Puma Rymba',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul' => 'Belajar Alfabet',
                'link' => 'https://youtu.be/3JZ_D3ELwOQ',
                'pengunggah' => 'Rymba Media',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
