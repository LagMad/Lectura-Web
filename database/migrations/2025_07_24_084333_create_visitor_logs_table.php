<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('visitor_logs', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address');
            $table->string('user_agent')->nullable();
            $table->string('page_url');
            $table->string('session_id');
            $table->timestamp('visited_at');
            $table->timestamps();
            
            $table->index(['ip_address', 'visited_at']);
            $table->index('visited_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('visitor_logs');
    }
};