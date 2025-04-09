<?php
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PackageController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Models\Status;
Route::apiResource('bookings', BookingController::class);
Route::apiResource('packages', PackageController::class);

Route::get('/statuses', function () {
    return Status::all();
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin-dashboard', [AdminController::class, 'index'])->middleware('role:admin');
    Route::get('/user-dashboard', [UserController::class, 'index'])->middleware('role:user');

});



Route::post('/register', [RegisterController::class, 'register']);

