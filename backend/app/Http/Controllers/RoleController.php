<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Http\Response;

class RoleController extends Controller
{
    // Get all roles
    public function index()
    {
        return response()->json(Role::all(), Response::HTTP_OK);
    }

    // Create a new role
    public function store(Request $request)
    {
        $request->validate([
            'role_name' => 'required|string|max:255|unique:roles,role_name',
        ]);

        $role = Role::create($request->all());
        return response()->json($role, Response::HTTP_CREATED);
    }

    // Get a specific role
    public function show($id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($role, Response::HTTP_OK);
    }

    // Update an existing role
    public function update(Request $request, $id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], Response::HTTP_NOT_FOUND);
        }

        $request->validate([
            'role_name' => 'sometimes|string|max:255|unique:roles,role_name,' . $id,
        ]);

        $role->update($request->all());
        return response()->json($role, Response::HTTP_OK);
    }

    // Delete a role
    public function destroy($id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], Response::HTTP_NOT_FOUND);
        }

        $role->delete();
        return response()->json(['message' => 'Role deleted successfully'], Response::HTTP_OK);
    }
}
