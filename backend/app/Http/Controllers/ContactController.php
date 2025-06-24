<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Contact;

class ContactController extends Controller
{
    // Return the contact details of the currently authenticated user
    public function getContact()
    {
        $user = Auth::user();

        if ($user && $user->contact) {
            return response()->json($user->contact);
        }

        return response()->json(['message' => 'Contact details not found.'], 404);
    }

    // Return the total number of contacts (optional)
    public function count()
    {
        $count = Contact::count();
        return response()->json(['count' => $count]);
    }

    // Update contact info by ID (ensure user owns the contact or add proper authorization)
public function update(Request $request, $id)
{
    $contact = Contact::findOrFail($id);

    $validated = $request->validate([
        'first_name' => 'required|string|max:100',
        'last_name' => 'required|string|max:100',
        'mobile_no' => 'required|numeric|min:10',
        'address' => 'nullable|string',
        'gender' => 'nullable|string|max:10',
        'email' => 'nullable|email|max:255',
        'country_id' => 'nullable|integer|exists:countries,id',
    ]);

    // Only update fields that are present in the request
    $contact->update($validated);

    return response()->json([
        'message' => 'Profile updated successfully.',
        'contact' => $contact
    ]);
}
}
