<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\DashboardController;

// 認証系エンドポイント
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// 認証が必要なエンドポイント
Route::middleware('auth:sanctum')->group(function () {
    // 現在のユーザー情報取得
    Route::get('/user', function (Request $request) {
        Log::info('user/まできました');
        Log::info('SANCTUM_STATEFUL_DOMAINS: ' . env('SANCTUM_STATEFUL_DOMAINS'));
        Log::info('Configured domains: ' . implode(',', config('sanctum.stateful')));
        return [
            'user' => $request->user(),
            'debug' => [
                'env_domains' => env('SANCTUM_STATEFUL_DOMAINS'),
                'config_domains' => config('sanctum.stateful')
            ]
        ];
    });

    // ダッシュボード
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // アカウント削除
    Route::delete('/account', [AuthController::class, 'deleteAccount']);

    Route::apiResource('tasks', TaskController::class);
});
