'use client';

import {
  useCallback,
  useState,
} from 'react';

import {
  atom,
  useAtom,
} from 'jotai';
import { atomFamily } from 'jotai/utils';

// 定义一个 Todo 类型
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

// 创建一个存储所有 todo ID 的 atom
const todoIdsAtom = atom<number[]>([]);

// 使用 atomFamily 为每个 todo 创建独立的 atom
const todoAtomFamily = atomFamily(
    (id: number) => atom<Todo>({ id, text: '', completed: false }),
    (a, b) => a === b // 使用简单的相等比较，因为我们的 id 是数字
);

// 设置自动清理规则
todoAtomFamily.setShouldRemove((createdAt) => {
    return Date.now() - createdAt > 1000 * 60 * 60; // 1小时后清理
});

// Todo 项组件
function TodoItem({ id }: { id: number }) {
    const [todo, setTodo] = useAtom(todoAtomFamily(id));

    const toggleComplete = () => {
        setTodo(prev => ({ ...prev, completed: !prev.completed }));
    };

    const updateText = (text: string) => {
        setTodo(prev => ({ ...prev, text }));
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
    const [todoIds] = useAtom(todoIdsAtom);
    const lastId = todoIds[todoIds.length - 1];
    const [todo] = useAtom(todoAtomFamily(lastId ?? -1)); // 使用空值合并，确保总是有一个有效的 ID

    if (lastId === undefined) {
        return <div className="text-gray-500">没有 Todo 项</div>;
    }

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
export default function Family() {
    const [todoIds, setTodoIds] = useAtom(todoIdsAtom);
    const [nextId, setNextId] = useState(1);

    // 添加新的 todo
    const addTodo = useCallback(() => {
        setTodoIds(prev => [...prev, nextId]);
        setNextId(id => id + 1);
    }, [nextId]);

    // 删除最后一个 todo
    const removeLast = useCallback(() => {
        setTodoIds(prev => {
            const lastId = prev[prev.length - 1];
            if (lastId !== undefined) {
                // 显式清理被删除的 todo atom
                todoAtomFamily.remove(lastId);
            }
            return prev.slice(0, -1);
        });
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Todo List with atomFamily</h1>
                <p className="text-gray-600 mb-4">
                    这个示例展示了如何使用 atomFamily 来管理多个独立的状态。
                    每个 Todo 项都有自己的 atom 实例，由 atomFamily 管理。
                    下方的状态显示组件演示了 atomFamily 的缓存特性。
                </p>
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
