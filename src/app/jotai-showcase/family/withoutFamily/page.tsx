'use client';

import {
  useCallback,
  useState,
} from 'react';

import {
  atom,
  useAtom,
} from 'jotai';

// 定义一个 Todo 类型
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

// 创建一个存储所有 todos 的 atom
const todosAtom = atom<Record<number, Todo>>({});

// Todo 项组件
function TodoItem({ id }: { id: number }) {
    const [todos, setTodos] = useAtom(todosAtom);
    const todo = todos[id];

    const toggleComplete = () => {
        setTodos(prev => ({
            ...prev,
            [id]: { ...prev[id], completed: !prev[id].completed }
        }));
    };

    const updateText = (text: string) => {
        setTodos(prev => ({
            ...prev,
            [id]: { ...prev[id], text }
        }));
    };

    return (
        <div className="flex items-center gap-2 p-2 border rounded mb-2">
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={toggleComplete}
                className="h-4 w-4"
            />
            <input
                type="text"
                value={todo.text}
                onChange={(e) => updateText(e.target.value)}
                className={`flex-1 px-2 py-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
            />
        </div>
    );
}

// 显示最后一个 Todo 的状态组件
function LastTodoStatus() {
    const [todos] = useAtom(todosAtom);
    const todoIds = Object.keys(todos).map(Number);
    const lastId = todoIds[todoIds.length - 1];

    if (lastId === undefined) {
        return <div className="text-gray-500">没有 Todo 项</div>;
    }

    const todo = todos[lastId];

    return (
        <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-bold mb-2">最后一个 Todo 的状态（实时同步）：</h3>
            <p>ID: {todo.id}</p>
            <p>内容: {todo.text}</p>
            <p>状态: {todo.completed ? '已完成' : '未完成'}</p>
            <p className="text-sm text-gray-500 mt-2">
                提示：修改上面最后一个 Todo 的内容，这里会实时同步更新
            </p>
        </div>
    );
}

// 主页面组件
export default function WithoutFamily() {
    const [todos, setTodos] = useAtom(todosAtom);
    const [nextId, setNextId] = useState(1);

    // 添加新的 todo
    const addTodo = useCallback(() => {
        setTodos(prev => ({
            ...prev,
            [nextId]: {
                id: nextId,
                text: '',
                completed: false
            }
        }));
        setNextId(id => id + 1);
    }, [nextId]);

    // 删除最后一个 todo
    const removeLast = useCallback(() => {
        const todoIds = Object.keys(todos).map(Number);
        const lastId = todoIds[todoIds.length - 1];
        if (lastId !== undefined) {
            setTodos(prev => {
                const newTodos = { ...prev };
                delete newTodos[lastId];
                return newTodos;
            });
        }
    }, [todos]);

    const todoIds = Object.keys(todos).map(Number);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Todo List without atomFamily</h1>
                <div className="mb-6 space-y-4">
                    <div className="bg-blue-50 p-4 rounded">
                        <h2 className="font-bold text-lg mb-2">🎯 实现说明</h2>
                        <p className="text-gray-700">
                            这个示例展示了不使用 atomFamily 时如何实现相同的功能。
                            使用单个 atom 存储所有 todos，通过对象形式管理。
                        </p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded">
                        <h2 className="font-bold text-lg mb-2">⚠️ 与 atomFamily 的区别</h2>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>所有状态在一个 atom 中，更新会触发所有组件重渲染</li>
                            <li>没有自动的内存管理机制</li>
                            <li>状态更新需要手动处理对象拷贝</li>
                            <li>无法利用 atom 级别的缓存优化</li>
                        </ul>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={addTodo}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        添加 Todo
                    </button>
                    <button
                        onClick={removeLast}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        disabled={todoIds.length === 0}
                    >
                        删除最后一个
                    </button>
                </div>
            </div>

            <div className="space-y-2 mb-6">
                {todoIds.map(id => (
                    <TodoItem key={id} id={id} />
                ))}
            </div>

            <LastTodoStatus />

            <div className="mt-4 p-4 bg-gray-100 rounded">
                <h2 className="font-bold mb-2">当前状态：</h2>
                <p>Todo 数量：{todoIds.length}</p>
                <p>下一个 ID：{nextId}</p>
            </div>
        </div>
    );
}
