<?php
namespace App\Http\Controllers;

use App\Models\PaymentStatus;
use Illuminate\Http\Request;

class PaymentStatusController extends Controller
{
    public function index()
    {
        try {
            $paymentStatuses = PaymentStatus::all();  // Fetch all payment statuses from the database
            return response()->json($paymentStatuses);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch payment statuses', 'message' => $e->getMessage()], 500);
        }
    }
}
