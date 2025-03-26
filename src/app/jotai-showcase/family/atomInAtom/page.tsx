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

// 创建一个存储所有 todo atoms 的 atom
const todosAtomsAtom = atom<Array<ReturnType<typeof atom<Todo>>>>([]);

// Todo 项组件
function TodoItem({ todoAtom }: { todoAtom: ReturnType<typeof atom<Todo>> }) {
    const [todo, setTodo] = useAtom(todoAtom);

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
    const [todoAtoms] = useAtom(todosAtomsAtom);
    const lastAtom = todoAtoms[todoAtoms.length - 1];
    const [lastTodo] = useAtom(lastAtom ?? atom<Todo>({ id: -1, text: '', completed: false }));

    if (!lastAtom) {
        return <div className="text-gray-500">没有 Todo 项</div>;
    }

    return (
        <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-bold mb-2">最后一个 Todo 的状态（实时同步）：</h3>
            <p>ID: {lastTodo.id}</p>
            <p>内容: {lastTodo.text}</p>
            <p>状态: {lastTodo.completed ? '已完成' : '未完成'}</p>
            <p className="text-sm text-gray-500 mt-2">
                提示：修改上面最后一个 Todo 的内容，这里会实时同步更新
            </p>
            <p className="text-sm text-blue-600 mt-2">
                这个实现使用了 atoms in atom 模式，每个 Todo 仍然有自己的 atom，但是它们被存储在一个父 atom 中
            </p>
        </div>
    );
}

// 主页面组件
export default function AtomInAtom() {
    const [todoAtoms, setTodoAtoms] = useAtom(todosAtomsAtom);
    const [nextId, setNextId] = useState(1);

    // 添加新的 todo
    const addTodo = useCallback(() => {
        const newTodoAtom = atom<Todo>({ id: nextId, text: '', completed: false });
        setTodoAtoms(prev => [...prev, newTodoAtom]);
        setNextId(id => id + 1);
    }, [nextId]);

    // 删除最后一个 todo
    const removeLast = useCallback(() => {
        setTodoAtoms(prev => prev.slice(0, -1));
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Todo List with Atoms in Atom</h1>
                <p className="text-gray-600 mb-4">
                    这个示例展示了如何使用 atoms in atom 模式来模拟 atomFamily 的功能。
                    每个 Todo 项仍然有自己独立的 atom，但是这些 atom 被存储在一个父 atom 中，
                    而不是使用 atomFamily 来管理。这种方式提供了类似的功能，但有一些不同的特点：
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-4">
                    <li>手动管理 atom 的创建和删除</li>
                    <li>没有自动的缓存清理机制</li>
                    <li>更灵活的 atom 组织方式</li>
                    <li>可以直接访问和操作所有 atoms</li>
                </ul>
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
                        disabled={todoAtoms.length === 0}
                    >
                        删除最后一个
                    </button>
                </div>
            </div>

            <div className="space-y-2 mb-6">
                {todoAtoms.map(todoAtom => (
                    <TodoItem key={`${todoAtom}`} todoAtom={todoAtom} />
                ))}
            </div>

            <LastTodoStatus />

            <div className="mt-4 p-4 bg-gray-100 rounded">
                <h2 className="font-bold mb-2">当前状态：</h2>
                <p>Todo 数量：{todoAtoms.length}</p>
                <p>下一个 ID：{nextId}</p>
            </div>
        </div>
    );
}
