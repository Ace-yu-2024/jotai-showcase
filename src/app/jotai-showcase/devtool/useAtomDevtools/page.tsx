'use client';

import {
    atom,
    useAtom,
} from 'jotai';
import { useAtomDevtools } from 'jotai-devtools/utils';

// 定义任务接口
interface Task {
    label: string;
    complete: boolean;
}

// 创建任务列表原子
const tasksAtom = atom<Task[]>([
    { label: '学习 React', complete: false },
    { label: '学习 Jotai', complete: false }
]);
tasksAtom.debugLabel = '任务列表';

// 任务调试组件
const TasksDevtools = () => {
    useAtomDevtools(tasksAtom);
    return null;
};

// 任务列表组件
const TaskList = () => {
    const [tasks, setTasks] = useAtom(tasksAtom);

    const toggleTask = (index: number) => {
        setTasks(tasks.map((task, i) =>
            i === index ? { ...task, complete: !task.complete } : task
        ));
    };

    return (
        <ul>
            {tasks.map((task, index) => (
                <li key={index}
                    onClick={() => toggleTask(index)}
                    style={{
                        textDecoration: task.complete ? 'line-through' : 'none',
                        cursor: 'pointer'
                    }}>
                    {task.label}
                </li>
            ))}
        </ul>
    );
};

export default function UseAtomDevtools() {
    return (
        <div>
            <h1>useAtomDevtools 示例</h1>
            <TasksDevtools />
            <TaskList />
            <p>提示：打开 Redux DevTools 查看状态变化</p>
        </div>
    );
}