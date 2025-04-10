<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('country_code', 10)->unique();
            $table->string('country_name', 100)->unique();
            $table->string('phone_code', 10)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('countries');
    }
};
