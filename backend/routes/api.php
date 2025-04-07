<?php
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PackageController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;

Route::apiResource('bookings', BookingController::class);
Route::apiResource('packages', PackageController::class);




Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');




Route::post('/register', [RegisterController::class, 'register']);

