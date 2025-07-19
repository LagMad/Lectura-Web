<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('web_portals', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('web_link');
            $table->string('deskripsi')->nullable();
            $table->string('image_path')->nullable();
            $table->string('cloudinary_public_id')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('web_portals');
    }
};
