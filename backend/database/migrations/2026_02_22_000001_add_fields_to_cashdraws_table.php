<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cashdraws', function (Blueprint $table) {
            $table->integer('return_qty')->default(0)->after('price');
            $table->integer('sold_qty')->default(0)->after('return_qty');
            $table->decimal('cost_price', 10, 2)->default(0)->after('sold_qty');
        });
    }

    public function down(): void
    {
        Schema::table('cashdraws', function (Blueprint $table) {
            $table->dropColumn(['return_qty', 'sold_qty', 'cost_price']);
        });
    }
};
