<?php

namespace App\Http\Requests\Wallet;

use Illuminate\Foundation\Http\FormRequest;

class WalletBalanceStoreRequest extends FormRequest
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
            'wallet_id' => 'required|exists:wallets,id',
            'amount' => 'required|integer|min:100',
            'description' => 'nullable|string|max:500',
        ];
    }

    public function messages()
    {
        return [
            'wallet_id.required' => 'Please select a wallet.',
            'wallet_id.exists' => 'Please select a valid wallet.',
            'amount.required' => 'Please enter an amount.',
            'amount.min' => 'The amount must be at least 100 MMK.',
        ];
    }
}
