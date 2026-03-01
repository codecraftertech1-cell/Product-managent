<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check (public)
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'message' => 'Laravel API is running']);
});

// Authentication (public)
Route::post('/auth/login', [\App\Http\Controllers\AuthController::class, 'login']);

// Protected authentication routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::post('/auth/change-password', [\App\Http\Controllers\AuthController::class, 'changePassword']);
    Route::get('/auth/me', [\App\Http\Controllers\AuthController::class, 'me']);
});

// QR Code processing (public - for scanning)
Route::post('/qrcode/process', [\App\Http\Controllers\QRCodeController::class, 'processScannedQR']);
Route::post('/qrcode/sale', [\App\Http\Controllers\QRCodeController::class, 'processScannedQRSale']);

// Products (public - no auth required)
Route::get('/products', [\App\Http\Controllers\ProductController::class, 'index']);
Route::get('/products/search', [\App\Http\Controllers\ProductController::class, 'search']);
Route::get('/products/{id}', [\App\Http\Controllers\ProductController::class, 'show']);
Route::post('/products', [\App\Http\Controllers\ProductController::class, 'store']);
Route::put('/products/{id}', [\App\Http\Controllers\ProductController::class, 'update']);
Route::delete('/products/{id}', [\App\Http\Controllers\ProductController::class, 'destroy']);
Route::get('/products/stats/inventory', [\App\Http\Controllers\ProductController::class, 'inventoryStats']);

// CashDraw (public - no auth)
Route::get('/cashdraw', [\App\Http\Controllers\CashDrawController::class, 'index']);
Route::get('/cashdraw/history', [\App\Http\Controllers\CashDrawController::class, 'history']);
Route::post('/cashdraw/add-item', [\App\Http\Controllers\CashDrawController::class, 'addItem']);
Route::post('/cashdraw/remove-item', [\App\Http\Controllers\CashDrawController::class, 'removeItem']);
Route::post('/cashdraw/update-item', [\App\Http\Controllers\CashDrawController::class, 'updateItem']);
Route::post('/cashdraw/update-field', [\App\Http\Controllers\CashDrawController::class, 'updateField']);
Route::delete('/cashdraw/clear', [\App\Http\Controllers\CashDrawController::class, 'clear']);

// Sales (public - no auth)
Route::get('/sales/summary', [\App\Http\Controllers\SalesController::class, 'summary']);
Route::get('/sales/by-period', [\App\Http\Controllers\SalesController::class, 'byPeriod']);
Route::post('/sales/sync-from-cashdraw', [\App\Http\Controllers\SalesController::class, 'syncFromCashDraw']);
Route::get('/sales/best-sellers', [\App\Http\Controllers\SalesController::class, 'bestSellers']);
Route::get('/sales/stats', [\App\Http\Controllers\SalesController::class, 'stats']);
Route::post('/sales', [\App\Http\Controllers\SalesController::class, 'store']);
Route::delete('/sales/{id}', [\App\Http\Controllers\SalesController::class, 'destroy']);
