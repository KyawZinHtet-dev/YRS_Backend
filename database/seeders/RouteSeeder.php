<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use function Illuminate\Log\log;
use Illuminate\Support\Facades\DB;

use App\Repositories\RouteRepository;
use App\Repositories\StationRepository;

class RouteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $default_routes = json_decode(file_get_contents(public_path('json/route.json')));
        foreach ($default_routes as $default_route) {
            $schedules = [];
            $time = $default_route->departure_time;
            foreach ($default_route->station_ids as $station_id) {
                $schedules[$station_id] = [
                    'time' => $time,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
                $time = Carbon::parse($time)->addMinutes(5)->format('H:i:s');
            }
            DB::beginTransaction();
            try {
                $route = (new RouteRepository())->create([
                    'slug' => Str::slug($default_route->title . '-' . Str::random(5)),
                    'title' => $default_route->title,
                    'description' => $default_route->description,
                    'direction' => $default_route->direction,
                ]);
                $route->stations()->sync($schedules);
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                log($e);
            }
        }
    }
}
