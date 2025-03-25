'use client';

import 'jotai-devtools/styles.css';

import { useState } from 'react';

import { useAtom } from 'jotai';
import { DevTools } from 'jotai-devtools';

import {
  countAtom,
  type Todo,
  todosAtom,
} from '../../../../atoms';

export default function Home() {
    return (
        <>
            <DevTools />
            <HomeContent />
        </>
    );
}

function HomeContent() {
    const [count, setCount] = useAtom(countAtom);
    const [todos, setTodos] = useAtom(todosAtom);
    const [newTodo, setNewTodo] = useState('');


    const addTodo = () => {
        if (newTodo.trim()) {
            const todo: Todo = {
                id: Date.now(),
                text: newTodo,
                completed: false
            };
            setTodos([...todos, todo]);
            setNewTodo('');
        }
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-md mx-auto space-y-8">
                {/* 计数器部分 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">计数器示例</h2>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCount(c => c - 1)}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            减少
                        </button>
                        <span className="text-2xl">{count}</span>
                        <button
                            onClick={() => setCount(c => c + 1)}
                            className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                            增加
                        </button>
                    </div>
                </div>

                {/* 待办事项列表部分 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">待办事项列表</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                            className="flex-1 px-4 py-2 border rounded"
                            placeholder="添加新待办事项"
                        />
                        <button
                            onClick={addTodo}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            添加
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {todos.map(todo => (
                            <li
                                key={todo.id}
                                className="flex items-center gap-2 p-2 border rounded"
                            >
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id)}
                                />
                                <span className={todo.completed ? 'line-through' : ''}>
                                    {todo.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>


    );
}