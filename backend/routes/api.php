<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\OtpController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PackageDetailController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\GuideController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\EnquiryController;
use App\Http\Controllers\PaymentStatusController;
use App\Models\Status;
use App\Http\Controllers\HomePageDetailController;
// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/register', [RegisterController::class, 'register']);
<<<<<<< HEAD
Route::post('/verify-otp', [OtpController::class, 'verifyOtp']);

// User data
Route::get('users/count', [UserController::class, 'count']);
Route::get('/user', [AuthController::class, 'getUser']);
Route::resource('users', UserController::class)->only(['index', 'update', 'destroy']);

// Password change route
Route::middleware('auth:sanctum')->post('/user/change-password', [UserController::class, 'changePassword']);

// Booking
Route::get('bookings/count', [BookingController::class, 'count']);
Route::apiResource('bookings', BookingController::class);
Route::get('/active-tours', [BookingController::class, 'activeTourBookings']);

// Contact
Route::get('contacts/count', [ContactController::class, 'count']);
Route::get('/contact', [ContactController::class, 'getContact']);
Route::put('/contacts/{id}', [ContactController::class, 'update']);

Route::get('/packages/random', [PackageController::class, 'getRandomPackages']);
// Packages
Route::get('packages/count', [PackageController::class, 'count']);
=======

Route::get('bookings/count', [BookingController::class, 'count']);

Route::apiResource('bookings', BookingController::class);

Route::get('packages/count', [PackageController::class, 'count']);

>>>>>>> cd458b64ddb6588f48dd19c9fe4a8eef7f29b135
Route::apiResource('packages', PackageController::class);
Route::get('/packages/{id}/details', [PackageController::class, 'getDetails']);


// Package Details
Route::post('/package-details/{packageId}', [PackageDetailController::class, 'store']);
Route::get('/package-details/{packageId}', [PackageDetailController::class, 'show']);
Route::delete('/package-details/{packageId}', [PackageDetailController::class, 'destroy']);


<<<<<<< HEAD
// Guides
=======
>>>>>>> cd458b64ddb6588f48dd19c9fe4a8eef7f29b135
Route::get('guides/count', [GuideController::class, 'count']);
Route::apiResource('guides', GuideController::class);

// Countries
Route::get('/countries', [CountryController::class, 'index']);

// Payment Status
Route::get('payment-statuses', [PaymentStatusController::class, 'index']);

// Statuses (all)
Route::get('/statuses', function () {
    return Status::all();
});

// Enquiries
Route::controller(EnquiryController::class)->group(function () {
    Route::get('/enquiries/count', 'count');
    Route::get('/enquiries', 'index');
    Route::post('/enquiries', 'store');
    Route::put('/enquiries/{id}/resolve', 'resolve');
    
});

// Dashboards (with auth)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user-dashboard', [UserController::class, 'index'])->middleware('role:user');
    Route::get('/admin-dashboard', [AuthController::class, 'index'])->middleware('role:admin');
});

<<<<<<< HEAD
Route::apiResource('home-page-details', HomePageDetailController::class);

Route::middleware('auth:sanctum')->post('/admin/change-password', [UserController::class, 'changeAdminPassword']);

=======

Route::get('users/count', [UserController::class, 'count']);

Route::get('contacts/count', [ContactController::class, 'count']);
Route::get('enquiries/count', [EnquiryController::class, 'count']);

>>>>>>> cd458b64ddb6588f48dd19c9fe4a8eef7f29b135

