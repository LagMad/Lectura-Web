<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\VisitorLog;
use Carbon\Carbon;

class TrackVisitor
{
    public function handle(Request $request, Closure $next)
    {
        // Skip tracking untuk bot atau crawler
        $userAgent = $request->userAgent();
        $botPatterns = [
            'bot', 'crawler', 'spider', 'scraper', 'facebook', 'google',
            'yahoo', 'bing', 'slurp', 'duckduck', 'baidu'
        ];
        
        foreach ($botPatterns as $pattern) {
            if (stripos($userAgent, $pattern) !== false) {
                return $next($request);
            }
        }

        // Track pengunjung
        $ipAddress = $request->ip();
        $sessionId = session()->getId();
        $pageUrl = $request->fullUrl();
        
        // Cek apakah sudah ada record untuk IP dan hari yang sama
        $existingLog = VisitorLog::where('ip_address', $ipAddress)
            ->where('session_id', $sessionId)
            ->whereDate('visited_at', Carbon::today())
            ->first();

        if (!$existingLog) {
            VisitorLog::create([
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'page_url' => $pageUrl,
                'session_id' => $sessionId,
                'visited_at' => Carbon::now(),
            ]);
        }

        return $next($request);
    }
}