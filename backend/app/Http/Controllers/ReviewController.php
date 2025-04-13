<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Package;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store a new review.
     */
    public function store(Request $request, $packageId)
    {
        // Validate input
        $validated = $request->validate([
            'review' => 'required|string|max:255',
            'review_by' => 'required|string|max:255',
        ]);

        // Check if the package exists
        $package = Package::findOrFail($packageId);

        // Get the authenticated user's ID
        $userId = Auth::id();

        // Check if the user has booked this package (with 'booked' status)
        $booking = Booking::where('user_id', $userId)
                          ->where('package_id', $packageId)
                          ->where('status_id', 2)
                          ->exists();

        if (!$booking) {
            return response()->json(['error' => 'You must book the package before leaving a review.'], 403);
        }

        // Create the review and associate it with the package
        $review = new Review($validated);
        $review->package_id = $packageId;
        $review->review_by = $request->review_by;
        $review->save();

        return response()->json(['message' => 'Review added successfully', 'review' => $review], 201);
    }

}
