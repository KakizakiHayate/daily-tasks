<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    public function index()
    {
        // JSTでの今日の開始時刻と終了時刻を取得
        $todayStart = now()->setTimezone('Asia/Tokyo')->startOfDay();
        $todayEnd = $todayStart->copy()->endOfDay();

        $tasks = Task::where('user_id', Auth::id())
            ->whereBetween('due_date', [$todayStart, $todayEnd])
            ->with(['taskLogs'])
            ->orderBy('due_date', 'asc')
            ->get();
        
        Log::debug('取得されたタスク:', [
            'total_count' => $tasks->count(),
            'completed_count' => $tasks->where('is_completed', true)->count(),
            'tasks' => $tasks->toArray(),
            'date_range' => [
                'today_start' => $todayStart->toDateTimeString(),
                'today_end' => $todayEnd->toDateTimeString(),
            ]
        ]);
        
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:high,medium,low',
            'due_date' => 'nullable|date',
        ]);

        // 日付に時刻情報を追加（その日の開始時刻を使用）
        if ($validated['due_date']) {
            $due_date = \Carbon\Carbon::parse($validated['due_date'])
                ->setTimezone('Asia/Tokyo')
                ->startOfDay();
        } else {
            $due_date = null;
        }

        $task = Task::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'priority' => $validated['priority'],
            'due_date' => $due_date,
            'is_completed' => false,
        ]);

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($task->load('taskLogs'));
    }

    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:high,medium,low',
            'due_date' => 'nullable|date',
            'is_completed' => 'boolean',
        ]);

        // タスク完了時は due_date を変更しない
        if ($request->has('is_completed') && $validated['is_completed']) {
            $task->update([
                'is_completed' => true
            ]);

            if (!$task->taskLogs()->exists()) {
                TaskLog::create([
                    'task_id' => $task->id,
                    'user_id' => Auth::id(),
                    'completed_at' => now(),
                ]);
            }
        } else {
            // 通常の更新時は due_date を含めて更新
            if ($validated['due_date']) {
                $validated['due_date'] = \Carbon\Carbon::parse($validated['due_date'])
                    ->setTimezone('Asia/Tokyo')
                    ->startOfDay();
            }
            $task->update($validated);
        }

        return response()->json($task->fresh('taskLogs'));
    }

    public function destroy(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->json(null, 204);
    }
}
