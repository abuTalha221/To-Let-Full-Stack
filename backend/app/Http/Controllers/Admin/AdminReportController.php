<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminReportController extends Controller
{
    /**
     * Get comprehensive earnings and statistics report
     */
    public function index(Request $request)
    {
        $period = $request->get('period', 'monthly'); // weekly, monthly, yearly

        // Calculate date ranges
        $now = Carbon::now();
        
        switch ($period) {
            case 'weekly':
                $startDate = $now->copy()->startOfWeek();
                $endDate = $now->copy()->endOfWeek();
                $previousStartDate = $now->copy()->subWeek()->startOfWeek();
                $previousEndDate = $now->copy()->subWeek()->endOfWeek();
                break;
            
            case 'yearly':
                $startDate = $now->copy()->startOfYear();
                $endDate = $now->copy()->endOfYear();
                $previousStartDate = $now->copy()->subYear()->startOfYear();
                $previousEndDate = $now->copy()->subYear()->endOfYear();
                break;
            
            case 'monthly':
            default:
                $startDate = $now->copy()->startOfMonth();
                $endDate = $now->copy()->endOfMonth();
                $previousStartDate = $now->copy()->subMonth()->startOfMonth();
                $previousEndDate = $now->copy()->subMonth()->endOfMonth();
                break;
        }

        // Current period stats
        $currentStats = $this->calculateStats($startDate, $endDate);
        
        // Previous period stats for comparison
        $previousStats = $this->calculateStats($previousStartDate, $previousEndDate);

        // Calculate growth percentages
        $creditGrowth = $this->calculateGrowth($previousStats['credits_sold'], $currentStats['credits_sold']);
        $earningsGrowth = $this->calculateGrowth($previousStats['total_earnings'], $currentStats['total_earnings']);
        $ordersGrowth = $this->calculateGrowth($previousStats['orders_completed'], $currentStats['orders_completed']);

        // Get all-time stats
        $allTimeStats = $this->calculateStats(Carbon::create(2020, 1, 1), $now);

        // Get monthly breakdown for the current year
        $monthlyBreakdown = $this->getMonthlyBreakdown();

        return response()->json([
            'status' => true,
            'period' => $period,
            'date_range' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'current_stats' => [
                'total_earnings' => $currentStats['total_earnings'],
                'credits_sold' => $currentStats['credits_sold'],
                'orders_completed' => $currentStats['orders_completed'],
                'total_transactions' => $currentStats['total_transactions'],
            ],
            'growth' => [
                'earnings' => $earningsGrowth,
                'credits' => $creditGrowth,
                'orders' => $ordersGrowth,
            ],
            'all_time' => $allTimeStats,
            'monthly_breakdown' => $monthlyBreakdown,
        ]);
    }

    /**
     * Calculate statistics for a given date range
     */
    private function calculateStats($startDate, $endDate)
    {
        // Get successful transactions in the date range
        $transactions = Transaction::where('status', 'success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        // Get completed orders in the date range
        $orders = Order::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        return [
            'total_earnings' => $transactions->sum('amount'),
            'credits_sold' => $transactions->sum('credits'),
            'orders_completed' => $orders->count(),
            'total_transactions' => $transactions->count(),
        ];
    }

    /**
     * Calculate growth percentage
     */
    private function calculateGrowth($previous, $current)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        
        return round((($current - $previous) / $previous) * 100, 2);
    }

    /**
     * Get monthly breakdown for current year
     */
    private function getMonthlyBreakdown()
    {
        $currentYear = Carbon::now()->year;
        $breakdown = [];

        for ($month = 1; $month <= 12; $month++) {
            $startDate = Carbon::create($currentYear, $month, 1)->startOfMonth();
            $endDate = Carbon::create($currentYear, $month, 1)->endOfMonth();

            $stats = $this->calculateStats($startDate, $endDate);

            $breakdown[] = [
                'month' => $startDate->format('M'),
                'month_number' => $month,
                'earnings' => $stats['total_earnings'],
                'credits' => $stats['credits_sold'],
                'orders' => $stats['orders_completed'],
            ];
        }

        return $breakdown;
    }

    /**
     * Get detailed transaction report
     */
    public function transactions(Request $request)
    {
        $perPage = $request->get('per_page', 50);
        
        $transactions = Transaction::with('user')
            ->where('status', 'success')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => true,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Export report data (can be extended for CSV/PDF)
     */
    public function export(Request $request)
    {
        $period = $request->get('period', 'monthly');
        
        // Get report data
        $reportData = $this->index($request)->getData();

        // For now, return JSON (can be extended to generate CSV/PDF)
        return response()->json([
            'status' => true,
            'message' => 'Report data ready for export',
            'data' => $reportData,
        ]);
    }
}
