<?php
namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Contact;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    // Show all bookings
   public function index(Request $request)
{
    $query = Booking::with(['contact.country', 'package', 'status', 'paymentStatus']);

    if ($request->has('email')) {
        $query->whereHas('contact', function ($q) use ($request) {
            $q->where('email', $request->email);
        });
    }

    $bookings = $query->get();
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
                'mobile_no' => 'required|numeric|min:10|unique:contacts,mobile_no',
                'email' => 'required|string|email|max:100|unique:contacts,email',
                'address' => 'nullable|string',
                'country_id' => 'required|exists:countries,id',
                'package_id' => 'required|exists:packages,id',
                'no_of_persons' => 'required|integer|min:1',
                'booking_date' => 'required|date|after_or_equal:today',
                'tour_date' => 'required|date|after_or_equal:booking_date',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Fetch package details
            $package = Package::findOrFail($request->package_id);
            $amount = $package->package_price; // Correct price field name
            $discount = $package->discount ?? 0;

            // Calculate total price after discount
            $discountedPrice = $amount - ($amount * $discount / 100); // Apply discount
            $total_price = $discountedPrice * $request->no_of_persons;

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

            // Generate unique booking code
            $booking_code = $this->generateUniqueBookingCode();

            // Create booking
            $booking = Booking::create([
                'booking_date' => Carbon::parse($request->booking_date),
                'tour_date' => Carbon::parse($request->tour_date),
                'booking_code' => $booking_code,
                'no_of_persons' => $request->no_of_persons,
                'total_price' => $total_price, // Store calculated total price
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

    // Generate a unique booking code
    private function generateUniqueBookingCode()
    {
        do {
            $code = 'BK-' . strtoupper(uniqid());
        } while (Booking::where('booking_code', $code)->exists());

        return $code;
    }

    // Show a specific booking
    public function show($id)
    {
        $booking = Booking::with(['contact.country', 'package', 'status', 'paymentStatus'])->findOrFail($id);
        return response()->json($booking);
    }


  // Update an existing booking
public function update(Request $request, $id)
{
    $booking = Booking::findOrFail($id);

    if (Carbon::parse($booking->created_at)->diffInHours(now()) > 24) {
        return response()->json(['error' => 'Booking cannot be edited after 24 hours.'], 403);
    }

    $request->validate([
        'booking_date' => 'required|date',
        'tour_date' => 'required|date|after_or_equal:booking_date',
        'total_price' => 'required|numeric',
        'contact_id' => 'required|exists:contacts,id',
        'package_id' => 'required|exists:packages,id',
        'status_id' => 'nullable|exists:statuses,id',
        'payment_status_id' => 'nullable|exists:payment_statuses,id',
        'no_of_persons' => 'required|integer|min:1',  // ✅ Enforces at least 1 person
    ]);

    $booking->update([
        'booking_date' => $request->booking_date,
        'tour_date' => $request->tour_date,
        'total_price' => $request->total_price,
        'contact_id' => $request->contact_id,
        'package_id' => $request->package_id,
        'status_id' => $request->status_id,
        'payment_status_id' => $request->payment_status_id,
        'no_of_persons' => $request->no_of_persons,
    ]);

    return response()->json([
        'message' => 'Booking updated successfully.',
        'booking' => $booking
    ]);
}

    //Active Tours
    public function activeTourBookings()
{
    // Fetch bookings with related data
    $bookings = Booking::with([
        'contact.country',
        'package.status',
        'package.details',
        'status',
        'paymentStatus'
    ])
    ->whereHas('package.status', function ($query) {
        $query->where('status_name', 'active');
    })
    ->get();

    // Group bookings by tour_category and package_type
    $groupedBookings = $bookings->groupBy(function ($booking) {
        return $booking->package->tour_category . '-' . $booking->package->package_type;
    });

    // Return the grouped bookings as a JSON response
    return response()->json($groupedBookings);
}


    // Delete a booking
    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully']);
    }
    

    public function count(): JsonResponse
    {
        return response()->json(['count' => Booking::count()]);
    }

}
