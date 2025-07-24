<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\VisitorLog;

class StatistikController extends Controller
{
    public function index()
    {
        $monthlyStats = VisitorLog::getMonthlyStats(12);
        $todayVisitors = VisitorLog::getTodayVisitors();
        $thisMonthVisitors = VisitorLog::getThisMonthVisitors();
        
        return Inertia::render('Admin/Statistik', [
            'monthlyStats' => $monthlyStats,
            'todayVisitors' => $todayVisitors,
            'thisMonthVisitors' => $thisMonthVisitors,
        ]);
    }

    public function getVisitorStats()
    {
        return response()->json([
            'monthlyStats' => VisitorLog::getMonthlyStats(12),
            'todayVisitors' => VisitorLog::getTodayVisitors(),
            'thisMonthVisitors' => VisitorLog::getThisMonthVisitors(),
        ]);
    }
}