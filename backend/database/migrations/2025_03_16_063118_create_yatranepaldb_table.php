<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Roles Table
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('role_name')->unique();
            $table->timestamps();
        });

        // Countries Table
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('country_code', 10)->unique();
            $table->string('country_name', 100)->unique();
            $table->string('phone_code', 10)->nullable();
            $table->timestamps();
        });

        // Contacts Table
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('mobile_no', 20)->unique();
            $table->string('email', 100)->unique();
            $table->text('address')->nullable();
            $table->unsignedBigInteger('country_id')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('country_id')->references('id')->on('countries')->onDelete('set null');
        });

        // Users Table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('password');
            $table->dateTime('last_logged_in')->nullable();
            $table->unsignedBigInteger('contact_id')->nullable();
            $table->unsignedBigInteger('role_id');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });

        // Statuses Table
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->string('status_name')->unique();
            $table->timestamps();
        });

        // Packages Table
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('package_name');
            $table->text('package_description')->nullable();
            $table->string('package_type', 100)->nullable();
            $table->decimal('package_price', 10, 2);
            $table->string('pkg_image_path')->nullable();
            $table->unsignedBigInteger('status_id')->nullable();
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('status_id')->references('id')->on('statuses')->onDelete('set null');
        });

        // Bookings Table
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

            // Foreign key constraints
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');
            $table->foreign('package_id')->references('id')->on('packages')->onDelete('cascade');
            $table->foreign('status_id')->references('id')->on('statuses')->onDelete('set null');
        });

        // Enquiries Table
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 100)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('message')->nullable();
            $table->timestamps();
        });

        // FAQs Table
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->string('question_by_email', 100);
            $table->text('answer')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('enquiries');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('packages');
        Schema::dropIfExists('statuses');
        Schema::dropIfExists('users');
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('countries');
        Schema::dropIfExists('roles');
    }
};
