<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->date('booking_date');
            $table->time('booking_time');
            $table->decimal('total_price', 10, 2);
            $table->decimal('discount', 10, 2);
            $table->unsignedBigInteger('contact_id');
            $table->unsignedBigInteger('package_id');
            $table->unsignedBigInteger('status_id')->nullable();
            $table->timestamps();

            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');
            $table->foreign('package_id')->references('id')->on('packages')->onDelete('cascade');
            $table->foreign('status_id')->references('id')->on('statuses')->onDelete('set null');
        });
    }

    public function down(): void {
        Schema::dropIfExists('bookings');
    }
};
