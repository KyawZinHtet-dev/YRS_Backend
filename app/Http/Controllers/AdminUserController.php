<?php

namespace App\Http\Controllers;

use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\AdminUser\AdminUserUpdateRequest;
use App\Http\Requests\AdminUser\AdminUserStoreRequest;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admin_users = AdminUser::orderBy('updated_at', 'desc')->get();
        return inertia('admin-users/index', ['admin_users' => $admin_users]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AdminUserStoreRequest $request): RedirectResponse
    {
        try {
            $admin_user = new AdminUser();
            $admin_user->name = $request->name;
            $admin_user->email = $request->email;
            $admin_user->password = Hash::make($request->password);
            $admin_user->save();

            return back()->with('response', ['status' => 'success', 'message' => 'Admin user created successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AdminUserUpdateRequest $request, string $id)
    {
        try {
            $admin_user = AdminUser::find($id);
            $admin_user->name = $request->name;
            $admin_user->email = $request->email;
            $admin_user->password = $request->password ? Hash::make($request->password) : $admin_user->password;
            $admin_user->updated_at = now();
            $admin_user->update();
            return back()->with('response', ['status' => 'success', 'message' => 'Admin user updated successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $admin_user = AdminUser::find($id);
            $admin_user->delete();
            return back()->with('response', ['status' => 'success', 'message' => 'Admin user deleted successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
