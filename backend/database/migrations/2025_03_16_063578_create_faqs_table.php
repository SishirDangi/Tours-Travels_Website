<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->string('question_by_email', 100);
            $table->text('answer')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('faqs');
    }
};
