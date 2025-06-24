<?php

namespace App\Http\Controllers;

use App\Models\HomePageDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HomePageDetailController extends Controller
{
    // ✅ Get All Records
    public function index()
    {
        return response()->json(HomePageDetail::all(), 200);
    }

    // ✅ Create New Record
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp'
        ]);

        $imagePath = $request->file('image')->store('homepage', 'public');

        $detail = HomePageDetail::create([
            'title' => $request->title,
            'image_path' => $imagePath
        ]);

        return response()->json($detail, 201);
    }

    // ✅ Get Single Record by ID
    public function show($id)
    {
        $detail = HomePageDetail::find($id);

        if (!$detail) {
            return response()->json(['message' => 'Detail not found'], 404);
        }

        return response()->json($detail, 200);
    }

    // ✅ Update Record
    public function update(Request $request, $id)
    {
        $detail = HomePageDetail::find($id);

        if (!$detail) {
            return response()->json(['message' => 'Detail not found'], 404);
        }

        $request->validate([
            'title' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($detail->image_path && Storage::disk('public')->exists($detail->image_path)) {
                Storage::disk('public')->delete($detail->image_path);
            }
            $imagePath = $request->file('image')->store('homepage', 'public');
            $detail->image_path = $imagePath;
        }

        $detail->title = $request->title;
        $detail->save();

        return response()->json($detail, 200);
    }

    // ✅ Delete Record
    public function destroy($id)
    {
        $detail = HomePageDetail::find($id);

        if (!$detail) {
            return response()->json(['message' => 'Detail not found'], 404);
        }

        if ($detail->image_path && Storage::disk('public')->exists($detail->image_path)) {
            Storage::disk('public')->delete($detail->image_path);
        }

        $detail->delete();

        return response()->json(['message' => 'Detail deleted successfully'], 200);
    }
}
