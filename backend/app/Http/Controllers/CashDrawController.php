<?php

namespace App\Http\Controllers;

use App\Models\CashDraw;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CashDrawController extends Controller
{
    /**
     * Get cash draw items for a date.
     */
    public function index(Request $request): JsonResponse
    {
        $date = $request->query('date', now()->toDateString());
        $items = CashDraw::whereDate('date', $date)->get();
        
        // Calculate totals
        $totalQuantity = $items->sum('quantity');
        $totalSold = $items->sum('sold_qty');
        $totalReturn = $items->sum('return_qty');
        $totalRevenue = $items->sum(fn($item) => $item->sold_qty * $item->price);
        $totalCost = $items->sum(fn($item) => $item->sold_qty * $item->cost_price);
        $totalMargin = $totalRevenue - $totalCost;

        return response()->json([
            'date' => $date,
            'items' => $items,
            'total' => $totalRevenue,
            'total_quantity' => $totalQuantity,
            'total_sold' => $totalSold,
            'total_return' => $totalReturn,
            'total_cost' => $totalCost,
            'total_margin' => $totalMargin,
        ]);
    }

    /**
     * Get cash draw history.
     */
    public function history(Request $request): JsonResponse
    {
        $query = CashDraw::query();

        if ($request->has('startDate') && $request->has('endDate')) {
            $query->whereBetween('date', [$request->startDate, $request->endDate]);
        }

        $items = $query->orderBy('date', 'desc')->get();
        return response()->json($items);
    }

    /**
     * Add item to cash draw.
     */
    public function addItem(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'date' => 'required|date',
                'productId' => 'required|string',
                'productName' => 'required|string',
                'quantity' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0',
                'return_qty' => 'nullable|integer|min:0',
                'sold_qty' => 'nullable|integer|min:0',
                'cost_price' => 'nullable|numeric|min:0',
            ]);

            $item = CashDraw::create([
                'date' => $validated['date'],
                'product_id' => $validated['productId'],
                'product_name' => $validated['productName'],
                'quantity' => $validated['quantity'],
                'price' => $validated['price'],
                'return_qty' => $validated['return_qty'] ?? 0,
                'sold_qty' => $validated['sold_qty'] ?? 0,
                'cost_price' => $validated['cost_price'] ?? 0,
            ]);

            return response()->json($item, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove item from cash draw.
     */
    public function removeItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'productId' => 'required|string',
        ]);

        CashDraw::whereDate('date', $validated['date'])
            ->where('product_id', $validated['productId'])
            ->delete();

        return response()->json(['message' => 'Item removed successfully']);
    }

    /**
     * Update item in cash draw.
     */
    public function updateItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'productId' => 'required|string',
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'return_qty' => 'nullable|integer|min:0',
            'sold_qty' => 'nullable|integer|min:0',
            'cost_price' => 'nullable|numeric|min:0',
        ]);

        $item = CashDraw::whereDate('date', $validated['date'])
            ->where('product_id', $validated['productId'])
            ->firstOrFail();

        $item->update([
            'quantity' => $validated['quantity'],
            'price' => $validated['price'],
            'return_qty' => $validated['return_qty'] ?? 0,
            'sold_qty' => $validated['sold_qty'] ?? 0,
            'cost_price' => $validated['cost_price'] ?? 0,
        ]);

        return response()->json($item);
    }

    /**
     * Update specific field in cash draw item.
     */
    public function updateField(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'productId' => 'required|string',
            'field' => 'required|string',
            'value' => 'required',
        ]);

        $item = CashDraw::whereDate('date', $validated['date'])
            ->where('product_id', $validated['productId'])
            ->firstOrFail();

        $allowedFields = ['quantity', 'price', 'return_qty', 'sold_qty', 'cost_price'];
        
        if (!in_array($validated['field'], $allowedFields)) {
            return response()->json(['error' => 'Invalid field'], 400);
        }

        $item->update([
            $validated['field'] => $validated['value'],
        ]);

        return response()->json($item);
    }

    /**
     * Clear cash draw for a date.
     */
    public function clear(Request $request): JsonResponse
    {
        $date = $request->query('date');

        CashDraw::whereDate('date', $date)->delete();

        return response()->json(['message' => 'Cash draw cleared successfully']);
    }
}
