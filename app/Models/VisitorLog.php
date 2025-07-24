<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class VisitorLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip_address',
        'user_agent',
        'page_url',
        'session_id',
        'visited_at',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
    ];

    public static function getMonthlyStats($months = 12)
    {
        $startDate = Carbon::now()->subMonths($months - 1)->startOfMonth();
        
        return self::selectRaw("
                DATE_FORMAT(visited_at, '%Y-%m') as month,
                COUNT(DISTINCT CONCAT(ip_address, '-', DATE(visited_at))) as unique_visitors,
                COUNT(*) as total_visits
            ")
            ->where('visited_at', '>=', $startDate)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'month_name' => Carbon::createFromFormat('Y-m', $item->month)->format('F Y'),
                    'unique_visitors' => $item->unique_visitors,
                    'total_visits' => $item->total_visits,
                ];
            });
    }

    public static function getTodayVisitors()
    {
        return self::whereDate('visited_at', Carbon::today())
            ->distinct('ip_address')
            ->count();
    }

    public static function getThisMonthVisitors()
    {
        return self::whereMonth('visited_at', Carbon::now()->month)
            ->whereYear('visited_at', Carbon::now()->year)
            ->distinct('ip_address')
            ->count();
    }
}