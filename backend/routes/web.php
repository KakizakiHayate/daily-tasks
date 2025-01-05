<?php

use Illuminate\Support\Facades\Route;

// SPAのルーティングをフロントエンドに任せる
Route::get('/{path?}', function () {
    return view('app');
})->where('path', '.*');