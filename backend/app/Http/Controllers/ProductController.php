<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(): JsonResponse
    {
        $products = Product::all();
        return response()->json($products);
    }

    /**
     * Display a single product.
     */
    public function show($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'sku' => 'nullable|string|unique:products',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'quantity' => 'required|integer|min:0',
                'category' => 'nullable|string',
                'barcode' => 'nullable|string|unique:products',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            // Handle image upload
            $imagePath = null;
            if ($request->hasFile('image')) {
                // Create images directory if it doesn't exist
                if (!file_exists(public_path('images'))) {
                    mkdir(public_path('images'), 0777, true);
                }
                
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images'), $imageName);
                $imagePath = 'images/' . $imageName;
            }

            $validated['image'] = $imagePath;

            $product = Product::create($validated);
            return response()->json($product, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update an existing product.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'sku' => 'sometimes|required|string|unique:products,sku,'.$id,
                'description' => 'nullable|string',
                'price' => 'sometimes|required|numeric|min:0',
                'quantity' => 'sometimes|required|integer|min:0',
                'category' => 'nullable|string',
                'barcode' => 'sometimes|nullable|string|unique:products,barcode,'.$id,
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                // Create images directory if it doesn't exist
                if (!file_exists(public_path('images'))) {
                    mkdir(public_path('images'), 0777, true);
                }
                
                // Delete old image if exists
                if ($product->image && file_exists(public_path($product->image))) {
                    unlink(public_path($product->image));
                }
                
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images'), $imageName);
                $validated['image'] = 'images/' . $imageName;
            }

            $product->update($validated);
            return response()->json($product);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove a product.
     */
    public function destroy($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    /**
     * Get inventory statistics.
     */
    public function inventoryStats(): JsonResponse
    {
        $stats = [
            'total_products' => Product::count(),
            'total_value' => Product::sum(\DB::raw('price * quantity')),
            'low_stock_count' => Product::where('quantity', '<', 10)->count(),
            'out_of_stock_count' => Product::where('quantity', 0)->count(),
            // Show individual products with their quantities
            'by_category' => Product::select('name', 'category', 'quantity')
                ->get()
                ->map(function ($item) {
                    return [
                        'category' => $item->name, // Show product name
                        'product_name' => $item->name,
                        'category_name' => $item->category ?: 'No Category',
                        'count' => 1,
                        'total_quantity' => $item->quantity,
                    ];
                })
                ->toArray(),
        ];

        return response()->json($stats);
    }

    /**
     * Search products by name, sku, or barcode.
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        
        if (empty($query)) {
            $products = Product::all();
            return response()->json($products);
        }

        $products = Product::where('name', 'like', "%{$query}%")
            ->orWhere('sku', 'like', "%{$query}%")
            ->orWhere('barcode', 'like', "%{$query}%")
            ->orWhere('category', 'like', "%{$query}%")
            ->get();

        return response()->json($products);
    }
}
