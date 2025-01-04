<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Exception;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            // バリデーションの実行
            $request->validate([
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            // ユーザー作成
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // トークン発行
            $token = $user->createToken('auth_token')->plainTextToken;

            // 成功レスポンス
            return response()->json([
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => $user,
            ], 201);

        } catch (ValidationException $e) {
            // バリデーション失敗時のレスポンス
            // errors() でエラー内容を配列形式で取得
            return response()->json([
                'message' => 'Validation error.',
                'errors'  => $e->errors(),
            ], 422);

        } catch (Exception $e) {
            // 一般的なエラー時のレスポンス
            return response()->json([
                'message' => 'An error occurred while registering.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
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
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'ログアウトしました']);
    }
} 