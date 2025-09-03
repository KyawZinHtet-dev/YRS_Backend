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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->nullable();
            $table->bigInteger('user_id');
            $table->bigInteger('ticket_pricing_id');
            $table->enum('type', ['one_time_ticket', 'one_month_ticket']);
            $table->enum('direction', ['clockwise', 'anticlockwise', 'both']);
            $table->integer('price');
            $table->timestamp('valid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
