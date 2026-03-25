"use client";

import { useState, useEffect, useRef } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const doneCount = todos.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-start justify-center pt-16 pb-16 px-4">
      <div className="w-full max-w-lg">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
            ToDoリスト
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {activeCount > 0
              ? `${activeCount}件の未完了タスクがあります`
              : todos.length > 0
              ? "すべてのタスクが完了しています！"
              : "タスクを追加してはじめましょう"}
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-300 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition"
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-xl bg-slate-800 text-white text-sm font-medium shadow-sm hover:bg-slate-700 active:bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            追加
          </button>
        </div>

        {/* フィルタータブ */}
        {todos.length > 0 && (
          <div className="flex gap-1 mb-4 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
            {(
              [
                { key: "all", label: `すべて (${todos.length})` },
                { key: "active", label: `未完了 (${activeCount})` },
                { key: "done", label: `完了 (${doneCount})` },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${
                  filter === key
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* タスクリスト */}
        <div className="space-y-2">
          {filteredTodos.length === 0 && (
            <div className="text-center py-12 text-slate-300 text-sm">
              {filter === "done"
                ? "完了したタスクはありません"
                : filter === "active"
                ? "未完了のタスクはありません"
                : "タスクがありません"}
            </div>
          )}

          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border shadow-sm transition-all ${
                todo.completed
                  ? "border-slate-100 opacity-60"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* チェックボックス */}
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.completed
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-slate-300 hover:border-slate-400"
                }`}
                aria-label={todo.completed ? "未完了に戻す" : "完了にする"}
              >
                {todo.completed && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              {/* テキスト */}
              <span
                className={`flex-1 text-sm leading-relaxed transition-colors ${
                  todo.completed
                    ? "line-through text-slate-400"
                    : "text-slate-700"
                }`}
              >
                {todo.text}
              </span>

              {/* 削除ボタン */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all"
                aria-label="削除"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* 完了タスク一括削除 */}
        {doneCount > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={() =>
                setTodos((prev) => prev.filter((t) => !t.completed))
              }
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              完了済みを削除 ({doneCount}件)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
