<?php

namespace App\Http\Controllers;

use App\Models\CashDraw;
use App\Models\Sale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    /**
     * Get sales summary.
     */
    public function summary(Request $request): JsonResponse
    {
        $query = Sale::query();

        if ($request->has('startDate') && $request->has('endDate')) {
            $query->whereBetween('date', [$request->startDate, $request->endDate]);
        }

        $sales = $query->orderBy('date', 'desc')->get();
        $totalSales = $sales->sum('total');
        $totalQuantity = $sales->sum('quantity');

        return response()->json([
            'sales' => $sales,
            'total_sales' => $totalSales,
            'total_quantity' => $totalQuantity,
        ]);
    }

    /**
     * Get sales grouped by period.
     */
    public function byPeriod(Request $request): JsonResponse
    {
        $groupBy = $request->query('groupBy', 'month');

        $sales = Sale::selectRaw("DATE_FORMAT(date, '%Y-%m') as period, SUM(total) as total, SUM(quantity) as quantity")
            ->groupBy('period')
            ->orderBy('period', 'desc')
            ->get();

        return response()->json($sales);
    }

    /**
     * Sync sales from cash draw.
     */
    public function syncFromCashDraw(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
        ]);

        $cashDrawItems = CashDraw::whereDate('date', $validated['date'])->get();

        $syncedSales = [];
        foreach ($cashDrawItems as $item) {
            $sale = Sale::create([
                'date' => $item->date,
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'total' => $item->quantity * $item->price,
            ]);
            $syncedSales[] = $sale;
        }

        return response()->json([
            'message' => 'Sales synced successfully',
            'synced_count' => count($syncedSales),
            'sales' => $syncedSales,
        ]);
    }

    /**
     * Get best sellers.
     */
    public function bestSellers(Request $request): JsonResponse
    {
        $limit = $request->query('limit', 10);

        $bestSellers = Sale::selectRaw('product_id, product_name, SUM(quantity) as total_quantity, SUM(total) as total_sales')
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('total_quantity')
            ->limit($limit)
            ->get();

        return response()->json($bestSellers);
    }

    /**
     * Get sales statistics.
     */
    public function stats(): JsonResponse
    {
        $today = now()->toDateString();
        $thisMonth = now()->format('Y-m');

        $stats = [
            'today_total' => Sale::whereDate('date', $today)->sum('total'),
            'today_count' => Sale::whereDate('date', $today)->count(),
            'month_total' => Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('total'),
            'month_count' => Sale::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->count(),
            'all_time_total' => Sale::sum('total'),
            'all_time_count' => Sale::count(),
        ];

        return response()->json($stats);
    }

    /**
     * Store a new sale.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'product_id' => 'required|string',
            'product_name' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        $validated['total'] = $validated['quantity'] * $validated['price'];

        $sale = Sale::create($validated);
        return response()->json($sale, 201);
    }

    /**
     * Delete a sale.
     */
    public function destroy($id): JsonResponse
    {
        $sale = Sale::findOrFail($id);
        $sale->delete();
        return response()->json(['message' => 'Sale deleted successfully']);
    }
}
