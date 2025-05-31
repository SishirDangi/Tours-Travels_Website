<?php

namespace App\Http\Controllers;

use App\Models\Guide;
use Illuminate\Http\Request;

class GuideController extends Controller
{
    // Show all guides
    public function index()
    {
        $guides = Guide::all();
        return response()->json($guides);
    }

    // Show single guide
    public function show($id)
    {
        $guide = Guide::findOrFail($id);
        return response()->json($guide);
    }

    // Store a new guide
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:guides,email',
            'phone' => 'required|string|max:20',
            'gender' => 'required|string',
            'address' => 'required|string',
            'languages' => 'required|array',
        ]);

        $guide = Guide::create($request->all());

        return response()->json(['message' => 'Guide added successfully', 'guide' => $guide], 201);
    }

    // Update a guide
    public function update(Request $request, $id)
    {
        $guide = Guide::findOrFail($id);

        $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email|unique:guides,email,' . $guide->id,
            'phone' => 'sometimes|required|string|max:20',
            'gender' => 'sometimes|required|string',
            'address' => 'sometimes|required|string',
            'languages' => 'sometimes|required|array',
        ]);

        $guide->update($request->all());

        return response()->json(['message' => 'Guide updated successfully', 'guide' => $guide]);
    }

    // Delete a guide
    public function destroy($id)
    {
        $guide = Guide::findOrFail($id);
        $guide->delete();

        return response()->json(['message' => 'Guide deleted successfully']);
    }

    public function count()
    {
        $count = Guide::count();
        return response()->json(['count' => $count]);
    }
}
