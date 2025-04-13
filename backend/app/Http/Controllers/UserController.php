<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // 🧾 Get all users with contact and role info
    public function index()
    {
        $users = User::with(['contact', 'role'])->get();
        return response()->json($users);
    }

    // ✏️ Update a user (contact info or password)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validate request
        $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:contacts,email,' . $user->contact_id,
            'mobile_no' => 'sometimes|numeric|unique:contacts,mobile_no,' . $user->contact_id,
            'password' => 'nullable|min:6|confirmed'
        ]);

        // Update contact info
        if ($user->contact) {
            $user->contact->update([
                'first_name' => $request->first_name ?? $user->contact->first_name,
                'last_name' => $request->last_name ?? $user->contact->last_name,
                'email' => $request->email ?? $user->contact->email,
                'mobile_no' => $request->mobile_no ?? $user->contact->mobile_no,
            ]);
        }

        // Update password if provided
        if ($request->password) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        return response()->json(['message' => 'User updated successfully.']);
    }

    // ❌ Delete a user and associated contact
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Delete associated contact first (optional based on cascade setup)
        if ($user->contact) {
            $user->contact->delete();
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }
}
