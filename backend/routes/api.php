<?php
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PackageController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;

Route::apiResource('bookings', BookingController::class);
Route::apiResource('packages', PackageController::class);


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin-dashboard', [AdminController::class, 'index'])->middleware('role:admin');
    Route::get('/user-dashboard', [UserController::class, 'index'])->middleware('role:user');
    // Add other protected routes here
});



Route::post('/register', [RegisterController::class, 'register']);

