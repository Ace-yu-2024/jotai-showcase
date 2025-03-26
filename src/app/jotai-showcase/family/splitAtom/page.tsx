'use client'

import {
  useCallback,
  useState,
} from 'react';

import {
  atom,
  useAtom,
} from 'jotai';
import { splitAtom } from 'jotai/utils';
import { PrimitiveAtom } from 'jotai/vanilla';

// 定义一个 Todo 类型
interface Todo {
    id: number
    text: string
    completed: boolean
}

// 创建一个基础的todos atom
const baseTodosAtom = atom<Todo[]>([])

// 使用splitAtom将todos列表拆分为单个todo的atom
const todosAtomsAtom = splitAtom(baseTodosAtom)

// Todo 项组件
function TodoItem({ todoAtom }: { todoAtom: PrimitiveAtom<Todo> }) {
    const [todo, setTodo] = useAtom(todoAtom)

    const toggleComplete = () => {
        setTodo((prev) => ({ ...prev, completed: !prev.completed }))
    }

    const updateText = (text: string) => {
        setTodo((prev) => ({ ...prev, text }))
    }

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
                className={`flex-1 px-2 py-1 ${todo.completed ? 'line-through text-gray-500' : ''
                    }`}
            />
        </div>
    )
}

// 显示最后一个 Todo 的状态组件
function LastTodoStatus() {
    const [todoAtoms] = useAtom(todosAtomsAtom)
    const lastAtom = todoAtoms[todoAtoms.length - 1]
    const [lastTodo] = useAtom(lastAtom ?? atom<Todo | null>(null))

    if (!lastTodo) {
        return <div className="text-gray-500">没有 Todo 项</div>
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
        </div>
    )
}

// 主页面组件
export default function SplitAtomExample() {
    const [, setTodosAtoms] = useAtom(todosAtomsAtom)
    const [todoAtoms] = useAtom(todosAtomsAtom)
    const [nextId, setNextId] = useState(1)

    // 添加新的 todo
    const addTodo = useCallback(() => {
        const newTodo: Todo = {
            id: nextId,
            text: '',
            completed: false,
        }
        setTodosAtoms({ type: 'insert', value: newTodo })
        setNextId((id) => id + 1)
    }, [nextId, setTodosAtoms])

    // 删除最后一个 todo
    const removeLast = useCallback(() => {
        setTodosAtoms({ type: 'remove', atom: todoAtoms[todoAtoms.length - 1] })
    }, [setTodosAtoms, todoAtoms])

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Todo List with splitAtom</h1>
                <p className="text-gray-600 mb-4">
                    这个示例展示了如何使用 splitAtom 来管理列表状态。
                    每个 Todo 项都是由 splitAtom 自动创建的独立 atom。
                    相比 atomFamily，splitAtom 更适合管理动态列表数据。
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
                        disabled={todoAtoms.length === 0}
                    >
                        删除最后一个
                    </button>
                </div>
            </div>

            <div className="space-y-2 mb-6">
                {todoAtoms.map((todoAtom) => (
                    <TodoItem key={`todo-${todoAtom}`} todoAtom={todoAtom} />
                ))}
            </div>

            <LastTodoStatus />

            <div className="mt-4 p-4 bg-gray-100 rounded">
                <h2 className="font-bold mb-2">当前状态：</h2>
                <p>Todo 数量：{todoAtoms.length}</p>
                <p>下一个 ID：{nextId}</p>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded">
                <h2 className="font-bold mb-2">splitAtom vs atomFamily 对比：</h2>
                <ul className="list-disc pl-4 space-y-2">
                    <li>
                        <strong>内存管理</strong>：
                        atomFamily 支持自动垃圾回收（通过 setShouldRemove），而 splitAtom
                        需要手动管理内存
                    </li>
                    <li>
                        <strong>使用场景</strong>：
                        atomFamily 更适合通过 ID 访问的静态数据，splitAtom
                        更适合动态列表数据的管理
                    </li>
                    <li>
                        <strong>性能表现</strong>：
                        对于大量数据，atomFamily 可能会有更好的性能，因为它可以懒加载；splitAtom
                        则一次性创建所有 atom
                    </li>
                    <li>
                        <strong>实现复杂度</strong>：
                        splitAtom 的实现更简单直接，不需要维护 ID 映射，而 atomFamily
                        需要额外管理 ID 到 atom 的映射
                    </li>
                    <li>
                        <strong>数据同步</strong>：
                        splitAtom 天然支持列表操作（添加、删除、重排序），而 atomFamily
                        需要额外的逻辑来管理这些操作
                    </li>
                </ul>
            </div>
        </div>
    )
}