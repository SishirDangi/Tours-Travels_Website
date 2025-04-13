<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Otp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:contacts,email',
            'mobile_no' => 'required|numeric|unique:contacts,mobile_no',
        ]);

        $otp = rand(100000, 999999);

        // Save to contacts table
        $contact = Contact::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'mobile_no' => $request->mobile_no,
            'email' => $request->email,
        ]);

        // Save OTP
        Otp::create([
            'contact_id' => $contact->id,
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(5),
            'is_used' => false,
        ]);

        // Send OTP to email
        Mail::raw("Your OTP is: $otp", function ($message) use ($request) {
            $message->to($request->email)->subject('Email Verification OTP');
        });

        return response()->json([
            'message' => 'OTP sent to your email. Please verify to complete registration.',
            'contact_id' => $contact->id,
        ], 200);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'contact_id' => 'required|exists:contacts,id',
            'otp' => 'required|numeric',
            'password' => 'required|min:6|confirmed'
        ]);

        $otpRecord = Otp::where('contact_id', $request->contact_id)
                        ->where('otp', $request->otp)
                        ->where('is_used', false)
                        ->where('expires_at', '>', Carbon::now())
                        ->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'Invalid or expired OTP.'], 400);
        }

        $otpRecord->update(['is_used' => true]);

        // Save user with reference to contact
        User::create([
            'contact_id' => $request->contact_id,
            'password' => Hash::make($request->password),
            'role_id' => 2, // or default role
        ]);

        return response()->json(['message' => 'User registered successfully.'], 201);
    }
}
