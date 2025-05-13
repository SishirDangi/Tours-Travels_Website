<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        // Get the authenticated user
        $user = Auth::user();

        // Check if user has the required role
        if ($user && $user->role->role_name === $role) {
            return $next($request); // Proceed to the next middleware or request
        }

        return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
    }
}
