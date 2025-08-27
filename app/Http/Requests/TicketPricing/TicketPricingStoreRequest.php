<?php

namespace App\Http\Requests\TicketPricing;

use Illuminate\Foundation\Http\FormRequest;

class TicketPricingStoreRequest extends FormRequest
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
            'type' => 'required',
            'price' => 'required',
            'offer_quantity' => 'required',
            'period' => 'required',
            'period.started_at' => 'required',
            'period.ended_at' => 'required',
        ];
    }
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->has('period.started_at') || $validator->errors()->has('period.ended_at')) {
                $validator->errors()->add('period', 'The start date or ended date field is required');
            }
        });
    }
}
