<?php

namespace App\Http\Controllers;

use App\Models\Otp;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class OtpController extends Controller
{
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric',
            'password' => 'required|string|min:6',
        ]);

        // Find the contact using the email
        $contact = Contact::where('email', $request->email)->first();

        if (!$contact) {
            return response()->json(['message' => 'Contact not found.'], 404);
        }

        // Retrieve OTP record for the contact
        $otpRecord = Otp::where('contact_id', $contact->id)
                        ->where('otp', $request->otp)
                        ->where('is_used', false)
                        ->first();

        // Check if OTP exists and is not expired
        if (!$otpRecord || Carbon::now()->greaterThan($otpRecord->expires_at)) {
            return response()->json(['message' => 'Invalid or expired OTP.'], 400);
        }

        // Mark OTP as used
        $otpRecord->update(['is_used' => true]);

        // Mark contact as verified
        $contact->update(['is_verified' => true]);

        // Check if user already exists to avoid duplicates
        $existingUser = User::where('contact_id', $contact->id)->first();
        if ($existingUser) {
            return response()->json(['message' => 'User already exists.'], 409);
        }

        // Create user
        $user = User::create([
            'contact_id' => $contact->id,
            'role_id' => 2, // Default role_id, adjust if needed
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'OTP verified and user created successfully.'], 200);
    }
}
