<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('property_unlocks', function (Blueprint $table) {
            $table->id();

            // 🔑 Who unlocked the property
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // 🏠 Which property was unlocked
            $table->foreignId('property_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // ⏰ When unlocked
            $table->timestamps();

            // ❌ Prevent duplicate unlock (same user + same property)
            $table->unique(['user_id', 'property_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_unlocks');
    }
};
