<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('package_name')->nullable();
            $table->integer('credits')->default(0);
            $table->decimal('amount', 10, 2)->default(0);
            $table->string('payment_gateway')->default('sslcommerz');
            $table->string('transaction_id')->nullable(); // ssl's tran_id or val_id
            $table->string('status')->default('pending'); // pending, success, failed
            $table->json('raw_response')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
