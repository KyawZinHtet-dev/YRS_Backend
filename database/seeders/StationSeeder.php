<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use App\Repositories\StationRepository;

class StationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stations = json_decode(file_get_contents(asset('json/station.json')));
        foreach ($stations as $station) {
            (new StationRepository())->create([
                'slug' => Str::slug($station->title . '-' . Str::random(5)),
                'title' => $station->title,
                'description' => $station->description,
                'latitude' => $station->latitude,
                'longitude' => $station->longitude,
            ]);
        }
    }
}
