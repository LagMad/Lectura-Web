<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_perpustakaan', function (Blueprint $table) {
            $table->id();

            $table->string('nama');
            $table->string('jabatan');
            $table->string('photo_path')->nullable();
            $table->string('cloudinary_public_id')->nullable();
            $table->string('link')->nullable();
            $table->string('gdrive_file_id')->nullable();
            $table->string('original_filename')->nullable();

            // optional: who created / last edited this staff row
            // $table->unsignedBigInteger('admin_id')->nullable();
            // $table->foreign('admin_id')
            //       ->references('id')->on('users')
            //       ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_perpustakaan');
    }
};
