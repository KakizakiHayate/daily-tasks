<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;

// 認証系エンドポイント
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// 認証が必要なエンドポイント
Route::middleware('auth:sanctum')->group(function () {
    // 現在のユーザー情報取得
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // // ユーザー情報の更新
    // Route::put('/user', [UserController::class, 'update']);

    // // ユーザー情報の削除
    // Route::delete('/user', [UserController::class, 'delete']);
});
