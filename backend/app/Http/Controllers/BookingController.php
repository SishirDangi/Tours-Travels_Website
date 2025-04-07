<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
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
        $request->validate([
            'booking_date' => 'required|date',
            'booking_time' => 'required',
            'total_price' => 'required|numeric',
            'discount' => 'required|numeric',
            'contact_id' => 'required|exists:contacts,id',
            'package_id' => 'required|exists:packages,id',
            'status_id' => 'nullable|exists:statuses,id',
        ]);

        $booking = Booking::create($request->all());
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
