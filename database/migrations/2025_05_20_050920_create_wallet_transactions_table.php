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
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id')->unique("transaction_id_unique");
            $table->bigInteger('user_id');
            $table->bigInteger('wallet_id');
            $table->integer('amount');
            $table->text('description')->nullable();
            $table->bigInteger('sourceable_id')->nullable();
            $table->string('sourceable_type')->nullable();
            $table->enum('method', ['add', 'reduce']);
            $table->enum('type', ['manual', 'top_up', 'buy_ticket']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
    }
};
