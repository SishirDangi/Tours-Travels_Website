<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

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

Route::get('/contact', [ContactController::class, 'getContact']);

Route::post('/verify-otp', [OtpController::class, 'verifyOtp']);
Route::post('/register', [RegisterController::class, 'register']);
Route::apiResource('bookings', BookingController::class);
Route::apiResource('packages', PackageController::class);
Route::get('/packages/{id}/details', [PackageController::class, 'getDetails']);

Route::get('/statuses', function () {
    return Status::all();
});

Route::post('/login', [AuthController::class, 'login']);


Route::controller(EnquiryController::class)->group(function () {
    Route::get('/enquiries', 'index');
    Route::post('/enquiries', 'store');
    Route::put('/enquiries/{id}/resolve', 'resolve');
});


Route::resource('users', UserController::class)->only([
    'index', 'update', 'destroy'
]);


Route::post('/package-details/{packageId}', [PackageDetailController::class, 'store']);
Route::get('/package-details/{packageId}', [PackageDetailController::class, 'show']);
Route::delete('/package-details/{packageId}', [PackageDetailController::class, 'destroy']);


Route::apiResource('guides', GuideController::class);

Route::get('/countries', [CountryController::class, 'index']);

Route::get('contacts', [ContactController::class, 'index']);

//Active Tours
Route::get('/active-tours', [BookingController::class, 'activeTourBookings']);


Route::get('payment-statuses', [PaymentStatusController::class, 'index']);




Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', [AuthController::class, 'getUser']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // User & Admin dashboards
    Route::get('/user-dashboard', [UserController::class, 'index'])->middleware('role:user');
    Route::get('/admin-dashboard', [AuthController::class, 'index'])->middleware('role:admin');

});
