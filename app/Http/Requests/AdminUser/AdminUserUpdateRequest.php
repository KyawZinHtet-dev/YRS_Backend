<?php

namespace App\Http\Requests\AdminUser;

use Illuminate\Validation\Rules\Password;
use App\Models\AdminUser;
use Illuminate\Foundation\Http\FormRequest;

class AdminUserUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . AdminUser::class . ',email,' . $this->route('admin_user'),
            'password' => ['confirmed', 'exclude_if:password,null', Password::defaults()],
        ];
    }
}
