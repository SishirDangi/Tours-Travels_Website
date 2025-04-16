<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    public function getContact()
    {
        // Fetch the first contact (or modify as needed)
        $contact = Contact::first();

        if ($contact) {
            return response()->json($contact);
        } else {
            return response()->json(['message' => 'Contact details not found.'], 404);
        }
    }
}
