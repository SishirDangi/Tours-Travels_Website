<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\PackageDetail;
use Illuminate\Http\Request;

class PackageDetailController extends Controller
{
    // Create or Update a PackageDetail
    public function store(Request $request, $packageId)
    {
        // Check if the package exists
        $package = Package::find($packageId);
        if (!$package) {
            return response()->json(['message' => 'Package not found'], 404);
        }

        // Validate input
        $request->validate([
            'main_information' => 'required|string',
            'cost_includes' => 'nullable|string',
            'cost_excludes' => 'nullable|string',
            'itinerary' => 'nullable|string',
            'trip_highlights' => 'nullable|string',
        ]);

        // Create or update the package detail
        $packageDetail = PackageDetail::updateOrCreate(
            ['package_id' => $packageId],
            $request->only([
                'main_information',
                'cost_includes',
                'cost_excludes',
                'itinerary',
                'trip_highlights'
            ])
        );

        return response()->json($packageDetail, 200);
    }

    // Get PackageDetails for a specific package
    public function show($packageId)
    {
        $packageDetail = PackageDetail::where('package_id', $packageId)->first();

        return response()->json($packageDetail, 200);
    }

    // Delete PackageDetail for a specific package
    public function destroy($packageId)
    {
        $packageDetail = PackageDetail::where('package_id', $packageId)->first();

        if ($packageDetail) {
            $packageDetail->delete();
            return response()->json(['message' => 'Package details deleted successfully'], 200);
        }

        return response()->json(['message' => 'Package details not found'], 404);
    }
}
