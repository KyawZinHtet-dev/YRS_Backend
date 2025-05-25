<?php

namespace App\Http\Controllers;



use App\Repositories\AdminUserRepository;
use App\Http\Requests\AdminUser\AdminUserStoreRequest;
use App\Http\Requests\AdminUser\AdminUserUpdateRequest;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    protected $adminUserRepository;
    public function __construct(AdminUserRepository $adminUserRepository)
    {
        $this->adminUserRepository = $adminUserRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $admin_users = $this->adminUserRepository->dataTable($request);
        return inertia('admin-users/index', ['admin_users' => $admin_users]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AdminUserStoreRequest $request)
    {
        try {
            $this->adminUserRepository->create($request->all());

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
            $this->adminUserRepository->update($id, $request->all());
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
            $this->adminUserRepository->delete($id);
            return back()->with('response', ['status' => 'success', 'message' => 'Admin User deleted successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
