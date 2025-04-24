<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Contact;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BookingController extends Controller
{
    // Show all bookings
    public function index()
    {
        $bookings = Booking::with(['contact', 'package', 'status', 'paymentStatus'])->get();
        return response()->json($bookings);
    }

    // Store a new booking
    public function store(Request $request)
    {
        try {
            // Validate incoming request data
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'gender' => 'required|string|max:10',
                'mobile_no' => 'required|string|max:20|unique:contacts,mobile_no',
                'email' => 'required|string|email|max:100|unique:contacts,email',
                'address' => 'nullable|string',
                'country_id' => 'required|exists:countries,id',
                'package_id' => 'required|exists:packages,id',
                'no_of_persons' => 'required|integer|min:1',
                'booking_date' => 'required|date|after_or_equal:today',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Fetch package details
            $package = Package::findOrFail($request->package_id);
            $amount = $package->price;
            $discount = $package->discount ?? 0;
            $total_price = ($amount - $discount) * $request->no_of_persons;

            // Create new contact
            $contact = Contact::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'gender' => $request->gender,
                'mobile_no' => $request->mobile_no,
                'email' => $request->email,
                'address' => $request->address,
                'country_id' => $request->country_id,
            ]);

            // Create booking
            $booking = Booking::create([
                'booking_date' => Carbon::parse($request->booking_date),
                'no_of_persons' => $request->no_of_persons,
                'total_price' => $total_price,
                'discount' => $discount,
                'contact_id' => $contact->id,
                'package_id' => $package->id,
                'status_id' => null,
                'payment_status_id' => null,
            ]);

            return response()->json([
                'message' => 'Booking created successfully.',
                'booking' => $booking,
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Server Error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Show a specific booking
    public function show($id)
    {
        $booking = Booking::with(['contact', 'package', 'status', 'paymentStatus'])->findOrFail($id);
        return response()->json($booking);
    }

    // Update an existing booking
    public function update(Request $request, $id)
    {
        $request->validate([
            'booking_date' => 'required|date',
            'total_price' => 'required|numeric',
            'discount' => 'required|numeric',
            'contact_id' => 'required|exists:contacts,id',
            'package_id' => 'required|exists:packages,id',
            'status_id' => 'nullable|exists:statuses,id',
            'payment_status_id' => 'nullable|exists:payment_statuses,id',
            'no_of_persons' => 'required|numeric',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update([
            'booking_date' => $request->booking_date,
            'total_price' => $request->total_price,
            'discount' => $request->discount,
            'contact_id' => $request->contact_id,
            'package_id' => $request->package_id,
            'status_id' => $request->status_id,
            'payment_status_id' => $request->payment_status_id,
            'no_of_persons' => $request->no_of_persons,
        ]);

        return response()->json($booking);
    }

    // Delete a booking
    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully']);
    }
}
