<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->enum('admin_status', ['pending', 'accepted', 'cancelled'])
                  ->default('pending')
                  ->after('status');
        });
    }

    public function down()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn('admin_status');
        });
    }
};
