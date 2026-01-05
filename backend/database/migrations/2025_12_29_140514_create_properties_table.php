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
    Schema::create('properties', function (Blueprint $table) {
        $table->id();

        $table->foreignId('user_id')->constrained()->onDelete('cascade');

        $table->string('month_id');
        $table->string('primary_category');
        $table->string('property_type');

        $table->integer('bedroom');
        $table->integer('bathroom');

        $table->string('area');
        $table->text('place');

        $table->integer('price');
        $table->string('price_type');

        // price includes
        $table->boolean('electricity')->default(false);
        $table->boolean('water')->default(false);
        $table->boolean('security')->default(false);
        $table->boolean('gas')->default(false);
        $table->boolean('lift')->default(false);

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
