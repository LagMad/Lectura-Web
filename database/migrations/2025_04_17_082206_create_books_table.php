<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('penulis');
            $table->integer('jumlah_halaman');
            $table->string('kategori')->nullable();
            $table->string('penerbit')->nullable();
            $table->string('tahun_terbit')->nullable();
            $table->string('bahasa')->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('cover_path')->nullable();
            $table->string('status');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('books');
    }
};