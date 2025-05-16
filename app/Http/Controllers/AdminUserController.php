<?php

namespace App\Http\Controllers;

use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\AdminUser\AdminUserStoreRequest;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admin_users = AdminUser::latest('created_at')->latest('updated_at')->get();
        return inertia('admin-users/index', ['admin_users' => $admin_users]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AdminUserStoreRequest $request): RedirectResponse
    {
        try {
            $admin_users = new AdminUser();
            $admin_users->name = $request->name;
            $admin_users->email = $request->email;
            $admin_users->password = Hash::make($request->password);
            $admin_users->save();

            return back()->with('response', ['status' => 'success', 'message' => 'Admin user created successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $admin_users = AdminUser::find($id);
            $admin_users->delete();
            return back()->with('response', ['status' => 'success', 'message' => 'Admin user deleted successfully']);
         } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
         }  
    }
}
