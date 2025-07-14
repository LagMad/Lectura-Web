<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengumuman', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('penulis');
            $table->string('image_path')->nullable();
            $table->string('cloudinary_public_id')->nullable();
            $table->string('link')->nullable();
            $table->string('gdrive_file_id')->nullable();
            $table->string('original_filename')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('pengumuman');
    }
};
