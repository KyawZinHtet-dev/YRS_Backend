<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ticket;
use App\Models\WalletTransaction;
use App\Models\TopUpHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getSummaryStats(Request $request)
    {
        $month = $request->get('month', date('n'));
        $year = $request->get('year', date('Y'));
        
        // Define filters correctly
        $isFilteringByMonth = $month && $month !== 'all' && $month !== 'null';
        $isFilteringByYear = $year && $year != date('Y');
        
        // 1. Total Counts (All-Time)
        $totalUsers = User::count();
        $totalTickets = Ticket::count();
        $totalRevenue = WalletTransaction::where(function($q) {
            $q->where(function($sq) { $sq->where('type', 'buy_ticket')->where('method', 'reduce'); })
              ->orWhere(function($sq) { $sq->whereIn('type', ['manual', 'top_up'])->where('method', 'add'); });
        })->sum('amount');
        $totalTransactions = WalletTransaction::count();
        $totalTopUps = TopUpHistory::where('status', 'approve')->sum('amount');
        
        // 2. Data for comparison/display (Filtered to the selected year/month)
        if (!$isFilteringByMonth) {
            // Total for the selected year
            $newUsersThisMonth = User::whereYear('created_at', $year)->count();
            $ticketsThisMonth = Ticket::whereYear('created_at', $year)->count();
            
            $revenueThisMonth = WalletTransaction::whereYear('created_at', $year)
                ->where(function($q) {
                    $q->where(function($sq) { $sq->where('type', 'buy_ticket')->where('method', 'reduce'); })
                      ->orWhere(function($sq) { $sq->whereIn('type', ['manual', 'top_up'])->where('method', 'add'); });
                })
                ->sum('amount');
                
            $transactionsThisMonth = WalletTransaction::whereYear('created_at', $year)->count();
            $topUpsThisMonth = TopUpHistory::where('status', 'approve')
                ->whereYear('created_at', $year)
                ->sum('amount');
        } else {
            // Data for specific month and year
            $newUsersThisMonth = User::whereMonth('created_at', $month)->whereYear('created_at', $year)->count();
            $ticketsThisMonth = Ticket::whereMonth('created_at', $month)->whereYear('created_at', $year)->count();
            
            $revenueThisMonth = WalletTransaction::whereMonth('created_at', $month)
                ->whereYear('created_at', $year)
                ->where(function($q) {
                    $q->where(function($sq) { $sq->where('type', 'buy_ticket')->where('method', 'reduce'); })
                      ->orWhere(function($sq) { $sq->whereIn('type', ['manual', 'top_up'])->where('method', 'add'); });
                })
                ->sum('amount');
                
            $transactionsThisMonth = WalletTransaction::whereMonth('created_at', $month)
                ->whereYear('created_at', $year)
                ->count();
            $topUpsThisMonth = TopUpHistory::where('status', 'approve')
                ->whereMonth('created_at', $month)
                ->whereYear('created_at', $year)
                ->sum('amount');
        }
        
        // Always show current status for these regardless of filters
        $activeTickets = Ticket::where('expired_at', '>', now())->count();
        $expiredTickets = Ticket::where('expired_at', '<=', now())->count();
        $pendingTopUps = TopUpHistory::where('status', 'pending')->sum('amount');

        // Create filter description
        $isFiltering = $isFilteringByMonth || $isFilteringByYear;
        $filterDescription = '';
        if ($isFilteringByMonth && $isFilteringByYear) {
            $filterDescription = Carbon::createFromDate($year, $month, 1)->format('F Y');
        } elseif ($isFilteringByYear) {
            $filterDescription = $year;
        } elseif ($isFilteringByMonth) {
            $filterDescription = Carbon::createFromDate(date('Y'), (int)$month, 1)->format('F');
        }

        return response()->json([
            'totalUsers' => $totalUsers,
            'newUsersThisMonth' => $newUsersThisMonth,
            'totalTickets' => $totalTickets,
            'ticketsThisMonth' => $ticketsThisMonth,
            'activeTickets' => $activeTickets,
            'expiredTickets' => $expiredTickets,
            'totalRevenue' => $totalRevenue,
            'revenueThisMonth' => $revenueThisMonth,
            'totalTransactions' => $totalTransactions,
            'transactionsThisMonth' => $transactionsThisMonth,
            'totalTopUps' => $totalTopUps,
            'topUpsThisMonth' => $topUpsThisMonth,
            'pendingTopUps' => $pendingTopUps,
            'isFiltered' => $isFiltering,
            'filterMonth' => $filterDescription,
            'selectedYear' => $year,
            'selectedMonth' => $month,
        ]);
    }

    public function getMonthlyData(Request $request)
    {
        $month = $request->get('month', date('n'));
        $year = $request->get('year', date('Y'));
        
        $isFilteringByMonth = $month && $month !== 'all' && $month !== 'null';

        // Initialize empty structure
        $dataMap = [];
        if ($isFilteringByMonth) {
            $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;
            for ($d = 1; $d <= $daysInMonth; $d++) {
                $label = Carbon::createFromDate($year, $month, $d)->format('d M');
                $dataMap[$d] = [
                    'label' => $label,
                    'userRegistrations' => 0,
                    'ticketSales' => 0,
                    'ticketRevenue' => 0,
                    'manual' => 0,
                    'top_up' => 0,
                    'buy_ticket' => 0,
                ];
            }
        } else {
            for ($m = 1; $m <= 12; $m++) {
                $label = Carbon::createFromDate($year, $m, 1)->format('M Y');
                $dataMap[$m] = [
                    'label' => $label,
                    'userRegistrations' => 0,
                    'ticketSales' => 0,
                    'ticketRevenue' => 0,
                    'manual' => 0,
                    'top_up' => 0,
                    'buy_ticket' => 0,
                ];
            }
        }

        // 1. User Registrations
        $userRegistrations = User::select(
                DB::raw($isFilteringByMonth ? 'DAY(created_at) as period' : 'MONTH(created_at) as period'),
                DB::raw('COUNT(*) as count')
            )
            ->whereYear('created_at', $year)
            ->when($isFilteringByMonth, fn($q) => $q->whereMonth('created_at', $month))
            ->groupBy('period')
            ->get();

        foreach ($userRegistrations as $item) {
            if (isset($dataMap[$item->period])) {
                $dataMap[$item->period]['userRegistrations'] = (int)$item->count;
            }
        }

        // 2. Ticket Sales
        $ticketSales = Ticket::select(
                DB::raw($isFilteringByMonth ? 'DAY(created_at) as period' : 'MONTH(created_at) as period'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(price) as revenue')
            )
            ->whereYear('created_at', $year)
            ->when($isFilteringByMonth, fn($q) => $q->whereMonth('created_at', $month))
            ->groupBy('period')
            ->get();

        foreach ($ticketSales as $item) {
            if (isset($dataMap[$item->period])) {
                $dataMap[$item->period]['ticketSales'] = (int)$item->count;
                $dataMap[$item->period]['ticketRevenue'] = (float)$item->revenue;
            }
        }

        // 3. Revenue Details (Manual, Top Up, Buy Ticket)
        $revenues = WalletTransaction::select(
                DB::raw($isFilteringByMonth ? 'DAY(created_at) as period' : 'MONTH(created_at) as period'),
                DB::raw('SUM(CASE WHEN type = "manual" AND method = "add" THEN amount ELSE 0 END) as manual'),
                DB::raw('SUM(CASE WHEN type = "top_up" AND method = "add" THEN amount ELSE 0 END) as top_up'),
                DB::raw('SUM(CASE WHEN type = "buy_ticket" AND method = "reduce" THEN amount ELSE 0 END) as buy_ticket')
            )
            ->whereYear('created_at', $year)
            ->when($isFilteringByMonth, fn($q) => $q->whereMonth('created_at', $month))
            ->groupBy('period')
            ->get();

        foreach ($revenues as $item) {
            if (isset($dataMap[$item->period])) {
                $dataMap[$item->period]['manual'] = (float)$item->manual;
                $dataMap[$item->period]['top_up'] = (float)$item->top_up;
                $dataMap[$item->period]['buy_ticket'] = (float)$item->buy_ticket;
            }
        }

        // 4. Pie Distribution Data (Always scoped to the selected period)
        $transactionTypes = WalletTransaction::select('type', DB::raw('COUNT(*) as count'))
            ->whereYear('created_at', $year)
            ->when($isFilteringByMonth, fn($q) => $q->whereMonth('created_at', $month))
            ->groupBy('type')
            ->get()
            ->map(fn($item) => ['type' => ucfirst(str_replace('_', ' ', $item->type)), 'count' => $item->count]);

        $ticketTypes = Ticket::select('type', DB::raw('COUNT(*) as count'))
            ->whereYear('created_at', $year)
            ->when($isFilteringByMonth, fn($q) => $q->whereMonth('created_at', $month))
            ->groupBy('type')
            ->get()
            ->map(fn($item) => [
                'type' => $item->type === 'one_time_ticket' ? 'One Time Ticket' : 'One Month Ticket',
                'count' => $item->count
            ]);

        $transactionMethods = WalletTransaction::select('method', DB::raw('COUNT(*) as count'))
            ->whereYear('created_at', $year)
            ->when($isFilteringByMonth, fn($q) => $q->whereMonth('created_at', $month))
            ->groupBy('method')
            ->get()
            ->map(fn($item) => [
                'method' => ucfirst($item->method),
                'count' => $item->count
            ]);

        // Transform back to indexed array for the frontend
        $data = array_values($dataMap);

        return response()->json([
            'userRegistrations' => array_map(fn($d) => ['label' => $d['label'], 'count' => $d['userRegistrations']], $data),
            'ticketSales' => array_map(fn($d) => ['label' => $d['label'], 'count' => $d['ticketSales'], 'revenue' => $d['ticketRevenue']], $data),
            'monthlyRevenue' => array_map(fn($d) => [
                'label' => $d['label'], 
                'manual' => $d['manual'], 
                'top_up' => $d['top_up'], 
                'buy_ticket' => $d['buy_ticket']
            ], $data),
            'transactionTypes' => $transactionTypes,
            'ticketTypes' => $ticketTypes,
            'transactionMethods' => $transactionMethods,
        ]);
    }

    public function getFilteredData(Request $request)
    {
        $month = $request->get('month');
        $year = $request->get('year');
        
        if (!$month || !$year) {
            return response()->json(['error' => 'Month and year are required'], 400);
        }

        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth();

        // Get filtered data for the specific month
        $users = User::whereBetween('created_at', [$startDate, $endDate])->count();
        $tickets = Ticket::whereBetween('created_at', [$startDate, $endDate])->get();
        $revenue = WalletTransaction::whereBetween('created_at', [$startDate, $endDate])
            ->where('type', 'buy_ticket')
            ->where('method', 'reduce')
            ->sum('amount');
        $transactions = WalletTransaction::whereBetween('created_at', [$startDate, $endDate])->count();
        $topUps = TopUpHistory::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'approve')
            ->sum('amount');

        return response()->json([
            'users' => $users,
            'tickets' => $tickets->count(),
            'revenue' => $revenue,
            'transactions' => $transactions,
            'topUps' => $topUps,
            'ticketDetails' => $tickets->groupBy('type')->map->count(),
            'month' => $startDate->format('F Y'),
        ]);
    }
}
