<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Exception;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);

            Auth::login($user);

            return response()->json([
                'user' => $user,
                'message' => '登録が完了しました',
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error.',
                'errors'  => $e->errors(),
            ], 422);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while registering.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (!Auth::attempt($request->only('email', 'password'))) {
                throw ValidationException::withMessages([
                    'email' => ['認証情報が正しくありません。'],
                ]);
            }

            $user = User::where('email', $request->email)->firstOrFail();

            return response()->json([
                'user' => $user,
                'message' => 'ログインしました',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error.',
                'errors'  => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'ログインに失敗しました',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
    
            return response()->json([
                'message' => 'ログアウトしました',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'ログアウトに失敗しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteAccount(Request $request)
    {
        try {
            $user = Auth::user();
            
            // 論理削除を実行
            $user->update([
                'is_deleted' => true,
                'deleted_at' => Carbon::now(),
            ]);

            // ログアウト処理
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'message' => 'アカウントが削除されました',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'アカウントの削除に失敗しました',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
} 