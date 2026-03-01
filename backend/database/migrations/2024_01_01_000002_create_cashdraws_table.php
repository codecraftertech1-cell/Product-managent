<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cashdraws', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('product_id');
            $table->string('product_name');
            $table->integer('quantity'); // Total packets
            $table->decimal('price', 10, 2); // Price per packet
            $table->integer('return_qty')->default(0); // Returned packets
            $table->integer('sold_qty')->default(0); // Sold packets
            $table->decimal('cost_price', 10, 2)->default(0); // Cost price for margin calculation
            $table->timestamps();

            $table->index(['date', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cashdraws');
    }
};
