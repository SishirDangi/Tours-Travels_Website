<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Contact;

class RegisterController extends Controller
{
    public function register(Request $request)
{
    try {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:contacts,email',
            'mobile_no' => 'required|numeric',
            'password' => 'required|min:6|confirmed',
        ]);

        // Create contact
        $contact = Contact::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'mobile_no' => $request->mobile_no,
            'email' => $request->email,
            'address' => null,  // You can add address if necessary
            'country_id' => null,  // You can add country_id if necessary
        ]);

        // Create user with default role_id = 2 (user)
        User::create([
            'password' => Hash::make($request->password),
            'contact_id' => $contact->id,
            'role_id' => 2,
        ]);

        return response()->json(['message' => 'Registration successful.'], 201);

    } catch (\Exception $e) {
        Log::error('Register error: ' . $e->getMessage());
        return response()->json([
            'message' => 'Server error',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
