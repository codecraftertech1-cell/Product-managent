<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashDraw extends Model
{
    use HasFactory;

    protected $table = 'cashdraws';

    protected $fillable = [
        'date',
        'product_id',
        'product_name',
        'quantity',
        'price',
        'return_qty',
        'sold_qty',
        'cost_price',
    ];

    protected $casts = [
        'date' => 'date',
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'return_qty' => 'integer',
        'sold_qty' => 'integer',
        'cost_price' => 'decimal:2',
    ];

    // Calculate total revenue
    public function getTotalRevenueAttribute()
    {
        return $this->sold_qty * $this->price;
    }

    // Calculate total cost
    public function getTotalCostAttribute()
    {
        return $this->sold_qty * $this->cost_price;
    }

    // Calculate margin (profit)
    public function getMarginAttribute()
    {
        return $this->total_revenue - $this->total_cost;
    }

    // Calculate margin percentage
    public function getMarginPercentageAttribute()
    {
        if ($this->total_revenue == 0) return 0;
        return round(($this->margin / $this->total_revenue) * 100, 2);
    }

    // Calculate revenue margin (same as margin percentage)
    public function getRevenueMarginAttribute()
    {
        return $this->margin_percentage;
    }
}
