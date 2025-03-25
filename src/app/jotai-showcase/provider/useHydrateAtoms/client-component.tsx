
// 客户端组件
'use client';

import {
    atom,
    useAtom,
} from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

interface User {
    name: string;
    age: number;
}

interface Props {
    initialCount: number;
    initialUser: User;
}

// 创建原子
const countAtom = atom(0);
const userAtom = atom({ name: '', age: 0 });

export default function ClientComponent({ initialCount, initialUser }: Props) {
    // 使用 useHydrateAtoms 注水服务器数据
    useHydrateAtoms([
        [countAtom, initialCount],
        [userAtom, initialUser]
    ] as const);  // 使用 as const 来保持类型信息

    // 使用原子
    const [count, setCount] = useAtom(countAtom);
    const [user, setUser] = useAtom(userAtom);

    return (
        <div className="space-y-4">
            <div className="border p-4 rounded">
                <h2>计数器</h2>
                <p>当前值: {count}</p>
                <button
                    onClick={() => setCount(c => c + 1)}
                    className="px-3 py-1 bg-blue-200 rounded"
                >
                    增加
                </button>
            </div>

            <div className="border p-4 rounded">
                <h2>用户信息</h2>
                <div>
                    <label>姓名：</label>
                    <input
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="border px-2 py-1 ml-2"
                    />
                </div>
                <div className="mt-2">
                    <label>年龄：</label>
                    <input
                        type="number"
                        value={user.age}
                        onChange={(e) => setUser({ ...user, age: Number(e.target.value) })}
                        className="border px-2 py-1 ml-2"
                    />
                </div>
            </div>

            <div className="mt-4 text-gray-600">
                <p>说明：</p>
                <ul className="list-disc pl-5">
                    <li>初始值来自服务器端</li>
                    <li>使用 useHydrateAtoms 进行状态注水</li>
                    <li>原子只能被注水一次</li>
                </ul>
            </div>
        </div>
    );
}
