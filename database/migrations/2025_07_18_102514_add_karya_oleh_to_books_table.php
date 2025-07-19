<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->enum('karya_oleh', ['Siswa', 'Guru', 'Koleksi Perpustakaan'])->default('Koleksi Perpustakaan');
        });
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn('karya_oleh');
        });
    }
};
