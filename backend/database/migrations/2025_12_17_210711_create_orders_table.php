<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // User (nullable for guest orders)
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');

            // Location
            $table->string('division');
            $table->string('district');
            $table->string('area');
            $table->string('subarea')->nullable();

            // Property details
            $table->string('category');
            $table->integer('room');
            $table->integer('move_in_month');
            $table->integer('budget');

            // Extra
            $table->text('details')->nullable();

            // Package & payment
            $table->string('package_code');
            $table->integer('cost');

            // Contact info
            $table->string('contact_name')->nullable();
            $table->string('contact_phone');
            $table->string('contact_email')->nullable();

            // Status
            $table->string('status')->default('pending'); // pending | paid | cancelled

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
