<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // Unified login method for user/admin
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required',
            'role'     => 'required|in:user,admin',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'validation_error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find user with matching email and role
        $user = User::with(['contact', 'role'])
            ->whereHas('contact', function ($query) use ($request) {
                $query->where('email', $request->email);
            })
            ->whereHas('role', function ($query) use ($request) {
                $query->where('role_name', $request->role);
            })
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Update last login timestamp
        $user->last_logged_in = now();
        $user->save();

        // Generate Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => [
                'id'    => $user->id,
                'name'  => trim(optional($user->contact)->first_name . ' ' . optional($user->contact)->last_name),
                'email' => optional($user->contact)->email,
                'role'  => optional($user->role)->role_name,
            ],
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    // Logout method
    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully',
        ]);
    }

    // Get authenticated user info
    public function getUser(Request $request)
    {
        $user = $request->user()->load(['contact', 'role']);

        return response()->json([
            'id'    => $user->id,
            'name'  => trim(optional($user->contact)->first_name . ' ' . optional($user->contact)->last_name),
            'email' => optional($user->contact)->email,
            'role'  => optional($user->role)->role_name,
        ]);
    }

    // Admin Dashboard data
    public function dashboard(Request $request)
    {
        $user = $request->user()->load(['role']);

        if ($user->role->role_name !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Only admins can access this resource.',
            ], 403);
        }

        $totalUsers = \App\Models\User::count();
        $totalBookings = \App\Models\Booking::count();
        $newBookings = \App\Models\Booking::where('created_at', '>=', now()->subDays(30))->count();

        return response()->json([
            'status' => 'success',
            'message' => 'Admin Dashboard',
            'admin' => [
                'name' => $user->name,
                'role' => $user->role->role_name,
            ],
            'statistics' => [
                'totalUsers' => $totalUsers,
                'totalBookings' => $totalBookings,
                'newBookings' => $newBookings,
            ],
        ]);
    }
}
