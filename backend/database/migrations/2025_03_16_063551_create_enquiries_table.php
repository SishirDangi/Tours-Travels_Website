<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 100)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('message')->nullable();

            // Add status_id (foreign key to statuses table)
            $table->unsignedBigInteger('status_id')->default(1);
            $table->foreign('status_id')->references('id')->on('statuses');

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::table('enquiries', function (Blueprint $table) {
            $table->dropForeign(['status_id']);
        });

        Schema::dropIfExists('enquiries');
    }
};
