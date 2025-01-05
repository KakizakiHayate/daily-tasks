<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\AuthController;

// Redirect users based on their authentication status
Route::get('/', function () {
    return Auth::check() ? redirect('/dashboard') : redirect('/login');
});