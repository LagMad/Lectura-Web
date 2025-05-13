<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfon\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
{
    $userRole = $request->user()->role;

    if (!in_array($userRole, $roles)) {
        if ($request->expectsJson()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        return redirect()->route('home');
    }

    return $next($request);
}

}