<?php

namespace App\Http\Requests\TicketInspector;

use Illuminate\Validation\Rules\Password;
use App\Models\TicketInspector;
use Illuminate\Foundation\Http\FormRequest;

class TicketInspectorUpdateRequest extends FormRequest
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
            'email' => 'required|string|lowercase|email|max:255|unique:' . TicketInspector::class . ',email,' . $this->route('ticket_inspector'),
            'password' => ['confirmed', 'exclude_if:password,null', Password::defaults()],
        ];
    }
}
