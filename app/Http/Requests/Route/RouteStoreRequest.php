<?php

namespace App\Http\Requests\Route;


use Illuminate\Foundation\Http\FormRequest;

class RouteStoreRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'direction' => 'required|in:clockwise,anticlockwise',
            'schedule' => 'required|array|min:1',
            'schedule.*.station_id' => 'required|distinct',
            'schedule.*.time' => 'required|distinct',
        ];
    }

    /**
     * Add custom validation rules.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->has('schedule.*.station_id') || $validator->errors()->has('schedule.*.time')) {
                $error = $validator->errors()->first();
                $validator->errors()->add('schedule', strpos($error, 'required') !== false ? 'The station or time field is required' : 'The station or time field is duplicated');
            }
        });
    }
}
