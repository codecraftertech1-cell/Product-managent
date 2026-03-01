<?php

namespace App\Http\Controllers;

use App\Models\CashDraw;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QRCodeController extends Controller
{
    /**
     * Process scanned QR code and add to cash draw.
     * QR code format: "name: ProductName\nprice: 100"
     */
    public function processScannedQR(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'qr_data' => 'required|string',
            'date' => 'nullable|date',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $qrData = $validated['qr_data'];
        $date = $validated['date'] ?? now()->toDateString();
        $quantity = $validated['quantity'] ?? 1;

        // Parse the QR code data
        // Expected format: "name: ProductName\nprice: 100"
        $lines = explode("\n", $qrData);
        
        $productName = null;
        $productId = null;
        $price = null;

        foreach ($lines as $line) {
            $line = trim($line);
            if (str_starts_with($line, 'name:')) {
                $productName = trim(substr($line, 5));
                // Generate a simple product ID from name
                $productId = 'qr_' . strtolower(str_replace(' ', '_', $productName));
            } elseif (str_starts_with($line, 'price:')) {
                $price = (float) trim(substr($line, 6));
            }
        }

        // If parsing failed, try to handle it as a simple format
        if ($productName === null && $price === null) {
            // Try parsing as "name,price" format
            $parts = explode(',', $qrData);
            if (count($parts) >= 2) {
                $productName = trim($parts[0]);
                $price = (float) trim($parts[1]);
                $productId = 'qr_' . strtolower(str_replace(' ', '_', $productName));
            } else {
                // If just a number, assume it's a price with unknown product
                $price = (float) $qrData;
                $productName = 'Unknown Product';
                $productId = 'qr_unknown_' . time();
            }
        }

        if ($productName === null) {
            $productName = 'Unknown Product';
            $productId = 'qr_unknown_' . time();
        }

        if ($price === null) {
            $price = 0;
        }

        // Check if item already exists in cash draw for today
        $existingItem = CashDraw::whereDate('date', $date)
            ->where('product_id', $productId)
            ->first();

        if ($existingItem) {
            // Update quantity
            $existingItem->quantity += $quantity;
            $existingItem->save();
            
            return response()->json([
                'message' => 'Item quantity updated in cash draw',
                'item' => $existingItem,
                'action' => 'updated'
            ]);
        }

        // Create new item in cash draw
        $item = CashDraw::create([
            'date' => $date,
            'product_id' => $productId,
            'product_name' => $productName,
            'quantity' => $quantity,
            'price' => $price,
        ]);

        return response()->json([
            'message' => 'Item added to cash draw from QR code',
            'item' => $item,
            'action' => 'created'
        ], 201);
    }

    /**
     * Process scanned QR code and create a direct sale.
     */
    public function processScannedQRSale(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'qr_data' => 'required|string',
            'date' => 'nullable|date',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $qrData = $validated['qr_data'];
        $date = $validated['date'] ?? now()->toDateString();
        $quantity = $validated['quantity'] ?? 1;

        // Parse the QR code data
        $lines = explode("\n", $qrData);
        
        $productName = null;
        $productId = null;
        $price = null;

        foreach ($lines as $line) {
            $line = trim($line);
            if (str_starts_with($line, 'name:')) {
                $productName = trim(substr($line, 5));
                $productId = 'qr_' . strtolower(str_replace(' ', '_', $productName));
            } elseif (str_starts_with($line, 'price:')) {
                $price = (float) trim(substr($line, 6));
            }
        }

        // Fallback parsing
        if ($productName === null && $price === null) {
            $parts = explode(',', $qrData);
            if (count($parts) >= 2) {
                $productName = trim($parts[0]);
                $price = (float) trim($parts[1]);
                $productId = 'qr_' . strtolower(str_replace(' ', '_', $productName));
            } else {
                $price = (float) $qrData;
                $productName = 'Unknown Product';
                $productId = 'qr_unknown_' . time();
            }
        }

        if ($productName === null) {
            $productName = 'Unknown Product';
            $productId = 'qr_unknown_' . time();
        }

        if ($price === null) {
            $price = 0;
        }

        $total = $quantity * $price;

        // Create direct sale
        $sale = \App\Models\Sale::create([
            'date' => $date,
            'product_id' => $productId,
            'product_name' => $productName,
            'quantity' => $quantity,
            'price' => $price,
            'total' => $total,
        ]);

        return response()->json([
            'message' => 'Sale created from QR code',
            'sale' => $sale,
        ], 201);
    }
}
