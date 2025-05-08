<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jurnaling', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_buku')->constrained('books')->onDelete('cascade');
            $table->foreignId('id_siswa')->constrained('users')->onDelete('cascade');
            $table->integer('halaman_awal');
            $table->integer('halaman_akhir');
            $table->text('deskripsi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jurnaling');
    }
};