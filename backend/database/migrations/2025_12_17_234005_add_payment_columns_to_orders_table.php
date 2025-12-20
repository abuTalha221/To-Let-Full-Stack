<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {

            // 🔑 Order reference
            $table->string('order_code')->after('user_id');

            // 💳 Payment info
            $table->enum('payment_status', ['unpaid', 'paid', 'failed'])
                  ->default('unpaid')
                  ->after('cost');

            $table->string('payment_method')->nullable()->after('payment_status');
            $table->string('transaction_id')->nullable()->after('payment_method');
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'order_code',
                'payment_status',
                'payment_method',
                'transaction_id',
            ]);
        });
    }
};
