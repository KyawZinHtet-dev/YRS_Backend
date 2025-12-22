<?php

namespace App\Services;

class ResponseService
{
    static function success($data = null, $message = 'success', $status = 200)
    {
        return response()->json([
            'data' => $data,
            'message' => $message,
        ], $status);
    }

    static function fail($message = 'fail', $status = 422)
    {
        return response()->json([
            'message' => $message,
        ], $status);
    }
}
