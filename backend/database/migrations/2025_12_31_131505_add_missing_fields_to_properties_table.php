<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {

            // Basic info
            $table->integer('balcony')->nullable()->after('bathroom');
            $table->integer('floor')->nullable()->after('balcony');
            $table->tinyInteger('gender')->nullable()->after('floor');
            $table->integer('size')->nullable()->after('gender');

            // Location info
            $table->string('division')->default('Dhaka')->after('size');
            $table->string('district')->default('Dhaka')->after('division');
            $table->string('subarea')->nullable()->after('area');
            $table->string('sector_no')->nullable();
            $table->string('road_no')->nullable();
            $table->string('house_no')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'balcony',
                'floor',
                'gender',
                'size',
                'division',
                'district',
                'subarea',
                'sector_no',
                'road_no',
                'house_no',
            ]);
        });
    }
};
