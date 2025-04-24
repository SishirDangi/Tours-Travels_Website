<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->unsignedBigInteger('booking_id');
            $table->unsignedBigInteger('payment_status_id')->default(1); // FK to payment_statuses

            // Payment details
            $table->decimal('amount', 10, 2);
            $table->string('payment_method', 50); // e.g., 'Credit Card', 'eSewa', 'Khalti'
            $table->string('transaction_id', 100)->nullable(); // third-party reference
            $table->dateTime('paid_at')->nullable(); // actual payment date & time

            $table->timestamps();

            // Constraints
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
            $table->foreign('payment_status_id')->references('id')->on('payment_statuses')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
}
