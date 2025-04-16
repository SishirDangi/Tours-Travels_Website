<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Package;
use Illuminate\Http\Response;

class BookingController extends Controller
{
    // Get all bookings
    public function index()
    {
        return response()->json(Booking::all(), Response::HTTP_OK);
    }

    // Create a new booking
    public function store(Request $request)
    {
        // Validate the required fields
        $request->validate([
            'contact_id' => 'required|exists:contacts,id',
            'package_id' => 'required|exists:packages,id',
        ]);

        // Get the selected package
        $package = Package::find($request->package_id);
        if (!$package) {
            return response()->json(['message' => 'Package not found'], Response::HTTP_NOT_FOUND);
        }

        // Set current date and time for booking
        $currentDateTime = now();

        // Prepare booking data
        $bookingData = [
            'booking_date' => $currentDateTime->toDateString(),  // Store only date part
            'booking_time' => $currentDateTime->toTimeString(),  // Store only time part
            'total_price' => $package->package_price,  // Total price from the selected package
            'discount' => null,  // Set discount as null initially
            'contact_id' => $request->contact_id,  // Valid contact ID
            'package_id' => $request->package_id,  // Valid package ID
            'status_id' => 2,  // Status set to "2" (booked)
        ];

        // Create the booking
        $booking = Booking::create($bookingData);

        return response()->json($booking, Response::HTTP_CREATED);
    }

    // Get a specific booking
    public function show($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($booking, Response::HTTP_OK);
    }

    // Update an existing booking
    public function update(Request $request, $id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], Response::HTTP_NOT_FOUND);
        }

        $request->validate([
            'booking_date' => 'sometimes|date',
            'booking_time' => 'sometimes',
            'total_price' => 'sometimes|numeric',
            'discount' => 'sometimes|numeric',
            'contact_id' => 'sometimes|exists:contacts,id',
            'package_id' => 'sometimes|exists:packages,id',
            'status_id' => 'sometimes|nullable|exists:statuses,id',
        ]);

        $booking->update($request->all());
        return response()->json($booking, Response::HTTP_OK);
    }

    // Delete a booking
    public function destroy($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], Response::HTTP_NOT_FOUND);
        }

        $booking->delete();
        return response()->json(['message' => 'Booking deleted successfully'], Response::HTTP_OK);
    }
}
