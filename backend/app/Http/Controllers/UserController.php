<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
<<<<<<< HEAD
=======

use App\Models\User;
use App\Models\Contact;
>>>>>>> cd458b64ddb6588f48dd19c9fe4a8eef7f29b135
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Get all users with contact and role info.
     */
    public function index()
    {
        $users = User::with(['contact', 'role'])->get();
        return response()->json($users);
    }
public function changePassword(Request $request): JsonResponse
{
    $user = auth()->user();

    $request->validate([
        'old_password' => 'required',
        'password' => 'required|min:6|confirmed',
    ]);

    // Check old password
    if (!\Illuminate\Support\Facades\Hash::check($request->old_password, $user->password)) {
        return response()->json(['error' => 'The old password you entered is incorrect.'], 400);
    }

    // Check new password is not the same as the old one
    if (\Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        return response()->json(['error' => 'The new password must be different from your current password.'], 400);
    }

    $user->update([
        'password' => \Illuminate\Support\Facades\Hash::make($request->password),
    ]);

    return response()->json(['message' => 'Your password has been updated successfully.']);
}

    /**
     * Delete a user and associated contact.
     */
    public function destroy($id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Delete associated contact first (optional based on cascade setup)
        if ($user->contact) {
            $user->contact->delete();
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

<<<<<<< HEAD
    /**
     * Get total user count.
     */
=======
>>>>>>> cd458b64ddb6588f48dd19c9fe4a8eef7f29b135
    public function count(): JsonResponse
    {
        return response()->json(['count' => User::count()]);
    }

<<<<<<< HEAD
        public function changeAdminPassword(Request $request): JsonResponse
    {
        $user = auth()->user();

        // Optional: Check if user is admin by role_id or role
        if (!$user || $user->role_id !== 1) {  // Assuming role_id=1 is admin
            return response()->json(['error' => 'Unauthorized.'], 401);
        }

        $request->validate([
            'old_password' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        // Check old password
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['error' => 'The old password you entered is incorrect.'], 400);
        }

        // Check new password is not same as old
        if (Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'The new password must be different from your current password.'], 400);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Your password has been updated successfully.']);
    }

    public function update(Request $request, $id)
{
    // Validate incoming data
    $validated = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name'  => 'required|string|max:255',
        'email'      => 'required|email|max:255',
        'mobile_no'  => 'required|numeric|min:10',
    ]);

    // Find user and related contact
    $user = User::findOrFail($id);
    $contact = $user->contact;

    if (!$contact) {
        return response()->json(['error' => 'User contact not found.'], 404);
    }

    // Update contact details
    $contact->first_name = $validated['first_name'];
    $contact->last_name  = $validated['last_name'];
    $contact->email      = $validated['email'];
    $contact->mobile_no  = $validated['mobile_no'];

    $contact->save();

    return response()->json(['message' => 'User updated successfully.', 'user' => $user->load('contact')]);
=======

>>>>>>> cd458b64ddb6588f48dd19c9fe4a8eef7f29b135
}


}

