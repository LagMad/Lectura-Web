<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SocialUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'instagram' => ['nullable', 'string', 'max:255'],
            'x'         => ['nullable', 'string', 'max:255'],
            'linkedin'  => ['nullable', 'string', 'max:255'],
            'tiktok'    => ['nullable', 'string', 'max:255'],
            'password'  => ['required', 'current_password'],
        ];
    }

    // public function authorize(): bool
    // {
    //     return true;
    // }
}
