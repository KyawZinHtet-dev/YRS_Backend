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
        Schema::create('ticket_pricings', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['one_time_ticket', 'one_month_ticket']);
            $table->integer('price');
            $table->integer('offer_quantity');
            $table->integer('remain_quantity');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_pricings');
    }
};
