<?php

namespace App\Http\Controllers;



use App\Http\Requests\User\UserUpdateRequest;
use App\Http\Requests\User\UserStoreRequest;
use App\Repositories\UserRepository;

class UserController extends Controller
{
    protected $userRepository;
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = $this->userRepository->all();
        return inertia('users/index', ['users' => $users]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request)
    {
        try {
            $this->userRepository->create($request->all());

            return back()->with('response', ['status' => 'success', 'message' => 'User created successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, string $id)
    {
        try {
            $this->userRepository->update($id, $request->all());
            return back()->with('response', ['status' => 'success', 'message' => 'User updated successfully']);
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
            $this->userRepository->delete($id);
            return back()->with('response', ['status' => 'success', 'message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            return back()->with('response', ['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
