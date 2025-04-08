<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Contact;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required',
            'role'     => 'required|in:user,admin'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'validation_error', 'errors' => $validator->errors()], 422);
        }

        // Fetch user based on email and role
        $user = User::with(['contact', 'role'])
            ->whereHas('contact', function ($query) use ($request) {
                $query->where('email', $request->email);
            })
            ->whereHas('role', function ($query) use ($request) {
                $query->where('role_name', $request->role);
            })
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['status' => 'error', 'message' => 'Invalid credentials'], 401);
        }

        // Update last login timestamp
        $user->last_logged_in = now();
        $user->save();

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->contact->first_name . ' ' . $user->contact->last_name,
                'email' => $user->contact->email,
                'role' => $user->role->role_name,
            ],
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}
