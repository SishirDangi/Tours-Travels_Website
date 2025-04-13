<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Enquiry;
use App\Models\Status;

class EnquiryController extends Controller
{
    // Store a new enquiry with 'pending' status by default
    public function store(Request $request)
    {
        $request->validate([
            'fullName' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        // Get the 'pending' status id
        $pendingStatusId = Status::where('status_name', 'pending')->value('id');

        $enquiry = Enquiry::create([
            'full_name' => $request->fullName,
            'phone' => $request->phone,
            'email' => $request->email,
            'message' => $request->message,
            'status_id' => $pendingStatusId,
        ]);

        return response()->json(['message' => 'Enquiry submitted successfully!', 'data' => $enquiry], 201);
    }

    // Show all enquiries with their statuses
    public function index()
    {
        $enquiries = Enquiry::with('status')->latest()->get();
        return response()->json($enquiries);
    }

    // Resolve a particular enquiry
    public function resolve($id)
    {
        $enquiry = Enquiry::findOrFail($id);
        $resolvedStatusId = Status::where('status_name', 'resolved')->value('id');

        $enquiry->status_id = $resolvedStatusId;
        $enquiry->save();

        return response()->json(['message' => 'Enquiry marked as resolved.']);
    }
}
