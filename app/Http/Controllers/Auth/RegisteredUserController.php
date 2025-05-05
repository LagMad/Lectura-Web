<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ValidNIPD;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            
            $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'role' => ['sometimes', 'string', 'in:admin,siswa'],
                'nipd' => 'required|string|exists:valid_nipds,nipd',
            ]);
    
            // Periksa apakah NIPD valid dan belum terdaftar
            $validNipd = ValidNIPD::where('nipd', $request->nipd)
                ->where('is_registered', false)
                ->first();
    
            if (!$validNipd) {
                return back()->withErrors([
                    'nipd' => 'NIPD tidak valid atau sudah terdaftar.',
                ]);
            }
    
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'nipd' => $request->nipd,
                'role' => $request->role,
            ]);
    
            // Update status NIPD menjadi sudah terdaftar
            $validNipd->update(['is_registered' => true]);

            event(new Registered($user));

            Auth::login($user);

            // Redirect based on role
            return redirect()->intended($this->getRedirectRoute($user->role));
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage());
            
            return redirect()->back()
                ->withInput($request->except('password', 'password_confirmation'))
                ->withErrors(['registration' => 'Registration failed. Please try again.']);
        }
    }

    /**
     * Get the appropriate redirect route based on user role.
     */
    private function getRedirectRoute(string $role): string
    {
        return match ($role) {
            'admin' => route('books.admin'),
            default => route('home'),
        };
    }
}
